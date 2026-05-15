import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { analyzeJobDescription } from "@/lib/ai/nim";
import { hashString } from "@/lib/utils";
import { createClient, createOptionalServiceClient } from "@/lib/supabase/server";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const MAX_JD_LENGTH = 12000;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateKey = `analyze-jd:${user.id}:${getClientIp(request)}`;
    if (isRateLimited(rateKey, 20, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many analysis requests. Try again later." }, { status: 429 });
    }

    const body = await request.json();
    const { jobDescription } = body;

    if (typeof jobDescription !== "string" || !jobDescription.trim()) {
      return NextResponse.json(
        { error: "jobDescription is required" },
        { status: 400 }
      );
    }

    const trimmedJobDescription = jobDescription.trim().slice(0, MAX_JD_LENGTH);
    const serviceSupabase = await createOptionalServiceClient();
    const cacheKey = hashString(`jd:${trimmedJobDescription}`);

    const { data: cached } = serviceSupabase
      ? await serviceSupabase
          .from("ai_cache")
          .select("response")
          .eq("request_hash", cacheKey)
          .single()
      : { data: null };

    if (cached?.response) {
      return NextResponse.json(cached.response);
    }

    const result = await analyzeJobDescription(trimmedJobDescription);

    if (serviceSupabase) {
      await serviceSupabase
        .from("ai_cache")
        .upsert({ request_hash: cacheKey, response: result as unknown as Record<string, unknown> })
        .select();
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Analyze JD error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
