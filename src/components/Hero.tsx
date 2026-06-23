"use client";
import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Hero({ content }: { content: Record<string, string> }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Parallax: background drifts up slower than scroll
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  // Text fades and floats up as you scroll away
  const textY = useTransform(scrollYProgress, [0, 0.6], ["0%", "-20%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      ref={ref}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "var(--warm-dark)" }}
    >
      {/* Parallax background */}
      <motion.div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat will-change-transform"
        style={{
          backgroundImage: "url('/images/dilsha.jpeg')",
          y: bgY,
          scale: 1.1, // slight overscale so parallax doesn't show edges
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(18,37,45,0.82) 0%, rgba(88,43,89,0.60) 100%)",
        }}
      />

      {/* Content with scroll fade */}
      <motion.div
        className="relative z-10 text-center px-6 max-w-3xl mx-auto"
        style={{ y: textY, opacity: textOpacity }}
      >
        {/* Staggered entrance */}
        <motion.h1
          className="heading-serif text-white mb-6"
          style={{
            fontSize: "clamp(3.5rem, 10vw, 7rem)",
            lineHeight: 1.05,
            fontStyle: "italic",
            letterSpacing: "-0.01em",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        >
          {content.hero_name ?? "Dilsha"}
        </motion.h1>

        <motion.p
          className="text-white/85 tracking-widest uppercase mb-10"
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", fontWeight: 300 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.5 }}
        >
          {content.hero_tagline ?? "Software Engineering Student Exploring the Intersection of Development and Design"}
        </motion.p>

        <motion.div
          className="flex flex-wrap gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.75 }}
        >
          <a href="#projects" className="btn-pill btn-pill-white">View Projects</a>
          <a href="#contact" className="btn-pill btn-pill-white">Get In Touch</a>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="#projects"
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <span className="text-xs tracking-widest uppercase">Scroll</span>
        <motion.span
          className="w-px h-10 bg-white/30 block origin-top"
          animate={{ scaleY: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.a>
    </section>
  );
}
