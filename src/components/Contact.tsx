"use client";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Contact({ content }: { content: Record<string, string> }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success("Message sent — thank you!");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-6" style={{ background: "var(--cream)" }}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="section-title">Get In Touch</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--warm-mid)" }}>
                  Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b pb-2 outline-none text-sm"
                  style={{ borderColor: "var(--warm-light)", color: "var(--warm-dark)" }}
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--warm-mid)" }}>
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full bg-transparent border-0 border-b pb-2 outline-none text-sm"
                  style={{ borderColor: "var(--warm-light)", color: "var(--warm-dark)" }}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--warm-mid)" }}>
                Message
              </label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={6}
                className="w-full bg-transparent border-0 border-b pb-2 outline-none text-sm resize-none"
                style={{ borderColor: "var(--warm-light)", color: "var(--warm-dark)" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-pill disabled:opacity-50"
            >
              {loading ? "Sending…" : "Send Message"}
            </button>
          </form>

          {/* Info */}
          <div className="space-y-8 pt-2">
            <ContactItem label="Email" value={content.contact_email ?? "dilshaa.23@cse.mrt.ac.lk"} href={`mailto:${content.contact_email}`} />
            <ContactItem label="Based in" value={content.contact_location ?? "Sri Lanka"} />
            <ContactItem label="Open to" value={content.contact_open_to ?? "Internships & Collaborations"} />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactItem({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  return (
    <div>
      <span className="block text-xs uppercase tracking-widest mb-1" style={{ color: "var(--warm-light)" }}>
        {label}
      </span>
      {href ? (
        <a href={href} className="text-sm hover:text-terracotta transition-colors" style={{ color: "var(--warm-dark)" }}>
          {value}
        </a>
      ) : (
        <span className="text-sm" style={{ color: "var(--warm-dark)" }}>{value}</span>
      )}
    </div>
  );
}
