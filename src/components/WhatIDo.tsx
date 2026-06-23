"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Reveal from "./Reveal";

const services = [
  {
    icon: "✦",
    title: "UI / UX Design",
    body: "I design user-friendly interfaces that feel intuitive and look beautiful — building in Figma with accessible design systems and real user needs in mind.",
  },
  {
    icon: "◈",
    title: "Full-Stack Development",
    body: "I build clean, responsive web apps from database to UI — comfortable across the stack with React, Next.js, Node, PostgreSQL, and Firebase.",
  },
  {
    icon: "◇",
    title: "Visual Design",
    body: "I craft thoughtful visual identities, pitch decks, and design systems that communicate clearly and leave a lasting impression.",
  },
];

export default function WhatIDo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-24 px-6" style={{ background: "var(--sand)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="section-title">What I Do</h2>
          </Reveal>
        </div>

        <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.15 }}
              className="text-center md:text-left"
            >
              <div className="text-3xl mb-4" style={{ color: "var(--terracotta)", opacity: 0.7 }}>
                {s.icon}
              </div>
              <h3 className="heading-serif text-xl mb-3" style={{ color: "var(--warm-dark)" }}>
                {s.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--warm-mid)", fontWeight: 300 }}>
                {s.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
