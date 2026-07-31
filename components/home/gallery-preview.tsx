"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@/components/ui/icons";
import { FALLBACK_GALLERY } from "@/lib/seed";
import { cn } from "@/lib/utils";

type PreviewImage = { id: string; image: string; title: string; category: string };

export function GalleryPreview({ images }: { images?: PreviewImage[] }) {
  // Falls back to the bundled set until the admin has published gallery rows.
  const source = images && images.length ? images : FALLBACK_GALLERY;
  return (
    <section className="section-spacing bg-white">
      <div className="container-tight">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              className="section-label mb-3 inline-flex"
            >
              Portfolio
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: 0.03 }}
              className="heading-section text-ink"
            >
              Our Work Gallery
            </motion.h2>
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ delay: 0.08 }}
          >
            <Button variant="outline" size="sm" asChild>
              <Link href="/gallery" className="flex items-center gap-1.5 text-xs">
                View Full Gallery <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </motion.div>
        </div>

        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3" role="list">
            {source.slice(0, 12).map((item, index) => (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, scale: 0.97 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{ delay: index * 0.025, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className={cn(
                  "relative aspect-[4/5] overflow-hidden rounded-2xl group cursor-pointer",
                  index === 0 && "md:col-span-2 md:row-span-2",
                  index === 4 && "lg:col-span-2"
                )}
                role="listitem"
              >
                <Link
                  href={`/gallery?category=${item.category}`}
                  className="block h-full"
                  aria-label={`View ${item.title} - ${item.category}`}
                >
                  <div className="relative h-full overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover image-zoom"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      unoptimized={item.image.startsWith("data:")}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-400">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold mb-1 block">Gallery</span>
                      <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                      <p className="text-white/60 text-xs capitalize">{item.category.replace("-", " ")}</p>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
