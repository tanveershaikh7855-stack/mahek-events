"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { features } from "@/lib/env";
import { analyzeImage } from "./gemini";
import { runAgent, userTurn, modelTurn, type AgentStep } from "./agent";
import { TOOL_DECLS, runTool } from "./agent-tools";

export type Result<T = void> =
  | { ok: true; data: T; message?: string }
  | { ok: false; error: string };

function ok<T>(data: T, message?: string): Result<T> {
  return { ok: true, data, message };
}
function fail(error: string): Result<never> {
  return { ok: false, error };
}

// ── PRODUCT IMAGE → METADATA ───────────────────────────────────

export type ProductSuggestion = {
  name: string;
  shortDesc: string;
  description: string;
  tags: string[];
  suggestedCategory: string;
  keyFeatures: string[];
};

const PRODUCT_CATEGORIES = [
  "Helium Balloons",
  "Balloon Bouquets",
  "Balloon Packets",
  "Party Supplies",
  "Flower Bouquets",
  "Chrome Balloons",
  "Foil Balloons",
  "Shape Balloons",
  "Number Balloons",
];

export async function analyzeProductImage(imageDataUrl: string): Promise<Result<ProductSuggestion>> {
  await requireAdmin();
  if (!features.gemini) return fail("Gemini AI is not configured. Set GOOGLE_GENAI_API_KEY.");
  if (!imageDataUrl.startsWith("data:")) {
    return fail("Please upload a fresh image (existing URLs can't be re-analyzed).");
  }

  try {
    const prompt = `You are a product-catalog copywriter for Mahek Balloons, a Pune-based helium balloon and event decoration shop.

Look at this image and return ONLY JSON that matches:
{
  "name": string,           // catchy product name, under 60 chars
  "shortDesc": string,      // 1 sentence under 140 chars for cards
  "description": string,    // 2-3 sentences, warm and specific
  "tags": string[],         // 4-8 lowercase kebab-case tags
  "suggestedCategory": string, // must be one of: ${PRODUCT_CATEGORIES.join(", ")}
  "keyFeatures": string[]   // 3-5 short bullet-style highlights
}

Rules:
- Write for Indian customers celebrating birthdays, weddings, baby showers, anniversaries.
- Never invent facts you can't see (colours, shapes, materials only if visible).
- Use INR context; do not include prices.
- Description should feel handcrafted, not template-y.`;

    const result = await analyzeImage<ProductSuggestion>(imageDataUrl, prompt);
    return ok(result, "AI suggestions ready");
  } catch (e) {
    console.error("[analyzeProductImage]", e);
    return fail(e instanceof Error ? e.message : "Could not analyze this image");
  }
}

// ── SERVICE IMAGE → METADATA ───────────────────────────────────

export type ServiceSuggestion = {
  name: string;
  description: string;
  features: string[];
  suggestedPriceFrom: number;
};

export async function analyzeServiceImage(imageDataUrl: string): Promise<Result<ServiceSuggestion>> {
  await requireAdmin();
  if (!features.gemini) return fail("Gemini AI is not configured. Set GOOGLE_GENAI_API_KEY.");
  if (!imageDataUrl.startsWith("data:")) {
    return fail("Please upload a fresh image (existing URLs can't be re-analyzed).");
  }

  try {
    const prompt = `You are writing service listings for Mahek Balloons, a Pune balloon decoration studio.

Look at this decoration setup image and return ONLY JSON:
{
  "name": string,             // service name, under 60 chars, e.g. "Birthday Balloon Arch Setup"
  "description": string,      // 2-3 warm sentences describing what's included and the vibe
  "features": string[],       // 4-6 bullet points: what the customer gets
  "suggestedPriceFrom": number // reasonable starting price in INR (typical range 1500-15000)
}

Rules:
- Only describe what you can actually see (colours, theme, arrangement style).
- Features should be concrete: "Backdrop with 100+ balloons", "Metallic gold accents", "Setup and takedown included".
- Price should reflect visible complexity; simpler setups 1500-3500, elaborate ones 5000-15000.`;

    const result = await analyzeImage<ServiceSuggestion>(imageDataUrl, prompt);
    return ok(result, "AI suggestions ready");
  } catch (e) {
    console.error("[analyzeServiceImage]", e);
    return fail(e instanceof Error ? e.message : "Could not analyze this image");
  }
}

// ── ADMIN AI ASSISTANT (chat + shop context) ───────────────────

type ShopContext = {
  ordersToday: number;
  ordersThisMonth: number;
  pendingOrders: number;
  newBookings: number;
  activeProducts: number;
  lowStockProducts: number;
  totalCustomers: number;
  topSellingHint: string;
};

