import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { analyzeJobDescription } from "@/lib/ai/nim";
import { hashString } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { jobDescription } = body;

    if (!jobDescription) {
      return NextResponse.json(
        { error: "jobDescription is required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const cacheKey = hashString(`jd:${jobDescription.slice(0, 500)}`);

    // Check cache
    const { data: cached } = await supabase
      .from("ai_cache")
      .select("response")
      .eq("request_hash", cacheKey)
      .single();

    if (cached?.response) {
      return NextResponse.json(cached.response);
    }

    const result = await analyzeJobDescription(jobDescription);

    // Cache
    await supabase
      .from("ai_cache")
      .upsert({ request_hash: cacheKey, response: result as unknown as Record<string, unknown> })
      .select();

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze JD error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
