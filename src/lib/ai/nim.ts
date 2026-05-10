import OpenAI from "openai";

const nim = new OpenAI({
  apiKey: process.env.NIM_API_KEY!,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

export async function rewriteBullet(
  bulletText: string,
  jobTitle: string,
  sector: string,
  targetJd?: string
): Promise<string> {
  const response = await nim.chat.completions.create({
    model: "meta/llama-3.1-70b-instruct",
    messages: [
      {
        role: "system",
        content: `You are a professional UK CV writer specialising in the ${sector} sector. You use British English exclusively. You write achievement-oriented bullet points in STAR format (Situation, Task, Action, Result).`,
      },
      {
        role: "user",
        content: `Rewrite this CV bullet point for a ${jobTitle} role in achievement-oriented STAR format using British English and sector-specific terminology. ${targetJd ? `Tailor the bullet to match this target job description: ${targetJd.slice(0, 1000)}` : ""} Return only the rewritten bullet text, nothing else.\n\nOriginal: ${bulletText}`,
      },
    ],
    temperature: 0.7,
    max_tokens: 200,
  });

  return response.choices[0]?.message?.content?.trim() || bulletText;
}

export async function parseCvText(rawText: string): Promise<string> {
  const response = await nim.chat.completions.create({
    model: "meta/llama-3.1-70b-instruct",
    messages: [
      {
        role: "system",
        content: `You are a CV parsing engine. You convert raw CV text into structured JSON. You MUST output ONLY valid JSON with no additional text, markdown, or explanation.`,
      },
      {
        role: "user",
        content: `Convert this raw CV text into the following JSON structure. Output ONLY valid JSON:\n\n{
  "personal": { "firstName": "", "lastName": "", "email": "", "phone": "", "address": "", "linkedin": "" },
  "professionalSummary": "",
  "experience": [{ "id": "uuid", "title": "", "company": "", "location": "", "startDate": "YYYY-MM", "endDate": "YYYY-MM or Present", "bullets": [""] }],
  "education": [{ "id": "uuid", "degree": "", "institution": "", "year": 2024, "grade": "" }],
  "skills": [""],
  "certifications": [""],
  "languages": [""]
}\n\nCV Text:\n${rawText}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 2000,
  });

  return response.choices[0]?.message?.content?.trim() || "{}";
}

export async function analyzeJobDescription(
  jobDescription: string
): Promise<{
  keywords: string[];
  summary: string;
}> {
  const response = await nim.chat.completions.create({
    model: "meta/llama-3.1-70b-instruct",
    messages: [
      {
        role: "system",
        content: `You are a UK recruitment expert. Extract structured data from job descriptions. Output ONLY valid JSON.`,
      },
      {
        role: "user",
        content: `Analyse this UK job description and extract a list of keywords (skills, qualifications, experience) and a short one-sentence summary of what they are looking for.\n\nOutput only valid JSON with keys: "keywords" (array of strings) and "summary" (string).\n\nJob Description:\n${jobDescription}`,
      },
    ],
    temperature: 0.3,
    max_tokens: 1000,
  });

  try {
    return JSON.parse(response.choices[0]?.message?.content || "{}");
  } catch {
    return { keywords: [], summary: "Failed to analyze job description." };
  }
}
