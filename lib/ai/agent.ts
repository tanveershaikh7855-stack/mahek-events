import "server-only";
import { env } from "@/lib/env";

/**
 * Gemini function-calling loop. The model may request tool calls; we execute
 * them via `runTool` and feed the results back until it returns a plain-text
 * answer (or we hit `maxTurns`). Returns the final text and every step taken so
 * the UI can show what actually changed.
 */

const MODEL = env.GEMINI_MODEL || "gemini-flash-latest";
const ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

export type ToolDecl = {
  name: string;
  description: string;
  parameters: {
    type: "object";
    properties: Record<string, unknown>;
    required?: string[];
  };
};

// This gateway only accepts USER / MODEL roles (not the "function" role some
// Gemini SDKs use), so tool results are sent back on a "user" turn.
// Gemini 2.5+ attaches a `thoughtSignature` to each functionCall part and
// requires it to be echoed back verbatim when we resend the model's turn —
// omitting it triggers a 400. We carry it through untouched.
type Content = {
  role: "user" | "model";
  parts: Array<
    | { text: string }
    | { functionCall: { name: string; args: Record<string, unknown> }; thoughtSignature?: string }
    | { functionResponse: { name: string; response: Record<string, unknown> } }
  >;
};

export type AgentStep = { tool: string; args: Record<string, unknown>; result: unknown };

type ApiResponse = {
  error?: { message?: string; code?: number };
  candidates?: Array<{
    content?: {
      parts?: Array<{
        text?: string;
        functionCall?: { name: string; args: Record<string, unknown> };
        thoughtSignature?: string;
      }>;
    };
  }>;
};

export function userTurn(text: string): Content {
  return { role: "user", parts: [{ text }] };
}

export function modelTurn(text: string): Content {
  return { role: "model", parts: [{ text }] };
}

export async function runAgent(opts: {
  system: string;
  messages: Content[];
  tools: ToolDecl[];
  runTool: (name: string, args: Record<string, unknown>) => Promise<unknown>;
  maxTurns?: number;
}): Promise<{ text: string; steps: AgentStep[] }> {
  if (!env.GOOGLE_GENAI_API_KEY) throw new Error("GOOGLE_GENAI_API_KEY is not set");

  const contents: Content[] = [...opts.messages];
  const steps: AgentStep[] = [];
  const maxTurns = opts.maxTurns ?? 6;

  for (let turn = 0; turn < maxTurns; turn++) {
    const body = {
      systemInstruction: { parts: [{ text: opts.system }] },
      contents,
      tools: [{ functionDeclarations: opts.tools }],
      generationConfig: { temperature: 0.3, maxOutputTokens: 1200 },
    };

    const res = await fetch(`${ENDPOINT}?key=${env.GOOGLE_GENAI_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as ApiResponse;
    if (!res.ok) {
      throw new Error(`Gemini API error (${res.status}): ${json.error?.message ?? "unknown"}`);
    }

    const parts = json.candidates?.[0]?.content?.parts ?? [];
    const callParts = parts.filter((p) => p.functionCall);

    if (callParts.length === 0) {
      const text = parts.map((p) => p.text ?? "").join("").trim();
      return { text: text || "Done.", steps };
    }

    // Echo the model's function-call turn back verbatim, preserving each
    // thoughtSignature so the follow-up request is accepted.
    contents.push({
      role: "model",
      parts: callParts.map((p) => ({
        functionCall: { name: p.functionCall!.name, args: p.functionCall!.args ?? {} },
        ...(p.thoughtSignature ? { thoughtSignature: p.thoughtSignature } : {}),
      })),
    });

    const responseParts: Content["parts"] = [];
    for (const p of callParts) {
      const c = p.functionCall!;
      let result: unknown;
      try {
        result = await opts.runTool(c.name, c.args ?? {});
      } catch (e) {
        result = { error: e instanceof Error ? e.message : "tool failed" };
      }
      steps.push({ tool: c.name, args: c.args ?? {}, result });
      responseParts.push({
        functionResponse: {
          name: c.name,
          response:
            result && typeof result === "object"
              ? (result as Record<string, unknown>)
              : { value: result },
        },
      });
    }
    contents.push({ role: "user", parts: responseParts });
  }

  return {
    text: "I made the changes I could, then stopped to avoid looping. Please review above.",
    steps,
  };
}
