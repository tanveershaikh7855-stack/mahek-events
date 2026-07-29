"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Truck, Star, Heart, MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { heroCarousel, type HeroSlide } from "@/lib/content";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  truck: Truck,
  star: Star,
  heart: Heart,
  map: MapPin,
};

export function HeroCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 900 }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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

  const slide = heroCarousel[selectedIndex] || heroCarousel[0];
  const IconComp = ICON_MAP[slide.infoCard.icon] || Truck;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Carousel viewport */}
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
              {/* Image with Ken Burns */}
              <div className="absolute inset-0 overflow-hidden">
                <Image
                  src={s.image}
                  alt={s.title}
                  fill
                  className={`object-cover transition-transform duration-[8000ms] ease-linear ${
                    selectedIndex === i ? "scale-105" : "scale-100"
                  }`}
                  priority={i === 0}
                  sizes="100vw"
                  quality={85}
                />
              </div>

              {/* Gradient overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

              {/* Text overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 lg:p-10">
                <AnimatePresence mode="wait">
                  {selectedIndex === i && (
                    <motion.div
                      key={`text-${i}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="max-w-lg"
                    >
                      {s.badge && (
                        <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-[11px] font-semibold text-white tracking-wide uppercase">
                          {s.badge}
                        </span>
                      )}
                      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight mb-2 drop-shadow-lg">
                        {s.title}
                      </h2>
                      <p className="text-sm sm:text-base text-white/80 mb-3 max-w-md drop-shadow">
                        {s.subtitle}
                      </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {s.price && (
                          <span className="text-sm font-semibold text-white/90">
                            {s.price}
                          </span>
                        )}
                        {s.cta && (
                          <Link
                            href={s.cta.href}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-ink text-sm font-semibold hover:bg-white/90 transition-colors shadow-lg"
                          >
                            {s.cta.label}
                          </Link>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Floating info card */}
              <AnimatePresence mode="wait">
                {selectedIndex === i && (
                  <motion.div
                    key={`card-${i}`}
                    initial={{ opacity: 0, x: 20, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10"
                  >
                    <div className="backdrop-blur-xl bg-white/15 border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg">
                      <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                        <IconComp className="w-4.5 h-4.5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-white">
                          {s.infoCard.label}
                        </p>
                        <p className="text-[11px] text-white/70">
                          {s.infoCard.sublabel}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows — desktop only, show on hover */}
      {!isMobile && (
        <>
          <AnimatePresence>
            {isHovered && (
              <>
                <motion.button
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>
                <motion.button
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-colors shadow-lg"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Dots navigation */}
      <div className="flex items-center justify-center gap-2 mt-4">
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
    </div>
  );
}
