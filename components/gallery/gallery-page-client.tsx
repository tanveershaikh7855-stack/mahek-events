"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search, Filter, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { FALLBACK_GALLERY } from "@/lib/seed";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "all", label: "All Work" },
  { value: "birthday", label: "Birthday" },
  { value: "wedding", label: "Wedding" },
  { value: "baby-shower", label: "Baby Shower" },
  { value: "corporate", label: "Corporate" },
  { value: "proposal", label: "Proposal" },
  { value: "room-decoration", label: "Room Decor" },
];

export function GalleryPageClient() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const filtered = useMemo(() => {
    if (selectedCategory === "all") return FALLBACK_GALLERY;
    return FALLBACK_GALLERY.filter((item) => item.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-8 md:py-12 bg-background border-b border-border">
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
                  "px-4 py-2 rounded-xl text-sm font-medium transition-colors",
                  selectedCategory === cat.value
                    ? "bg-forest text-white"
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
                transition={{ delay: index * 0.05, duration: 0.5 }}
                className="break-inside-avoid group relative rounded-xl overflow-hidden cursor-pointer"
                onClick={() => setLightboxImage(item.image)}
              >
                <div className="relative w-full" style={{ aspectRatio: index % 3 === 0 ? "3/4" : "4/5" }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover image-zoom"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Search className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-white font-semibold">{item.title}</span>
                    <p className="text-white/70 text-sm capitalize">{item.category}</p>
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
              <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                View All
              </Button>
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {lightboxImage && (
          <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
            <DialogContent className="max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
              <DialogClose className="absolute top-4 right-4 z-10 text-white hover:text-white/70">
                <X className="w-6 h-6" />
              </DialogClose>
              <div className="relative w-full h-[90vh] flex items-center justify-center">
                <Image
                  src={lightboxImage}
                  alt="Gallery image"
                  fill
                  className="object-contain"
                  sizes="90vw"
                  priority
                />
              </div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  );
}