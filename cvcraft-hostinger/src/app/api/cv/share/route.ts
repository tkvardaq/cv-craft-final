import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";

export const dynamic = "force-dynamic";

function generateSlug(name: string): string {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 30) || "cv";
  const suffix = Math.random().toString(36).slice(2, 8);
  return `${base}-${suffix}`;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const cvId = String(body.cv_id ?? "");
    const enable = body.enable !== false; // default true

    if (!cvId) return NextResponse.json({ error: "cv_id required" }, { status: 400 });

    const { data: existing, error: fetchErr } = await supabase
      .from("cv_vault")
      .select("id, public_slug, json_content")
      .eq("id", cvId)
      .eq("user_id", user.id)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json({ error: "CV not found" }, { status: 404 });
    }

    if (!enable) {
      const { error } = await supabase
        .from("cv_vault")
        .update({ is_public: false })
        .eq("id", cvId)
        .eq("user_id", user.id);
      if (error) throw error;
      return NextResponse.json({ success: true, is_public: false });
    }

    let slug = existing.public_slug as string | null;
    if (!slug) {
      const content = existing.json_content as
        | { personal?: { firstName?: string; lastName?: string } }
        | null;
      const seed = `${content?.personal?.firstName ?? ""} ${content?.personal?.lastName ?? ""}`.trim() || "cv";

      // Attempt a handful of times to avoid an unlikely unique-constraint collision.
      for (let i = 0; i < 4; i++) {
        const candidate = generateSlug(seed);
        const { error: updErr } = await supabase
          .from("cv_vault")
          .update({ public_slug: candidate, is_public: true })
          .eq("id", cvId)
          .eq("user_id", user.id);
        if (!updErr) {
          slug = candidate;
          break;
        }
        if ((updErr as { code?: string }).code !== "23505") {
          throw updErr;
        }
      }

      if (!slug) {
        return NextResponse.json({ error: "Could not allocate slug" }, { status: 500 });
      }
    } else {
      const { error } = await supabase
        .from("cv_vault")
        .update({ is_public: true })
        .eq("id", cvId)
        .eq("user_id", user.id);
      if (error) throw error;
    }

    return NextResponse.json({ success: true, is_public: true, slug });
  } catch (error) {
    const { id } = logError("api.cv.share", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}
