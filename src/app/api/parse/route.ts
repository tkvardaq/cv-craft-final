import { NextRequest, NextResponse } from "next/server";
import { parseCvText } from "@/lib/ai/nim";
import { createClient } from "@/lib/supabase/server";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateKey = `parse:${user.id}:${getClientIp(request)}`;
    if (isRateLimited(rateKey, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many parse requests. Try again later." }, { status: 429 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are accepted" },
        { status: 400 }
      );
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "PDF is too large. Please upload a file under 10 MB." },
        { status: 413 }
      );
    }

    // Extract text from PDF
    const buffer = Buffer.from(await file.arrayBuffer());
    let rawText = "";

    try {
      const pdfParse = (await import("pdf-parse")).default;
      const pdfData = await pdfParse(buffer);
      rawText = pdfData.text;
    } catch (err) {
      console.error("PDF parse error:", err);
      return NextResponse.json(
        { error: "Could not extract text from this PDF. Please ensure it contains selectable text (not a scanned image)." },
        { status: 422 }
      );
    }

    if (!rawText || rawText.trim().length < 50) {
      return NextResponse.json(
        { error: "PDF appears to contain very little text. Please upload a text-based CV." },
        { status: 422 }
      );
    }

    // Use NIM to convert raw text to structured JSON
    const jsonString = await parseCvText(rawText.slice(0, 8000));

    let parsedCv;
    try {
      // Try to extract JSON from response (handle markdown code blocks)
      let cleanJson = jsonString;
      const jsonMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (jsonMatch) {
        cleanJson = jsonMatch[1];
      }
      parsedCv = JSON.parse(cleanJson);
    } catch {
      return NextResponse.json(
        { error: "Failed to structure CV data. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ cv: parsedCv });
  } catch (error) {
    console.error("Parse API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
