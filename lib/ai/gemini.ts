import "server-only";
import { env } from "@/lib/env";

/**
 * Minimal Gemini client. Uses the REST API directly so we don't ship
 * @google/generative-ai as a dependency. Two flavours:
 *   - generateText(prompt) → plain-text completion
 *   - generateJSON<T>(prompt, schema) → JSON output, parsed
 *   - analyzeImage(image, prompt) → multimodal, JSON out
 *
 * All callers must be server-only (server actions or route handlers). The API
 * key never touches the browser.
 */

const MODEL = "gemini-2.5-flash";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string; code?: number };
};

async function call(
  parts: GeminiPart[],
  opts?: { jsonMode?: boolean; maxTokens?: number; temperature?: number },
): Promise<string> {
  if (!env.GOOGLE_GENAI_API_KEY) {
    throw new Error("GOOGLE_GENAI_API_KEY is not set");
  }

  const body = {
    contents: [{ role: "user", parts }],
    generationConfig: {
      temperature: opts?.temperature ?? 0.4,
      maxOutputTokens: opts?.maxTokens ?? 1024,
      ...(opts?.jsonMode ? { responseMimeType: "application/json" } : {}),
    },
  };

  const res = await fetch(`${ENDPOINT}?key=${env.GOOGLE_GENAI_API_KEY}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as GeminiResponse;
  if (!res.ok) {
    throw new Error(`Gemini API error (${res.status}): ${json.error?.message ?? "unknown"}`);
  }
  if (json.promptFeedback?.blockReason) {
    throw new Error(`Gemini blocked the request: ${json.promptFeedback.blockReason}`);
  }
  const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
  if (!text) throw new Error("Gemini returned an empty response");
  return text;
}

export async function generateText(prompt: string, opts?: { maxTokens?: number }) {
  return call([{ text: prompt }], { maxTokens: opts?.maxTokens ?? 800 });
}

export async function generateJSON<T = unknown>(prompt: string): Promise<T> {
  const raw = await call([{ text: prompt }], { jsonMode: true });
  return JSON.parse(raw) as T;
}

/**
 * `image` is a data URL (`data:image/jpeg;base64,...`) — the same format the
 * admin ImageUploader produces before it POSTs to /api/media. We split off the
 * base64 payload and mime type so Gemini's inlineData part accepts it.
 */
export async function analyzeImage<T = unknown>(image: string, prompt: string): Promise<T> {
  const match = image.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error("Image must be a data URL (data:image/...;base64,...)");
  const [, mimeType, data] = match;

  const raw = await call(
    [
      { inlineData: { mimeType, data } },
      { text: prompt },
    ],
    { jsonMode: true, maxTokens: 1200 },
  );
  return JSON.parse(raw) as T;
}
