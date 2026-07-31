"use client";

import { useState, useCallback, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { heroCarousel } from "@/lib/content";

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

export function HeroCarousel() {
  const isMobile = useMobile();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 200, watchDrag: true },
    isMobile
      ? [Autoplay({ delay: 5000, stopOnInteraction: true, stopOnMouseEnter: true })]
      : []
  );

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

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="relative w-full">
      <div
        ref={emblaRef}
        className="overflow-hidden rounded-[28px] lg:rounded-[32px] shadow-[0_16px_64px_-16px_rgba(0,0,0,0.15)]"
      >
        <div className="flex">
          {heroCarousel.map((s, i) => (
            <div
              key={i}
              className="flex-[0_0_100%] min-w-0 relative aspect-[4/3] sm:aspect-[16/10] lg:aspect-[16/9]"
            >
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className={`object-cover transition-transform duration-[1200ms] ease-out ${
                    selectedIndex === i ? "scale-105" : "scale-100"
                  }`}
                  priority={i === 0}
                  sizes="100vw"
                  quality={85}
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {selectedIndex === i && (
                    <motion.div
                      key={`text-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-lg"
                    >
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
                        {s.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/80 mb-3 max-w-md drop-shadow">
                        {s.subtitle}
                      </p>
                      {s.cta && (
                        <Link
                          href={s.cta.href}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-ink text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
                        >
                          {s.cta.label}
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center gap-3 mt-4">
        <button
          onClick={scrollPrev}
          className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-ink hover:bg-forest hover:text-white hover:border-forest transition-all duration-200 shadow-sm"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1.5">
          {heroCarousel.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                selectedIndex === i
                  ? "w-6 h-2 bg-forest"
                  : "w-2 h-2 bg-ink/20 hover:bg-ink/40"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={scrollNext}
          className="w-9 h-9 rounded-full border border-black/10 bg-white flex items-center justify-center text-ink hover:bg-forest hover:text-white hover:border-forest transition-all duration-200 shadow-sm"
          aria-label="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
