import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";
import { sanitizeUserText } from "@/lib/utils";

export const dynamic = "force-dynamic";

const STATUSES = ["saved", "applied", "interviewing", "offer", "rejected", "withdrawn"] as const;

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json({ data: data ?? [] });
  } catch (error) {
    const { id } = logError("api.applications.list", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const status = STATUSES.includes(body.status) ? body.status : "saved";

    const payload = {
      user_id: user.id,
      id: body.id || undefined,
      cv_id: body.cv_id || null,
      cover_letter_id: body.cover_letter_id || null,
      company_name: sanitizeUserText(body.company_name, 200),
      role_title: sanitizeUserText(body.role_title, 200),
      location: sanitizeUserText(body.location, 200) || null,
      job_url: sanitizeUserText(body.job_url, 1000) || null,
      salary_range: sanitizeUserText(body.salary_range, 100) || null,
      status,
      applied_at: body.applied_at || null,
      notes: sanitizeUserText(body.notes, 4000) || null,
      updated_at: new Date().toISOString(),
    };

    if (!payload.company_name || !payload.role_title) {
      return NextResponse.json({ error: "Company and role required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("applications")
      .upsert(payload)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error) {
    const { id } = logError("api.applications.upsert", error);
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
      .from("applications")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const { id } = logError("api.applications.delete", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}
