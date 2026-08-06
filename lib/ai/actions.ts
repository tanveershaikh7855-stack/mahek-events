"use server";

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { features } from "@/lib/env";
import { analyzeImage, generateText } from "./gemini";

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

export async function askAssistant(
  prompt: string,
  history: Array<{ role: "user" | "assistant"; text: string }> = [],
): Promise<Result<{ reply: string }>> {
  await requireAdmin();
  if (!features.gemini) return fail("Gemini AI is not configured. Set GOOGLE_GENAI_API_KEY.");
  if (!prompt.trim()) return fail("Please enter a message.");

  try {
    const ctx = await loadShopContext();
    const historyBlock = history
      .slice(-8)
      .map((m) => `${m.role === "user" ? "Admin" : "Assistant"}: ${m.text}`)
      .join("\n");

    const systemPrompt = `You are the admin assistant for Mahek Balloons, a Pune helium balloon and event decoration shop. You speak the way a friendly, competent shop manager would — direct, warm, no fluff.

Live shop snapshot (today, ${new Date().toDateString()}):
- Orders today: ${ctx.ordersToday}
- Orders this month: ${ctx.ordersThisMonth}
- Pending orders needing attention: ${ctx.pendingOrders}
- New booking enquiries: ${ctx.newBookings}
- Active products in catalogue: ${ctx.activeProducts}
- Low-stock products (<5 units): ${ctx.lowStockProducts} — ${ctx.topSellingHint}
- Total customers: ${ctx.totalCustomers}

You CAN:
- Draft product descriptions, service copy, marketing text, WhatsApp replies, email replies
- Suggest prices, SEO titles, tag lists
- Answer questions about the numbers above
- Give operational advice (what to prioritise, restock ideas)

You CANNOT (do not pretend you can):
- Directly edit the database, place orders, or send messages. Instead, DRAFT the change and tell the admin exactly where to paste it in the admin panel.
- Access anything not in the snapshot above.

Format: reply in plain readable text. Use short paragraphs and bullet lists when helpful. Keep it under ~250 words unless the admin asks for more.

${historyBlock ? `Recent conversation:\n${historyBlock}\n` : ""}
Admin just asked: ${prompt}

Your reply:`;

    const reply = await generateText(systemPrompt, { maxTokens: 800 });
    return ok({ reply: reply.trim() });
  } catch (e) {
    console.error("[askAssistant]", e);
    return fail(e instanceof Error ? e.message : "Could not reach the AI right now");
  }
}