async function loadShopContext(): Promise<ShopContext> {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const monthStart = new Date(start.getFullYear(), start.getMonth(), 1);

  try {
    const [ordersToday, ordersThisMonth, pendingOrders, newBookings, activeProducts, lowStockRows, customers] =
      await Promise.all([
        prisma.order.count({ where: { createdAt: { gte: start } } }),
        prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
        prisma.order.count({ where: { status: "PENDING" } }),
        prisma.booking.count({ where: { status: "NEW" } }),
        prisma.product.count({ where: { isActive: true } }),
        prisma.product.findMany({ where: { isActive: true, stock: { lt: 5 } }, select: { name: true }, take: 3 }),
        prisma.customer.count(),
      ]);
    return {
      ordersToday,
      ordersThisMonth,
      pendingOrders,
      newBookings,
      activeProducts,
      lowStockProducts: lowStockRows.length,
      totalCustomers: customers,
      topSellingHint: lowStockRows.map((p) => p.name).join(", ") || "none",
    };
  } catch {
    return {
      ordersToday: 0,
      ordersThisMonth: 0,
      pendingOrders: 0,
      newBookings: 0,
      activeProducts: 0,
      lowStockProducts: 0,
      totalCustomers: 0,
      topSellingHint: "database unavailable",
    };
  }
}

export type AssistantReply = { reply: string; actions: string[] };

export async function askAssistant(
  prompt: string,
  history: Array<{ role: "user" | "assistant"; text: string }> = [],
): Promise<Result<AssistantReply>> {
  await requireAdmin();
  if (!features.gemini) return fail("Gemini AI is not configured. Set GOOGLE_GENAI_API_KEY.");
  if (!prompt.trim()) return fail("Please enter a message.");

  try {
    const ctx = await loadShopContext();

    const system = `You are the admin assistant for Mahek Balloons, a Pune helium balloon and event decoration shop. You are not just a chatbot — you can actually make changes in the admin panel by calling the tools provided. Act like a capable, trusted shop manager.

Live shop snapshot (today, ${new Date().toDateString()}):
- Orders today: ${ctx.ordersToday}, this month: ${ctx.ordersThisMonth}, pending: ${ctx.pendingOrders}
- New booking enquiries: ${ctx.newBookings}
- Active products: ${ctx.activeProducts}, low-stock (<5): ${ctx.lowStockProducts} (${ctx.topSellingHint})
- Total customers: ${ctx.totalCustomers}

How to work:
- When the admin asks you to DO something (create/edit/hide/delete a product or service, add a coupon or offer, change prices, update the About page, change years of experience, etc.), USE THE TOOLS to actually do it. Don't just describe how — do it.
- To edit or delete something, first use find_products / find_services to locate it, then act.
- Prices are in Indian Rupees (INR). Interpret "500" as ₹500.
- DELETING is permanent. Before calling delete_product, confirm with the admin in words and wait for a clear "yes". Only then call delete_product with confirm=true.
- If a request is ambiguous (which product? what price?), ask a short clarifying question instead of guessing.
- You can also just answer questions, draft copy (descriptions, WhatsApp/email replies, SEO tags), and give advice — no tool needed for those.

Style: reply in short, friendly, plain text. After making changes, briefly confirm what you did. Keep replies under ~180 words unless asked for more.`;

    const messages = [
      ...history.slice(-8).map((m) => (m.role === "user" ? userTurn(m.text) : modelTurn(m.text))),
      userTurn(prompt),
    ];

    const { text, steps } = await runAgent({
      system,
      messages,
      tools: TOOL_DECLS,
      runTool,
      maxTurns: 6,
    });

    return ok({ reply: text, actions: summarizeSteps(steps) });
  } catch (e) {
    console.error("[askAssistant]", e);
    return fail(e instanceof Error ? e.message : "Could not reach the AI right now");
  }
}

/** Human-readable one-liners of the write actions the agent actually performed. */
function summarizeSteps(steps: AgentStep[]): string[] {
  const out: string[] = [];
  for (const s of steps) {
    const r = s.result as { ok?: boolean; message?: string; error?: string } | undefined;
    // Read-only lookups aren't worth surfacing.
    if (["find_products", "find_services", "list_categories", "get_stats"].includes(s.tool)) continue;
    if (r?.ok) out.push(r.message ?? `${s.tool} done`);
    else if (r?.error) out.push(`⚠️ ${s.tool}: ${r.error}`);
  }
  return out;
}
