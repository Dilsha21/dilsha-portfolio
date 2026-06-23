"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { Project } from "@/lib/supabase";
import Reveal from "./Reveal";

const TAG_LABELS: Record<string, string> = {
  "*": "All",
  dev: "Development",
  uiux: "UI/UX",
  design: "Design",
};

export default function Projects({ projects }: { projects: Project[] }) {
  const [activeTag, setActiveTag] = useState("*");

  const tags = ["*", ...Array.from(new Set(projects.flatMap((p) => p.tags)))];
  const filtered =
    activeTag === "*" ? projects : projects.filter((p) => p.tags.includes(activeTag));

  return (
    <section id="projects" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <Reveal>
            <h2 className="section-title">Projects</h2>
          </Reveal>
          <Reveal delay={0.1} direction="left">
            <div className="flex flex-wrap gap-3">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className={`text-xs uppercase tracking-widest px-4 py-1.5 rounded-full border transition-all ${
                    activeTag === tag
                      ? "border-terracotta bg-terracotta text-white"
                      : "border-warm-light/40 text-warm-mid hover:border-terracotta hover:text-terracotta"
                  }`}
                >
                  {TAG_LABELS[tag] ?? tag}
                </button>
              ))}
            </div>
          </Reveal>
        </div>

        {filtered.length === 0 ? (
          <p className="text-warm-light text-center py-20">No projects yet.</p>
        ) : (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            <AnimatePresence mode="popLayout">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1], delay: i * 0.07 }}
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const [open, setOpen] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const prevFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;
    prevFocusRef.current = document.activeElement as HTMLElement | null;
    const el = modalRef.current;
    const focusable = el?.querySelector<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const container = modalRef.current;
        if (!container) return;
        const nodes = Array.from(
          container.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
          )
        ).filter(Boolean);
        if (nodes.length === 0) { e.preventDefault(); return; }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocusRef.current?.focus();
    };
  }, [open]);

  const short = (project as any).short_description ?? project.description ?? "";

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen(true)}
        onKeyDown={(e) => { if (e.key === "Enter") setOpen(true); }}
        className="portfolio-card relative overflow-hidden rounded-sm cursor-pointer bg-sand aspect-[4/3] transform transition duration-200 hover:scale-105 hover:shadow-lg"
      >
        {project.image_url ? (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "var(--sand)" }}>
            <span className="font-serif text-warm-mid/30 text-5xl">{project.title.charAt(0)}</span>
          </div>
        )}

        <div className="absolute left-0 right-0 bottom-0 p-4 bg-gradient-to-t from-white/90 to-white/30">
          <h3 className="font-serif text-sm text-warm-dark truncate">{project.title}</h3>
          <p className="text-xs text-warm-mid mt-1 line-clamp-1">{short}</p>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <div className="absolute inset-0 bg-black/60" />
            <motion.div
              ref={modalRef}
              role="dialog"
              aria-modal="true"
              aria-label={project.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="relative bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-serif text-2xl mb-2" style={{ color: "var(--warm-dark)" }}>{project.title}</h3>
                  <div className="flex gap-2 flex-wrap mb-4">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-full" style={{ background: "var(--sand)", color: "var(--warm-mid)" }}>{t}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => setOpen(false)} className="text-warm-light hover:text-warm-dark text-xl leading-none">×</button>
              </div>

              <div className="text-sm text-warm-mid leading-relaxed mb-6">{project.description}</div>

              <div className="flex gap-3">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="btn-pill">GitHub</a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noopener noreferrer" className="btn-pill">Live</a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
