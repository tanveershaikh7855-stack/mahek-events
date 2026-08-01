"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquareQuote,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type PublicReviewVideo = {
  id: string;
  customerName: string;
  eventType: string;
  rating: number;
  reviewText: string | null;
  videoUrl: string;
  poster: string | null;
};

function toYouTubeEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.endsWith("youtu.be")) {
      const id = u.pathname.slice(1);
      return id ? `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0` : null;
    }
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&modestbranding=1&rel=0`;
      if (u.pathname.startsWith("/embed/")) return url;
    }
  } catch {
    /* not a URL */
  }
  return null;
}

/** True when the URL renders as a native <video>. */
function isNativeVideo(url: string): boolean {
  return url.startsWith("/api/media/") || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(url);
}

function VideoCard({
  video,
  active,
  muted,
  onTogglePlay,
  onToggleMute,
}: {
  video: PublicReviewVideo;
  active: boolean;
  muted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const youtube = toYouTubeEmbed(video.videoUrl);
  const native = !youtube && isNativeVideo(video.videoUrl);

  // Only the active slide auto-plays; pause others so multiple videos never
  // play simultaneously (huge bandwidth + audio chaos on mobile).
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (active) {
      el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    } else {
      el.pause();
      el.currentTime = 0;
      setPlaying(false);
    }
  }, [active]);

  useEffect(() => {
    const el = videoRef.current;
    if (el) el.muted = muted;
  }, [muted]);

  const handlePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setPlaying(false);
    }
    onTogglePlay();
  };

  return (
    <div className="relative aspect-[9/16] sm:aspect-[3/4] rounded-3xl overflow-hidden bg-black shadow-[0_16px_60px_-16px_rgba(0,0,0,0.35)]">
      {youtube ? (
        active ? (
          <iframe
            src={youtube}
            className="absolute inset-0 w-full h-full"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={`${video.customerName} review`}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.poster ?? `https://img.youtube.com/vi/${new URL(video.videoUrl.replace("youtu.be/", "www.youtube.com/watch?v=")).searchParams.get("v") ?? ""}/hqdefault.jpg`}
            alt={video.customerName}
            className="w-full h-full object-cover"
          />
        )
      ) : native ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.poster ?? undefined}
          className="absolute inset-0 w-full h-full object-cover"
          muted={muted}
          loop
          playsInline
          preload={active ? "auto" : "none"}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={video.poster ?? "/images/IMG-20260728-WA0032.webp"}
          alt={video.customerName}
          className="w-full h-full object-cover"
        />
      )}

      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

      {/* Controls (native video only) */}
      {native && (
        <div className="absolute top-3 right-3 flex items-center gap-2">
          <button
            type="button"
            onClick={handlePlayPause}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={onToggleMute}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/70 transition-colors"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>
      )}

      {/* Info overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
        <div className="flex items-center gap-2 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "w-3.5 h-3.5",
                i < video.rating ? "text-gold fill-gold" : "text-white/25",
              )}
            />
          ))}
          <span className="ml-1 text-[11px] uppercase tracking-widest text-white/75">
            {video.eventType.replace(/-/g, " ")}
          </span>
        </div>
        <p className="font-heading text-lg font-bold">{video.customerName}</p>
        {video.reviewText && (
          <p className="mt-1 text-sm text-white/85 line-clamp-3">
            <MessageSquareQuote className="inline w-3.5 h-3.5 mr-1 opacity-70" />
            {video.reviewText}
          </p>
        )}
      </div>
    </div>
  );
}

export function ReviewVideosCarousel({
  videos,
}: {
  videos: PublicReviewVideo[];
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: videos.length > 2,
    align: "center",
    dragFree: false,
    containScroll: "trimSnaps",
  });
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [muted, setMuted] = useState(true);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!videos || videos.length === 0) return null;

  return (
    <section className="section-spacing bg-warm-white">
      <div className="container-tight">
        <div className="text-center mb-8 md:mb-10">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            className="section-label mb-3 inline-flex"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" /> In their words
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.05 }}
            className="heading-section text-ink"
          >
            What our customers say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.1 }}
            className="body-large mt-2 max-w-lg mx-auto"
          >
            Real celebrations, real reactions — swipe to hear straight from our
            customers.
          </motion.p>
        </div>

        <div className="relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -ml-4 md:-ml-6 touch-pan-y">
              {videos.map((video, index) => (
                <div
                  key={video.id}
                  className="flex-[0_0_88%] sm:flex-[0_0_50%] md:flex-[0_0_38%] lg:flex-[0_0_30%] min-w-0 pl-4 md:pl-6"
                >
                  <VideoCard
                    video={video}
                    active={index === selectedIndex}
                    muted={muted}
                    onTogglePlay={() => {}}
                    onToggleMute={() => setMuted((m) => !m)}
                  />
                </div>
              ))}
            </div>
          </div>

          {videos.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-11 h-11 rounded-full bg-white border border-black/10 text-ink items-center justify-center shadow-md hover:bg-forest hover:text-white hover:border-forest transition-colors"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-11 h-11 rounded-full bg-white border border-black/10 text-ink items-center justify-center shadow-md hover:bg-forest hover:text-white hover:border-forest transition-colors"
                aria-label="Next review"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {videos.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-6">
            {videos.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => emblaApi?.scrollTo(i)}
                className={cn(
                  "h-2 rounded-full transition-all",
                  selectedIndex === i ? "w-6 bg-forest" : "w-2 bg-ink/20 hover:bg-ink/40",
                )}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
