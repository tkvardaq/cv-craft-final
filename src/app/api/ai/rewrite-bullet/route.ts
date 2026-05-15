import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { rewriteBullet } from "@/lib/ai/nim";
import { createClient, createOptionalServiceClient } from "@/lib/supabase/server";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

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

    if (!profile?.is_premium && (profile?.credits ?? 0) <= 0) {
      return NextResponse.json(
        { error: "Daily AI rewrite limit reached. Upgrade to Premium for unlimited rewrites.", code: "LIMIT_REACHED" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { bulletText, jobTitle, sector, targetJd } = body;

    if (typeof bulletText !== "string" || typeof jobTitle !== "string" || !bulletText.trim() || !jobTitle.trim()) {
      return NextResponse.json(
        { error: "bulletText and jobTitle are required" },
        { status: 400 }
      );
    }

    // Check cache
    const { hashString } = await import("@/lib/utils");
    const serviceSupabase = await createOptionalServiceClient();
    const cacheKey = hashString(`rewrite:${bulletText.slice(0, 1000)}:${jobTitle.slice(0, 200)}:${sector}:${String(targetJd || "").slice(0, 2000)}`);

    const { data: cached } = serviceSupabase
      ? await serviceSupabase
          .from("ai_cache")
          .select("response")
          .eq("request_hash", cacheKey)
          .single()
      : { data: null };

    let rewritten: string;

    if (cached?.response) {
      rewritten = (cached.response as { text: string }).text;
    } else {
      rewritten = await rewriteBullet(bulletText, jobTitle, sector || "general", targetJd);

      // Cache result (ignore errors - non-critical)
      if (serviceSupabase) {
        await serviceSupabase
          .from("ai_cache")
          .upsert({ request_hash: cacheKey, response: { text: rewritten } })
          .select();
      }
    }

    // Deduct credit for free users
    if (!profile?.is_premium && !cached?.response) {
      await supabase
        .from("profiles")
        .update({ credits: Math.max(0, (profile?.credits ?? 1) - 1) })
        .eq("id", user.id);
    }

    return NextResponse.json({ 
      rewritten, 
      creditsRemaining: profile?.is_premium ? -1 : Math.max(0, (profile?.credits ?? 1) - 1) 
    });
  } catch (error) {
    console.error("Rewrite bullet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
