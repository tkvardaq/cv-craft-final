import { NextRequest, NextResponse } from "next/server";
import { cvSchema, type Sector } from "@/lib/schemas/cv";
import { scoreCV } from "@/lib/ats/scoring-engine";

export async function POST(request: NextRequest) {
  try {
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
    console.error("ATS Score error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
