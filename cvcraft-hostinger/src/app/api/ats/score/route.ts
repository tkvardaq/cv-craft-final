import { NextRequest, NextResponse } from "next/server";
import { cvSchema, type Sector } from "@/lib/schemas/cv";
import { scoreCV } from "@/lib/ats/scoring-engine";
import { createClient } from "@/lib/supabase/server";
import { logError } from "@/lib/log";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { cv, sector = "general", targetTitle } = body;

    if (!cv) {
      return NextResponse.json(
        { error: "CV data is required" },
        { status: 400 }
      );
    }

    // Validate CV structure
    const parsed = cvSchema.safeParse(cv);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid CV structure", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = scoreCV(parsed.data, sector as Sector, targetTitle);

    return NextResponse.json(result);
  } catch (error) {
    const { id } = logError("api.ats-score", error);
    return NextResponse.json({ error: "Internal server error", id }, { status: 500 });
  }
}
