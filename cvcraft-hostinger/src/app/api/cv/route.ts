import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { cvSchema, type CV } from "@/lib/schemas/cv";
import { logError } from "@/lib/log";

type CvUpsertData = {
  id?: string;
  user_id: string;
  title: string;
  json_content: CV;
  status: "draft";
  updated_at: string;
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...cvData } = body;
    const validatedData = cvSchema.safeParse(cvData);

    if (!validatedData.success) {
      return NextResponse.json({ error: "Invalid CV data", details: validatedData.error.format() }, { status: 400 });
    }

    // Upsert the CV into the vault. 
    const upsertData: CvUpsertData = {
      user_id: user.id,
      title: validatedData.data.title,
      json_content: validatedData.data,
      status: "draft",
      updated_at: new Date().toISOString(),
    };

    if (id) {
      upsertData.id = id;
    }

    const { data, error } = await supabase
      .from("cv_vault")
      .upsert(upsertData)
      .select()
      .single();

    if (error) {
      logError("cv.supabase", error);
      return NextResponse.json({ error: "Failed to save CV" }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    logError("cv.api", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let query = supabase
      .from("cv_vault")
      .select("*")
      .eq("user_id", user.id);

    if (id) {
      query = query.eq("id", id);
    } else {
      // If no ID, get the most recently updated one
      query = query.order("updated_at", { ascending: false }).limit(1);
    }

    const { data, error } = await query.single();

    if (error && error.code !== "PGRST116") { // PGRST116 is "not found"
      logError("cv.supabase", error);
      return NextResponse.json({ error: "Failed to fetch CV" }, { status: 500 });
    }

    return NextResponse.json({ 
      data: data?.json_content || null,
      id: data?.id || null 
    });
  } catch (error) {
    logError("cv.api", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing CV ID" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error } = await supabase
      .from("cv_vault")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      logError("cv.supabase", error);
      return NextResponse.json({ error: "Failed to delete CV" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    logError("cv.api", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

