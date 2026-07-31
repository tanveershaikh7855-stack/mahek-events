"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { galleryCategories } from "@/lib/content";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All Work" },
  ...galleryCategories.filter((c) => c !== "All Work").map((c) => ({ value: c.toLowerCase().replace(/ /g, "-"), label: c })),
];

export type GalleryItem = {
  id: string;
  image: string;
  title: string;
  category: string;
  mediaType?: "IMAGE" | "VIDEO";
  poster?: string | null;
};

export function GalleryPageClient({ images }: { images: GalleryItem[] }) {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return images;
    return images.filter((item) => item.category === selectedCategory);
  }, [images, selectedCategory]);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
        <div className="container-tight">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="heading-section text-ink"
              >
                Our Work Gallery
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="body-large mt-4 max-w-xl"
              >
                Real projects, real celebrations. Browse through our portfolio of beautifully decorated events.
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mt-8"
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  selectedCategory === cat.value
                    ? "bg-forest text-white shadow-sm shadow-forest/20"
                    : "bg-secondary text-secondary-text hover:bg-border"
                )}
              >
                {cat.label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-tight">
          <div className="columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
            {filtered.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04, duration: 0.5 }}
                className="break-inside-avoid group relative rounded-2xl overflow-hidden cursor-pointer"
                onClick={() => setLightboxItem(item)}
              >
                <div className="relative w-full" style={{ aspectRatio: index % 3 === 0 ? "3/4" : "4/5" }}>
                  {item.mediaType === "VIDEO" ? (
                    <>
                      <video
                        src={item.image}
                        poster={item.poster ?? undefined}
                        className="absolute inset-0 w-full h-full object-cover image-zoom"
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                        onMouseLeave={(e) => {
                          e.currentTarget.pause();
                          e.currentTarget.currentTime = 0;
                        }}
                      />
                      <span className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white">
                        ▶ Video
                      </span>
                    </>
                  ) : (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover image-zoom"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      loading="lazy"
                      unoptimized={item.image.startsWith("data:")}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white font-semibold text-sm">{item.title}</span>
                    <p className="text-white/70 text-xs capitalize">{item.category}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <ImageIcon className="w-16 h-16 mx-auto text-border mb-4" />
              <h3 className="text-xl font-semibold text-ink mb-2">No images found</h3>
              <p className="text-secondary-text mb-6">Try selecting a different category.</p>
              <Button variant="outline" className="rounded-full" onClick={() => setSelectedCategory("all")}>
                View All
              </Button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightboxItem && (
          <Dialog open={!!lightboxItem} onOpenChange={() => setLightboxItem(null)}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
              <DialogClose className="absolute top-4 right-4 z-10 text-white hover:text-white/70">
                <X className="w-6 h-6" />
              </DialogClose>
              <div className="relative w-full h-[90vh] flex items-center justify-center">
                {lightboxItem.mediaType === "VIDEO" ? (
                  <video
                    src={lightboxItem.image}
                    poster={lightboxItem.poster ?? undefined}
                    className="max-w-full max-h-full"
                    controls
                    autoPlay
                    playsInline
                  />
                ) : (
                  <Image
                    src={lightboxItem.image}
                    alt={lightboxItem.title || "Gallery image"}
                    fill
                    className="object-contain"
                    sizes="90vw"
                    priority
                    unoptimized={lightboxItem.image.startsWith("data:")}
                  />
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}
