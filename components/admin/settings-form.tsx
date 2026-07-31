"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2, Building2, Phone, Share2, Truck, Search } from "lucide-react";
import { saveSettings } from "@/lib/admin/actions";
import { cn } from "@/lib/utils";

export type SettingsValues = Record<string, string>;

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-border bg-white p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-forest-light flex items-center justify-center flex-shrink-0">
          <Icon className="w-4.5 h-4.5 text-forest" />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-ink">{title}</h2>
          <p className="text-xs text-secondary-text">{description}</p>
        </div>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function SettingsForm({ values }: { values: SettingsValues }) {
  const [pending, start] = useTransition();

  return (
    <form
      action={(formData) =>
        start(async () => {
          const res = await saveSettings(formData);
          if (res.ok) toast.success(res.message ?? "Settings saved");
          else toast.error(res.error);
        })
      }
      className="space-y-5 max-w-3xl"
    >
      <Section
        icon={Building2}
        title="Business details"
        description="Shown across the website header, footer and metadata."
      >
        <div>
          <label className={labelCls}>Business name</label>
          <input name="businessName" defaultValue={values.businessName} className={field} />
        </div>
        <div>
          <label className={labelCls}>Tagline</label>
          <input name="tagline" defaultValue={values.tagline} className={field} />
        </div>
        <div>
          <label className={labelCls}>Address</label>
          <input name="address" defaultValue={values.address} className={field} />
        </div>
      </Section>

      <Section
        icon={Phone}
        title="Contact"
        description="Where customers reach you. Used by call and WhatsApp buttons."
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Email</label>
            <input name="email" type="email" defaultValue={values.email} className={field} />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input name="phone" defaultValue={values.phone} className={field} />
          </div>
        </div>
        <div>
          <label className={labelCls}>WhatsApp number</label>
          <input
            name="whatsapp"
            defaultValue={values.whatsapp}
            placeholder="918087867988"
            className={field}
          />
          <p className="text-[11px] text-secondary-text mt-1">
            Include the country code, digits only.
          </p>
        </div>
      </Section>

      <Section icon={Share2} title="Social links" description="Linked from the site footer.">
        <div>
          <label className={labelCls}>Instagram URL</label>
          <input name="instagram" defaultValue={values.instagram} className={field} />
        </div>
        <div>
          <label className={labelCls}>Facebook URL</label>
          <input name="facebook" defaultValue={values.facebook} className={field} />
        </div>
      </Section>

      <Section
        icon={Truck}
        title="Delivery"
        description="Controls the coverage and free-delivery messaging."
      >
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Delivery radius (KM)</label>
            <input
              name="deliveryRadiusKm"
              type="number"
              min={0}
              defaultValue={values.deliveryRadiusKm}
              className={field}
            />
          </div>
          <div>
            <label className={labelCls}>Free delivery above (₹)</label>
            <input
              name="freeDeliveryAbove"
              type="number"
              min={0}
              defaultValue={values.freeDeliveryAbove}
              className={field}
            />
          </div>
        </div>
      </Section>

      <Section icon={Search} title="SEO" description="Title and description used by search engines.">
        <div>
          <label className={labelCls}>Meta title</label>
          <input name="seoTitle" defaultValue={values.seoTitle} className={field} />
        </div>
        <div>
          <label className={labelCls}>Meta description</label>
          <textarea
            name="seoDescription"
            rows={3}
            defaultValue={values.seoDescription}
            className={cn(field, "resize-none")}
          />
        </div>
      </Section>

      <div className="flex justify-end sticky bottom-4">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-forest-hover disabled:opacity-60"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          Save settings
        </button>
      </div>
    </form>
  );
}
