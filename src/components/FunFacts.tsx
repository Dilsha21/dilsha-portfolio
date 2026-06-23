import type { FunFact } from "@/lib/supabase";

export default function FunFacts({ facts }: { facts: FunFact[] }) {
  return (
    <section className="py-16 px-6" style={{ background: "var(--terracotta)" }}>
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {facts.map((f) => (
            <div key={f.id} className="text-center px-4">
              <div className="text-3xl mb-2">{f.emoji}</div>
              <span className="block text-white/60 text-xs uppercase tracking-widest mb-1">
                {f.label}
              </span>
              <p className="text-white font-light text-sm leading-relaxed">{f.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
