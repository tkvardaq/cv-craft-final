import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { sanitizeUserText } from "@/lib/utils";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const TONES = ["professional", "enthusiastic", "concise", "formal"] as const;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("cover_letters")
      .select("id, title, company_name, role_title, tone, updated_at, cv_id")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;

    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    const { id } = logError("api.cover-letters.list", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (isRateLimited(`cover-letter-write:${user.id}:${getClientIp(req)}`, 30, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const body = await req.json();
    const tone = TONES.includes(body.tone) ? body.tone : "professional";

    const payload = {
      user_id: user.id,
      id: body.id || undefined,
      cv_id: body.cv_id || null,
      title: sanitizeUserText(body.title, 200) || "Untitled Cover Letter",
      company_name: sanitizeUserText(body.company_name, 200) || null,
      role_title: sanitizeUserText(body.role_title, 200) || null,
      recipient_name: sanitizeUserText(body.recipient_name, 200) || null,
      job_description: sanitizeUserText(body.job_description, 8000, true) || null,
      body: sanitizeUserText(body.body, 12000, true),
      tone,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("cover_letters")
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    const { id } = logError("api.cover-letters.upsert", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase
      .from("cover_letters")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const { id } = logError("api.cover-letters.delete", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}
