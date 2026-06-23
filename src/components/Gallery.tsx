"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import type { GalleryItem } from "@/lib/supabase";
import Reveal from "./Reveal";

export default function Gallery({ items }: { items: GalleryItem[] }) {
  if (items.length === 0) return null;

  return (
    <section id="gallery" className="py-24 px-6" style={{ background: "var(--sand)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Reveal>
            <h2 className="section-title">Gallery</h2>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => (
            <GalleryCard key={item.id} item={item} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: (index % 3) * 0.1 }}
      className="portfolio-card relative overflow-hidden rounded-sm aspect-[4/3] group"
    >
      <Image
        src={item.image_url}
        alt={item.title}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-105"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      <div className="overlay rounded-sm">
        <div className="w-full">
          <h3 className="font-serif text-white text-lg">{item.title}</h3>
          {item.caption && (
            <p className="text-white/65 text-xs uppercase tracking-widest mt-1">
              {item.caption}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
