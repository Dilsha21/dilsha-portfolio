"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Skill } from "@/lib/supabase";
import Reveal from "./Reveal";

export default function Skills({ skills }: { skills: Skill[] }) {
  const grouped = skills.reduce<Record<string, Skill[]>>((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {});

  return (
    <section id="skills" className="py-24 px-6" style={{ background: "var(--warm-dark)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <Reveal>
            <h2 className="section-title" style={{ color: "#fff" }}>My Skills</h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {Object.entries(grouped).map(([category, items], catIndex) => (
            <SkillGroup key={category} category={category} items={items} catIndex={catIndex} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillGroup({ category, items, catIndex }: { category: string; items: Skill[]; catIndex: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay: catIndex * 0.15 }}
    >
      <h3 className="text-xs uppercase tracking-widest mb-5" style={{ color: "var(--gold)" }}>
        {category}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((s, i) => (
          <motion.span
            key={s.id}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: catIndex * 0.15 + i * 0.06 }}
            className="px-3 py-1 rounded-full text-sm border"
            style={{
              border: "1px solid rgba(241,166,197,0.25)",
              color: "rgba(255,255,255,0.75)",
              fontWeight: 300,
            }}
          >
            {s.name}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}
