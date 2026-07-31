"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Play, Film, X } from "lucide-react";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

export type VideoItem = {
  id: string;
  src: string;
  title: string;
  category: string;
  poster: string | null;
};

export function VideosPageClient({ videos }: { videos: VideoItem[] }) {
  const [active, setActive] = useState<VideoItem | null>(null);

  return (
    <div className="min-h-screen pt-20 md:pt-24">
      <section className="py-10 md:py-14 bg-background border-b border-black/[0.04]">
        <div className="container-tight">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="section-label mb-3 inline-flex"
          >
            <Film className="w-3.5 h-3.5" /> Watch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="heading-section text-ink"
          >
            Our Videos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-large mt-3 max-w-xl"
          >
            Real setups in motion — see our balloon décor and celebrations come to life.
          </motion.p>
        </div>
      </section>

      <section className="py-8 md:py-12">
        <div className="container-tight">
          {videos.length === 0 ? (
            <div className="text-center py-20">
              <Film className="w-16 h-16 mx-auto text-border mb-4" />
              <h3 className="text-xl font-semibold text-ink mb-2">No videos yet</h3>
              <p className="text-secondary-text">Check back soon — we&apos;re adding new clips.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
              {videos.map((video, index) => (
                <motion.button
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: index * 0.05, duration: 0.45 }}
                  onClick={() => setActive(video)}
                  className="group relative rounded-2xl overflow-hidden bg-black/5 text-left"
                >
                  <div className="relative aspect-video">
                    <video
                      src={video.src}
                      poster={video.poster ?? undefined}
                      className="absolute inset-0 w-full h-full object-cover"
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
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 flex items-center justify-center">
                      <span className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-6 h-6 text-forest fill-forest ml-0.5" />
                      </span>
                    </div>
                  </div>
                  {(video.title || video.category) && (
                    <div className="p-3">
                      {video.title && (
                        <p className="text-sm font-semibold text-ink truncate">{video.title}</p>
                      )}
                      {video.category && (
                        <p className="text-xs text-secondary-text capitalize">
                          {video.category.replace(/-/g, " ")}
                        </p>
                      )}
                    </div>
                  )}
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </section>

      {active && (
        <Dialog open={!!active} onOpenChange={() => setActive(null)}>
          <DialogContent className="max-w-[92vw] md:max-w-3xl p-0 bg-black border-none">
            <DialogClose className="absolute top-3 right-3 z-10 text-white hover:text-white/70">
              <X className="w-6 h-6" />
            </DialogClose>
            <video
              src={active.src}
              poster={active.poster ?? undefined}
              className="w-full max-h-[85vh] rounded-lg"
              controls
              autoPlay
              playsInline
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
