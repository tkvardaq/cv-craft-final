import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { analyzeJobDescription } from "@/lib/ai/nim";
import { hashString, sanitizeUserText } from "@/lib/utils";
import { createClient, createOptionalServiceClient } from "@/lib/supabase/server";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { logError } from "@/lib/log";

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
    const jobDescription = sanitizeUserText(body.jobDescription, MAX_JD_LENGTH);

    if (!jobDescription) {
      return NextResponse.json({ error: "jobDescription is required" }, { status: 400 });
    }

    const cacheClient = await createOptionalServiceClient();
    const cacheKey = hashString(`jd:v2:${jobDescription}`);

    const { data: cached } = cacheClient
      ? await cacheClient
          .from("ai_cache")
          .select("response, created_at")
          .eq("request_hash", cacheKey)
          .gt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .maybeSingle()
      : { data: null };

    if (cached?.response) {
      return NextResponse.json(cached.response);
    }

    const result = await analyzeJobDescription(jobDescription);

    if (cacheClient) {
      try {
        await cacheClient
          .from("ai_cache")
          .upsert({
            request_hash: cacheKey,
            response: result as unknown as Record<string, unknown>,
          });
      } catch (cacheErr) {
        logError("ai.cache.upsert", cacheErr);
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const { id } = logError("api.analyze-jd", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}
