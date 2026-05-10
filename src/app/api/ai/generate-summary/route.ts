import { ChatNVIDIA } from "@langchain/nvidia-nim";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { experience, skills, targetJob, targetJd } = await req.json();

    const model = new ChatNVIDIA({
      model: "meta/llama-3.1-405b-instruct",
      apiKey: process.env.NIM_API_KEY,
    });

    const experienceText = experience?.map((exp: any) => 
      `${exp.title} at ${exp.company}: ${exp.bullets?.join(". ")}`
    ).join("\n");

    const prompt = `
      You are an expert executive CV writer. 
      Based on the following work experience and skills, generate a compelling 3-4 sentence professional summary.
      Focus on impact, seniority, and specific key skills.
      ${targetJd ? `Tailor the summary to match this target job description: ${targetJd.slice(0, 1000)}` : ""}
      
      EXPERIENCE:
      ${experienceText}
      
      SKILLS:
      ${skills?.join(", ")}
      
      TARGET JOB TITLE:
      ${targetJob || "General professional role"}

      Keep it professional, high-impact, and avoid clichés like "hardworking professional".
      Use British English exclusively.
      Return ONLY the summary text.
    `;

    const response = await model.invoke(prompt);
    
    return NextResponse.json({ summary: response.content });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
