import { getNimClient } from "@/lib/ai/nim";
export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/lib/schemas/cv";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateKey = `summary:${user.id}:${getClientIp(req)}`;
    if (isRateLimited(rateKey, 20, 60 * 60 * 1000)) {
      return NextResponse.json({ error: "Too many summary requests. Try again later." }, { status: 429 });
    }

    const { experience, skills, targetJob, targetJd } = await req.json();

    const experienceText = (Array.isArray(experience) ? experience : []).map((exp: Experience) => 
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
      ${Array.isArray(skills) ? skills.slice(0, 50).join(", ") : ""}
      
      TARGET JOB TITLE:
      ${typeof targetJob === "string" ? targetJob.slice(0, 200) : "General professional role"}

      Keep it professional, high-impact, and avoid clichés like "hardworking professional".
      Use British English exclusively.
      Return ONLY the summary text.
    `;

    const response = await getNimClient().chat.completions.create({
      model: "meta/llama-3.1-405b-instruct",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });
    
    return NextResponse.json({ summary: response.choices[0]?.message?.content });
  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to generate summary" }, { status: 500 });
  }
}
