import { NextRequest, NextResponse } from "next/server";
import { rewriteBullet } from "@/lib/ai/nim";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
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

    if (!bulletText || !jobTitle) {
      return NextResponse.json(
        { error: "bulletText and jobTitle are required" },
        { status: 400 }
      );
    }

    // Check cache
    const { hashString } = await import("@/lib/utils");
    const cacheKey = hashString(`rewrite:${bulletText}:${jobTitle}:${sector}:${targetJd || ""}`);

    const { data: cached } = await supabase
      .from("ai_cache")
      .select("response")
      .eq("request_hash", cacheKey)
      .single();

    let rewritten: string;

    if (cached?.response) {
      rewritten = (cached.response as { text: string }).text;
    } else {
      rewritten = await rewriteBullet(bulletText, jobTitle, sector || "general", targetJd);

      // Cache result (ignore errors - non-critical)
      await supabase
        .from("ai_cache")
        .upsert({ request_hash: cacheKey, response: { text: rewritten } })
        .select();
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
