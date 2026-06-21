import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { rewriteBullet } from "@/lib/ai/nim";
import { createClient, createOptionalServiceClient } from "@/lib/supabase/server";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { hashString, sanitizeUserText } from "@/lib/utils";
import { logError } from "@/lib/log";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const rateKey = `rewrite:${user.id}:${getClientIp(request)}`;
    if (isRateLimited(rateKey, 30, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many rewrite requests. Try again later." }, { status: 429 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("is_premium, credits")
      .eq("id", user.id)
      .single();

    const body = await request.json();
    const bulletText = sanitizeUserText(body.bulletText, 1000);
    const jobTitle = sanitizeUserText(body.jobTitle, 200);
    const sector = sanitizeUserText(body.sector, 100) || "general";
    const targetJd = sanitizeUserText(body.targetJd, 2000);

    if (!bulletText || !jobTitle) {
      return NextResponse.json(
        { error: "bulletText and jobTitle are required" },
        { status: 400 }
      );
    }

    const cacheKey = hashString(`rewrite:v2:${bulletText}:${jobTitle}:${sector}:${targetJd}`);
    const cacheClient = await createOptionalServiceClient();

    const { data: cached } = cacheClient
      ? await cacheClient
          .from("ai_cache")
          .select("response, created_at")
          .eq("request_hash", cacheKey)
          .gt("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .maybeSingle()
      : { data: null };

    let rewritten: string;

    if (cached?.response) {
      rewritten = (cached.response as { text: string }).text;
    } else {
      rewritten = await rewriteBullet(bulletText, jobTitle, sector, targetJd || undefined);

      if (cacheClient) {
        try {
          await cacheClient
            .from("ai_cache")
            .upsert({ request_hash: cacheKey, response: { text: rewritten } });
        } catch (cacheErr) {
          logError("ai.cache.upsert", cacheErr);
        }
      }
    }

    let remainingCredits = profile?.credits ?? 0;
    if (!profile?.is_premium && !cached?.response) {
      const { data: newCredits, error: rpcError } = await supabase.rpc('decrement_credits', {
        user_id: user.id,
        amount: 1
      });

      if (rpcError) {
        if (rpcError.message.includes('Insufficient credits')) {
          return NextResponse.json(
            { error: "Daily AI rewrite limit reached. Upgrade to Premium for unlimited rewrites.", code: "LIMIT_REACHED" },
            { status: 403 }
          );
        }
        logError("ai.credits.decrement", rpcError);
      } else {
        remainingCredits = newCredits;
      }
    }

    return NextResponse.json({
      rewritten,
      creditsRemaining: profile?.is_premium ? -1 : remainingCredits,
    });
  } catch (error) {
    const { id } = logError("api.rewrite-bullet", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}
