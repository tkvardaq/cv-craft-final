import { NextRequest, NextResponse } from "next/server";
export const dynamic = "force-dynamic";
import { generateSummary } from "@/lib/ai/nim";
import { createClient } from "@/lib/supabase/server";
import type { Experience } from "@/lib/schemas/cv";
import { getClientIp, isRateLimited } from "@/lib/rate-limit";
import { sanitizeUserText } from "@/lib/utils";
import { logError } from "@/lib/log";

const MAX_EXPERIENCES = 10;
const MAX_SKILLS = 50;
const MAX_BULLETS_PER_EXPERIENCE = 8;

export async function POST(req: NextRequest) {
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

    const safeExperiences: Experience[] = (Array.isArray(experience) ? experience : [])
      .slice(0, MAX_EXPERIENCES)
      .map((exp: Experience) => ({
        ...exp,
        title: sanitizeUserText(exp?.title, 200),
        company: sanitizeUserText(exp?.company, 200),
        bullets: (exp?.bullets ?? [])
          .slice(0, MAX_BULLETS_PER_EXPERIENCE)
          .map((b: string) => sanitizeUserText(b, 500)),
      }));

    const experienceText = safeExperiences
      .map((exp) => `${exp.title} at ${exp.company}: ${exp.bullets?.join(". ")}`)
      .join("\n");

    const safeSkills = (Array.isArray(skills) ? skills : [])
      .slice(0, MAX_SKILLS)
      .map((s: string) => sanitizeUserText(s, 100))
      .filter(Boolean);

    const summary = await generateSummary({
      experienceText: experienceText.slice(0, 6000),
      skills: safeSkills,
      targetJob: sanitizeUserText(targetJob, 200),
      targetJd: targetJd ? sanitizeUserText(targetJd, 1000) : undefined,
    });

    return NextResponse.json({ summary });
  } catch (error) {
    const { id } = logError("api.generate-summary", error);
    return NextResponse.json({ error: "Failed to generate summary", id }, { status: 500 });
  }
}
