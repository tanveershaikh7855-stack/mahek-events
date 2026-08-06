"use client";

import { useMemo, useState } from "react";
import { Plus, Trash2, Layers } from "lucide-react";

export type VariantOption = { name: string; price?: number };
export type VariantGroup = { label: string; options: VariantOption[] };

const field =
  "w-full rounded-lg border border-border bg-white px-2.5 py-1.5 text-sm focus:outline-none focus:border-forest";

/**
 * Structured editor for product variant groups with per-option pricing.
 * Serializes to a hidden input named by `name` as JSON in the shape:
 *   [{ label, options: string[], optionPrices?: { [option]: number } }]
 * The saveProduct action parses that JSON and stores it in Product.variants.
 */
export function VariantsEditor({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: VariantGroup[];
}) {
  const [groups, setGroups] = useState<VariantGroup[]>(defaultValue);

  const serialized = useMemo(() => {
    const clean = groups
      .map((g) => {
        const options = g.options.map((o) => o.name.trim()).filter(Boolean);
        const optionPrices: Record<string, number> = {};
        for (const o of g.options) {
          const n = o.name.trim();
          if (n && typeof o.price === "number" && Number.isFinite(o.price) && o.price >= 0) {
            optionPrices[n] = o.price;
          }
        }
        const label = g.label.trim();
        if (!label || options.length === 0) return null;
        return Object.keys(optionPrices).length
          ? { label, options, optionPrices }
          : { label, options };
      })
      .filter(Boolean);
    return JSON.stringify(clean);
  }, [groups]);

  function updateGroup(idx: number, patch: Partial<VariantGroup>) {
    setGroups((prev) => prev.map((g, i) => (i === idx ? { ...g, ...patch } : g)));
  }
  function updateOption(gIdx: number, oIdx: number, patch: Partial<VariantOption>) {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gIdx
          ? { ...g, options: g.options.map((o, j) => (j === oIdx ? { ...o, ...patch } : o)) }
          : g,
      ),
    );
  }
  function addGroup() {
    setGroups((prev) => [...prev, { label: "", options: [{ name: "" }] }]);
  }
  function removeGroup(idx: number) {
    setGroups((prev) => prev.filter((_, i) => i !== idx));
  }
  function addOption(gIdx: number) {
    setGroups((prev) =>
      prev.map((g, i) => (i === gIdx ? { ...g, options: [...g.options, { name: "" }] } : g)),
    );
  }
  function removeOption(gIdx: number, oIdx: number) {
    setGroups((prev) =>
      prev.map((g, i) =>
        i === gIdx ? { ...g, options: g.options.filter((_, j) => j !== oIdx) } : g,
      ),
    );
  }

  return (
    <div className="space-y-3">
      <input type="hidden" name={name} value={serialized} />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-ink flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" /> Options with pricing
          </p>
          <p className="text-[11px] text-secondary-text mt-0.5">
            e.g. Size → 12 inch (₹899), 18 inch (₹1299). Leave price blank to use the base price.
          </p>
        </div>
        <button
          type="button"
          onClick={addGroup}
          className="inline-flex items-center gap-1 rounded-lg border border-border bg-white px-2.5 py-1.5 text-xs font-medium hover:bg-secondary"
        >
          <Plus className="w-3.5 h-3.5" /> Add option group
        </button>
      </div>

      {groups.length === 0 && (
        <p className="text-xs text-secondary-text bg-secondary rounded-lg p-3">
          No variants. Add a group like &quot;Size&quot; or &quot;Colour&quot; to let customers pick.
        </p>
      )}

      {groups.map((g, gIdx) => (
        <div key={gIdx} className="rounded-xl border border-border bg-white p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              value={g.label}
              onChange={(e) => updateGroup(gIdx, { label: e.target.value })}
              placeholder="Group name (e.g. Size)"
              className={field}
            />
            <button
              type="button"
              onClick={() => removeGroup(gIdx)}
              className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
              aria-label="Remove group"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1.5">
            {g.options.map((o, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2">
                <input
                  value={o.name}
                  onChange={(e) => updateOption(gIdx, oIdx, { name: e.target.value })}
                  placeholder="Option (e.g. 12 inch)"
                  className={field}
                />
                <input
                  type="number"
                  min={0}
                  step="1"
                  value={o.price ?? ""}
                  onChange={(e) => {
                    const raw = e.target.value;
                    updateOption(gIdx, oIdx, {
                      price: raw === "" ? undefined : Number(raw),
                    });
                  }}
                  placeholder="₹ price (optional)"
                  className={`${field} w-40`}
                />
                <button
                  type="button"
                  onClick={() => removeOption(gIdx, oIdx)}
                  className="p-1.5 rounded-md text-red-500 hover:bg-red-50"
                  aria-label="Remove option"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addOption(gIdx)}
              className="inline-flex items-center gap-1 text-xs font-medium text-forest hover:underline"
            >
              <Plus className="w-3 h-3" /> Add option
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
