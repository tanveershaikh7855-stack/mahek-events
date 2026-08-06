import "server-only";
import { runTool } from "./agent-tools";

/**
 * The "local AI" — a deterministic natural-language command engine that runs
 * entirely on our own server. No external API, no quota, no cost, instant, and
 * works with no internet. It understands the common admin commands, extracts the
 * details, and executes real database actions via the shared tool registry.
 *
 * Anything it can't confidently parse returns `null`, so the caller can fall
 * back to the Gemini agent for open-ended / creative requests.
 */

export type LocalResult = { reply: string; actions: string[]; handled: boolean };

type Args = Record<string, unknown>;

// ── entity extractors ──────────────────────────────────────────

/** First rupee/number amount: "₹499", "rs 499", "499 rupees", "for 499". */
function extractPrice(t: string): number | undefined {
  const m =
    t.match(/(?:₹|rs\.?|inr)\s*([0-9][0-9,]*)/i) ||
    t.match(/\b([0-9][0-9,]*)\s*(?:rupees?|rs\b|₹)/i) ||
    t.match(/\b(?:to|at|for|price|=)\s*([0-9][0-9,]*)/i);
  if (!m) return undefined;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** A bare integer anywhere (for stock counts etc). */
function extractInt(t: string): number | undefined {
  const m = t.match(/\b([0-9][0-9,]*)\b/);
  if (!m) return undefined;
  const n = Number(m[1].replace(/,/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

/** Map an action word to an order status. */
function orderStatusFrom(t: string): string | undefined {
  if (/\bconfirm/.test(t)) return "CONFIRMED";
  if (/\bcancel/.test(t)) return "CANCELLED";
  if (/\bready|pickup|collect/.test(t)) return "READY_FOR_PICKUP";
  if (/\bship|dispatch/.test(t)) return "SHIPPED";
  if (/\bdeliver/.test(t)) return "DELIVERED";
  if (/\bcomplet|finish|done/.test(t)) return "COMPLETED";
  if (/\bprocess|prepar|making/.test(t)) return "PROCESSING";
  if (/\brefund/.test(t)) return "REFUNDED";
  if (/\bpending/.test(t)) return "PENDING";
  return undefined;
}

/** Map an action word to a booking status. */
function bookingStatusFrom(t: string): string | undefined {
  if (/\bconfirm/.test(t)) return "CONFIRMED";
  if (/\bcancel/.test(t)) return "CANCELLED";
  if (/\bcomplet|finish|done/.test(t)) return "COMPLETED";
  if (/\bfollow.?up/.test(t)) return "FOLLOW_UP";
  if (/\bnew\b/.test(t)) return "NEW";
  return undefined;
}

/** Extract an order/booking reference like "MB1042", "#1042" or "order 1042". */
function refAfter(raw: string, keyword: RegExp): string | undefined {
  const k = raw.match(keyword);
  if (k) {
    const after = raw.slice(k.index! + k[0].length).match(/#?\s*([a-z0-9][a-z0-9-]{1,})/i);
    if (after) return after[1];
  }
  const token = raw.match(/\b([a-z]{2,4}-?\d{2,})\b/i);
  return token ? token[1] : undefined;
}

function extractPercent(t: string): number | undefined {
  // No trailing \b — "%" is a non-word char, so \b never matches right after it.
  const m = t.match(/\b([0-9]{1,3})\s*(?:%|percent|pct)/i);
  return m ? Number(m[1]) : undefined;
}

const STRIP_WORDS =
  /\b(the|a|an|please|pls|product|item|service|called|named|titled|to|from|in|for|of|my|our|this|that|now|it)\b/gi;

/** Pull out the subject/name of a command. */
function subject(raw: string): string | undefined {
  // 1. Quoted text wins.
  const q = raw.match(/["'“”‘’]([^"'“”‘’]+)["'“”‘’]/);
  if (q) return q[1].trim();
  // 2. After "called" / "named".
  const c = raw.match(/\b(?:called|named|titled)\s+(.+)$/i);
  if (c) return clean(c[1]);
  // 3. After "product"/"service".
  const p = raw.match(/\b(?:product|service|item)\s+(.+)$/i);
  if (p) return clean(p[1]);
  return undefined;
}

/** Trim a tail down to a plausible name: cut at price/keywords, strip fillers. */
function clean(s: string): string {
  let out = s
    .replace(/[,.].*$/, "") // stop at first comma/period
    .replace(/(?:₹|rs\.?|inr).*$/i, "") // stop at a price token
    .replace(/\b(?:to|for|at|from|in)\s+[0-9].*$/i, "")
    .replace(/\b(visible|hidden|active|inactive|now|please|it)\b/gi, "")
    .trim();
  // If it still contains obvious command verbs, drop them.
  out = out.replace(/^\s*(and|then)\s+/i, "").trim();
  return out;
}

/** Name specifically for hide/show/price/stock verbs where the verb leads. */
function subjectAfterVerb(raw: string, verbs: RegExp): string | undefined {
  const m = raw.match(verbs);
  if (!m) return undefined;
  let rest = raw.slice(m.index! + m[0].length);
  // "price of X to 500" → drop leading "of"/"the", cut at "to <n>"
  rest = rest.replace(/^\s*(?:of|for|the|a|an)\s+/i, "");
  rest = rest
    .replace(/\b(?:price|cost|stock|quantity|qty)\b/gi, "")
    .replace(/\bto\s+[0-9].*$/i, "")
    .replace(/(?:₹|rs\.?|inr).*$/i, "")
    .replace(/\b(?:product|service|item)\b/gi, "")
    .trim();
  const cleaned = clean(rest || "");
  return cleaned || undefined;
}

async function exec(tool: string, args: Args) {
  const r = (await runTool(tool, args)) as {
    ok?: boolean;
    message?: string;
    error?: string;
  };
  return r;
}

function done(reply: string, actions: string[] = []): LocalResult {
  return { reply, actions, handled: true };
}

// ── main ───────────────────────────────────────────────────────

export async function localBrain(prompt: string): Promise<LocalResult | null> {
  const raw = prompt.trim();
  const t = raw.toLowerCase();
  if (!t) return null;

  // ---- Data questions / stats ----
  if (
    /\b(how many|stats?|summary|overview|today|pending|dashboard)\b/.test(t) &&
    /\b(order|booking|stock|customer|sale|pending|today|stats?|summary|overview)\b/.test(t)
  ) {
    const s = (await runTool("get_stats", {})) as {
      ordersToday: number;
      ordersThisMonth: number;
      pendingOrders: number;
      newBookings: number;
      activeProducts: number;
      lowStock: string[];
      customers: number;
    };
    const low = s.lowStock.length ? s.lowStock.join(", ") : "none";
    return done(
      `Here's your shop right now:\n` +
        `• Orders today: ${s.ordersToday} (this month: ${s.ordersThisMonth})\n` +
        `• Pending orders: ${s.pendingOrders}\n` +
        `• New booking enquiries: ${s.newBookings}\n` +
        `• Active products: ${s.activeProducts}\n` +
        `• Low stock (<5): ${low}\n` +
        `• Total customers: ${s.customers}`,
    );
  }

  // ---- List products / services ----
  if (/\b(list|show|show me|all)\b.*\bproducts?\b/.test(t)) {
    const r = (await runTool("find_products", { query: "" })) as {
      products: Array<{ name: string; price: number; active: boolean; stock: number }>;
    };
    if (!r.products.length) return done("You have no products yet.");
    const lines = r.products
      .slice(0, 15)
      .map((p) => `• ${p.name} — ₹${p.price}${p.active ? "" : " (hidden)"} · stock ${p.stock}`);
    return done(`Products:\n${lines.join("\n")}`);
  }
  if (/\b(list|show|show me|all)\b.*\bservices?\b/.test(t)) {
    const r = (await runTool("find_services", { query: "" })) as {
      services: Array<{ name: string; priceFrom: number; active: boolean }>;
    };
    if (!r.services.length) return done("You have no services yet.");
    const lines = r.services
      .slice(0, 15)
      .map((s) => `• ${s.name} — from ₹${s.priceFrom}${s.active ? "" : " (hidden)"}`);
    return done(`Services:\n${lines.join("\n")}`);
  }

  // ---- Orders: change status ----
  if (/\border\b/.test(t) && orderStatusFrom(t)) {
    const ref = refAfter(raw, /\border\b/i);
    const status = orderStatusFrom(t)!;
    if (ref) {
      const r = await exec("set_order_status", { query: ref, status });
      return r.ok
        ? done(`Order ${ref} marked ${status.replace(/_/g, " ").toLowerCase()}. The customer has been notified.`, [r.message ?? "Order updated"])
        : done(`Couldn't update order ${ref}: ${r.error}`);
    }
    return done("Which order number? e.g. “confirm order MB1042”.");
  }

  // ---- Orders: list ----
  if (/\border(s)?\b/.test(t) && /\b(list|show|recent|latest|view|see|which|what)\b/.test(t)) {
    const status = orderStatusFrom(t);
    const r = (await runTool("find_orders", status ? { status } : {})) as {
      orders: Array<{ orderNumber: string; status: string; customer: string; total: number; placed: string }>;
    };
    if (!r.orders.length) return done(status ? `No ${status.toLowerCase()} orders.` : "No orders yet.");
    const lines = r.orders.map(
      (o) => `• ${o.orderNumber} — ${o.customer ?? "customer"} · ₹${o.total} · ${o.status.replace(/_/g, " ").toLowerCase()} (${o.placed})`,
    );
    return done(`${status ? status[0] + status.slice(1).toLowerCase() + " orders" : "Recent orders"}:\n${lines.join("\n")}`);
  }

  // ---- Bookings: change status ----
  if (/\bbooking\b/.test(t) && bookingStatusFrom(t)) {
    const ref = refAfter(raw, /\bbooking\b/i);
    const status = bookingStatusFrom(t)!;
    if (ref) {
      const r = await exec("set_booking_status", { query: ref, status });
      return r.ok
        ? done(`Booking ${ref} marked ${status.replace(/_/g, " ").toLowerCase()}.`, [r.message ?? "Booking updated"])
        : done(`Couldn't update booking ${ref}: ${r.error}`);
    }
    return done("Which booking number? e.g. “confirm booking BK1042”.");
  }

  // ---- Bookings: list ----
  if (/\bbooking(s)?\b/.test(t) && /\b(list|show|recent|latest|view|see|new|which|what)\b/.test(t)) {
    const status = bookingStatusFrom(t);
    const r = (await runTool("find_bookings", status ? { status } : {})) as {
      bookings: Array<{ bookingNumber: string; status: string; eventType: string; customer: string; eventDate: string | null }>;
    };
    if (!r.bookings.length) return done(status ? `No ${status.toLowerCase()} bookings.` : "No bookings yet.");
    const lines = r.bookings.map(
      (b) => `• ${b.bookingNumber} — ${b.eventType} · ${b.customer ?? "customer"} · ${b.status.toLowerCase()}${b.eventDate ? ` (event ${b.eventDate})` : ""}`,
    );
    return done(`${status ? "Bookings" : "Recent bookings"}:\n${lines.join("\n")}`);
  }

  // ---- About page: years of experience / stats ----
  if (/\b(year|experience|expirience|exp)\b/.test(t) && /\babout\b|experience/.test(t)) {
    const years = raw.match(/\b(\d{1,3}\s*\+?)\b/);
    if (years) {
      const r = await exec("update_about_page", { yearsExperience: years[1].replace(/\s+/g, "") });
      return r.ok
        ? done("Updated the years of experience on the About page.", [r.message ?? "About updated"])
        : done(`Couldn't update the About page: ${r.error}`);
    }
  }
  if (/\bhappy customers?\b/.test(t)) {
    const n = extractInt(t);
    if (n !== undefined) {
      const r = await exec("update_about_page", { happyCustomers: String(n) });
      return r.ok ? done("Updated the happy-customers number.", [r.message ?? "About updated"]) : done(`Couldn't update: ${r.error}`);
    }
  }

  // ---- Create coupon ----
  if (/\bcoupon\b/.test(t) && /\b(add|create|new|make)\b/.test(t)) {
    const code = raw.match(/\b([A-Z][A-Z0-9]{2,20})\b/)?.[1];
    const pct = extractPercent(t);
    const flat = pct === undefined ? extractPrice(t) : undefined;
    const minOrder = raw.match(/\b(?:above|over|min(?:imum)?)\s*(?:₹|rs\.?)?\s*([0-9][0-9,]*)/i);
    if (!code) return done("Tell me the coupon code, e.g. “create coupon DIWALI20 for 20% off”.");
    const r = await exec("create_coupon", {
      code,
      type: pct !== undefined ? "PERCENTAGE" : "FIXED",
      value: pct ?? flat ?? 0,
      minOrder: minOrder ? Number(minOrder[1].replace(/,/g, "")) : undefined,
    });
    return r.ok
      ? done(`Created coupon ${code}.`, [r.message ?? "Coupon created"])
      : done(`Couldn't create the coupon: ${r.error}`);
  }

  // ---- Product: hide / show ----
  const hideProduct = /\b(hide|unpublish|disable|deactivate)\b.*\bproduct\b|\bhide\b\s+["']/.test(t) || (/\bhide\b/.test(t) && !/service/.test(t));
  const showProduct = /\b(show|unhide|publish|enable|activate)\b.*\bproduct\b/.test(t) || (/\b(unhide|publish)\b/.test(t) && !/service/.test(t));
  if ((hideProduct || showProduct) && !/service/.test(t)) {
    const name = subject(raw) || subjectAfterVerb(raw, /\b(hide|unhide|show|publish|unpublish|disable|enable|activate|deactivate)\b/i);
    if (name) {
      const r = await exec("set_product_visibility", { query: name, active: showProduct });
      return r.ok
        ? done(`${showProduct ? "Showing" : "Hiding"} “${name}”.`, [r.message ?? "Updated"])
        : done(`Couldn't update “${name}”: ${r.error}`);
    }
  }

  // ---- Service: hide / show ----
  if (/service/.test(t) && /\b(hide|show|unhide|publish|disable|enable|activate|deactivate)\b/.test(t)) {
    const show = /\b(show|unhide|publish|enable|activate)\b/.test(t);
    const name = subject(raw) || subjectAfterVerb(raw, /\b(hide|unhide|show|publish|disable|enable|activate|deactivate)\b/i);
    if (name) {
      const r = await exec("set_service_visibility", { query: name, active: show });
      return r.ok
        ? done(`${show ? "Showing" : "Hiding"} the “${name}” service.`, [r.message ?? "Updated"])
        : done(`Couldn't update: ${r.error}`);
    }
  }

  // ---- Product: change price ----
  if (/\b(price|cost)\b/.test(t) && /\b(change|set|update|make|to)\b/.test(t) && !/service/.test(t)) {
    const price = extractPrice(t);
    const name = subjectAfterVerb(raw, /\b(?:price|cost)\s+(?:of|for)?/i) || subject(raw);
    if (price !== undefined && name) {
      const r = await exec("update_product", { query: name, price });
      return r.ok
        ? done(`Set “${name}” price to ₹${price}.`, [r.message ?? "Updated"])
        : done(`Couldn't update “${name}”: ${r.error}`);
    }
  }

  // ---- Product: set stock ----
  if (/\bstock\b|\bquantity\b|\bqty\b/.test(t) && !/service/.test(t)) {
    const stock = extractInt(t.replace(/<\s*5|less than 5/g, ""));
    const name = subjectAfterVerb(raw, /\b(?:stock|quantity|qty)\s+(?:of|for)?/i) || subject(raw);
    if (stock !== undefined && name) {
      const r = await exec("update_product", { query: name, stock });
      return r.ok
        ? done(`Set “${name}” stock to ${stock}.`, [r.message ?? "Updated"])
        : done(`Couldn't update “${name}”: ${r.error}`);
    }
  }

  // ---- Product: delete (needs confirm word) ----
  if (/\b(delete|remove|erase)\b/.test(t) && !/service/.test(t) && /\bproduct\b|["']/.test(t)) {
    const name = subject(raw) || subjectAfterVerb(raw, /\b(delete|remove|erase)\b/i);
    if (name) {
      const confirmed = /\b(confirm|yes|for sure|definitely|permanently)\b/.test(t);
      if (!confirmed) {
        return done(
          `⚠️ Deleting is permanent. To confirm, type:  delete product "${name}" confirm`,
        );
      }
      const r = await exec("delete_product", { query: name, confirm: true });
      return r.ok
        ? done(`Deleted “${name}”.`, [r.message ?? "Deleted"])
        : done(`Couldn't delete “${name}”: ${r.error}`);
    }
  }

  // ---- Service: delete ----
  if (/\b(delete|remove|erase)\b/.test(t) && /service/.test(t)) {
    const name = subject(raw) || subjectAfterVerb(raw, /\b(delete|remove|erase)\b/i);
    if (name) {
      const confirmed = /\b(confirm|yes|permanently)\b/.test(t);
      if (!confirmed) {
        return done(`⚠️ Deleting is permanent. To confirm, type:  delete service "${name}" confirm`);
      }
      const r = await exec("delete_service", { query: name, confirm: true });
      return r.ok ? done(`Deleted the “${name}” service.`, [r.message ?? "Deleted"]) : done(`Couldn't delete: ${r.error}`);
    }
  }

  // ---- Create product ----
  if (/\b(add|create|new|make)\b/.test(t) && /\bproduct\b/.test(t)) {
    const after = raw.replace(/^.*?\bproduct\b[:\-\s]*/i, "");
    const price = extractPrice(after);
    const catM = after.match(/\bin\s+([a-z0-9 &'-]+?)\s*$/i);
    const category = catM ? catM[1].trim() : undefined;
    let name = after.split(",")[0].trim();
    // Cut the name before a price token if commas weren't used.
    name = name.replace(/(?:₹|rs\.?|inr).*$/i, "").replace(/\bfor\s+[0-9].*$/i, "").trim();
    if (name && price !== undefined) {
      const r = await exec("create_product", { name, price, category });
      return r.ok
        ? done(`Created product “${name}” at ₹${price}${category ? ` in ${category}` : ""}.`, [r.message ?? "Created"])
        : done(`Couldn't create it: ${r.error}`);
    }
    if (name && price === undefined) {
      return done(`What price should “${name}” be? e.g. “add product ${name} ₹499”.`);
    }
  }

  // ---- Create service ----
  if (/\b(add|create|new|make)\b/.test(t) && /\bservice\b/.test(t)) {
    const after = raw.replace(/^.*?\bservice\b[:\-\s]*/i, "");
    const price = extractPrice(after);
    let name = after.split(",")[0].trim();
    name = name.replace(/\bfrom\b.*$/i, "").replace(/(?:₹|rs\.?|inr).*$/i, "").trim();
    if (name && price !== undefined) {
      const r = await exec("create_service", {
        name,
        description: `${name} by Mahek Balloons — get in touch for a custom quote and theme.`,
        priceFrom: price,
      });
      return r.ok
        ? done(`Created service “${name}” from ₹${price}.`, [r.message ?? "Created"])
        : done(`Couldn't create it: ${r.error}`);
    }
    if (name && price === undefined) {
      return done(`What starting price for the “${name}” service? e.g. “add service ${name} from ₹3500”.`);
    }
  }

  // Not confidently understood — let the caller try the smart (Gemini) path.
  return null;
}
