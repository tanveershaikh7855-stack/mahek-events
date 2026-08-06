"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { saveAbout } from "@/lib/admin/actions";
import { ImageUploader } from "./shared/image-uploader";
import { cn } from "@/lib/utils";

export type AboutRow = {
  title: string | null;
  highlight: string | null;
  description: string | null;
  storyImage: string | null;
  story: string[];
  yearsExperience: string | null;
  happyCustomers: string | null;
  eventsDecorated: string | null;
  awardsWon: string | null;
  ctaTitle: string | null;
  ctaSubtitle: string | null;
};

const field =
  "w-full rounded-xl border border-border bg-white px-3 py-2 text-sm focus:outline-none focus:border-forest";
const labelCls = "text-xs font-medium text-ink block mb-1";

export function AboutManager({ about }: { about: AboutRow }) {
  const [pending, start] = useTransition();

  return (
    <form
      action={(formData) =>
        start(async () => {
          const res = await saveAbout(formData);
          if (res.ok) toast.success(res.message ?? "Saved");
          else toast.error(res.error);
        })
      }
      className="space-y-8 max-w-3xl"
    >
      <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Hero section</h3>
        <div>
          <label className={labelCls}>Heading</label>
          <input
            name="title"
            defaultValue={about.title ?? ""}
            placeholder="e.g. Crafting Celebrations,"
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>Highlight (green text on second line)</label>
          <input
            name="highlight"
            defaultValue={about.highlight ?? ""}
            placeholder="e.g. Building Memories"
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>Description</label>
          <textarea
            name="description"
            defaultValue={about.description ?? ""}
            rows={3}
            placeholder="e.g. Mahek Balloons is Pune's trusted balloon studio…"
            className={cn(field, "resize-none")}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Stats row</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Happy customers</label>
            <input
              name="happyCustomers"
              defaultValue={about.happyCustomers ?? ""}
              placeholder="5000+"
              className={field}
            />
          </div>
          <div>
            <label className={labelCls}>Events decorated</label>
            <input
              name="eventsDecorated"
              defaultValue={about.eventsDecorated ?? ""}
              placeholder="1000+"
              className={field}
            />
          </div>
          <div>
            <label className={labelCls}>Years experience</label>
            <input
              name="yearsExperience"
              defaultValue={about.yearsExperience ?? ""}
              placeholder="30+"
              className={field}
            />
          </div>
          <div>
            <label className={labelCls}>Awards won</label>
            <input
              name="awardsWon"
              defaultValue={about.awardsWon ?? ""}
              placeholder="15+"
              className={field}
            />
          </div>
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Our story</h3>
        <ImageUploader
          name="storyImage"
          label="Story image (shown next to the paragraphs)"
          defaultValue={about.storyImage ? [about.storyImage] : []}
          multiple={false}
        />
        <div>
          <label className={labelCls}>Story paragraphs (one per line)</label>
          <textarea
            name="story"
            defaultValue={about.story.join("\n")}
            rows={7}
            placeholder={"We started in 1994 in a small studio near Saras Baug…\nToday, we serve 5000+ families across Pune…"}
            className={cn(field, "resize-none")}
          />
        </div>
      </section>

      <section className="space-y-4 rounded-2xl border border-border bg-white p-5">
        <h3 className="text-sm font-semibold text-ink">Call-to-action banner</h3>
        <div>
          <label className={labelCls}>Title</label>
          <input
            name="ctaTitle"
            defaultValue={about.ctaTitle ?? ""}
            placeholder="Ready to Create Your Perfect Event?"
            className={field}
          />
        </div>
        <div>
          <label className={labelCls}>Subtitle</label>
          <textarea
            name="ctaSubtitle"
            defaultValue={about.ctaSubtitle ?? ""}
            rows={2}
            placeholder="Get in touch with us today for a free consultation…"
            className={cn(field, "resize-none")}
          />
        </div>
      </section>

      <div className="sticky bottom-4 flex justify-end">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center gap-2 rounded-xl bg-forest px-6 py-3 text-sm font-semibold text-white hover:bg-forest-hover disabled:opacity-60 shadow-lg"
        >
          {pending && <Loader2 className="w-4 h-4 animate-spin" />}
          Save About Page
        </button>
      </div>
    </form>
  );
}
