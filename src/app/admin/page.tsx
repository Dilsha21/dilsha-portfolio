"use client";
import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

// ── Types ─────────────────────────────────────────────────────
type Project = {
  id: string; title: string; description: string;
  short_description?: string;
  tags: string[]; tech: string[];
  image_url: string | null; github_url: string | null; live_url: string | null;
  featured: boolean; sort_order: number;
};
type GalleryItem = { id: string; title: string; caption: string | null; image_url: string; sort_order: number };
type Skill = { id: string; name: string; category: string; sort_order: number };
type FunFact = { id: string; emoji: string; label: string; text: string };
type ContentRow = { key: string; value: string };
type Message = { id: string; name: string; email: string; message: string; read: boolean; created_at: string };

// ── Auth gate ─────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    setLoading(false);
    if (res.ok) { onLogin(); }
    else { toast.error("Incorrect password"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--cream)" }}>
      <div className="w-full max-w-sm p-10 bg-white rounded-lg shadow-sm border" style={{ borderColor: "var(--sand)" }}>
        <h1 className="font-serif text-3xl mb-1" style={{ color: "var(--warm-dark)" }}>
          Dilsha<span style={{ color: "var(--terracotta)" }}>.</span>
        </h1>
        <p className="text-sm mb-8" style={{ color: "var(--warm-light)" }}>Admin panel</p>
        <form onSubmit={submit} className="space-y-5">
          <div>
            <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--warm-mid)" }}>Password</label>
            <input
              type="password" value={pw} onChange={e => setPw(e.target.value)}
              className="admin-input" placeholder="••••••••" required autoFocus
            />
          </div>
          <button type="submit" disabled={loading} className="btn-pill w-full text-center">
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Main dashboard ────────────────────────────────────────────
const TABS = ["Projects", "Gallery", "Skills", "Fun Facts", "Content", "Messages"] as const;
type Tab = typeof TABS[number];

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>("Projects");

  const logout = async () => {
    await fetch("/api/admin", { method: "DELETE" });
    setAuthed(false);
  };

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="min-h-screen" style={{ background: "#f8f5f8" }}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-warm-dark shadow-sm">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="font-serif text-xl text-white">
              Dilsha<span style={{ color: "var(--gold)" }}>.</span>
              <span className="text-white/40 text-sm font-sans ml-2 font-light">admin</span>
            </span>
            <nav className="flex gap-1">
              {TABS.map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    tab === t
                      ? "bg-white/15 text-white"
                      : "text-white/50 hover:text-white/80"
                  }`}
                >
                  {t}
                </button>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <a href="/" target="_blank" className="text-white/40 hover:text-white/70 text-xs">View site ↗</a>
            <button onClick={logout} className="text-white/40 hover:text-white/70 text-xs">Sign out</button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {tab === "Projects" && <ProjectsTab />}
        {tab === "Gallery" && <GalleryTab />}
        {tab === "Skills" && <SkillsTab />}
        {tab === "Fun Facts" && <FunFactsTab />}
        {tab === "Content" && <ContentTab />}
        {tab === "Messages" && <MessagesTab />}
      </div>
    </div>
  );
}

// ── Projects tab ─────────────────────────────────────────────
function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/projects");
    setProjects(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const method = isNew ? "POST" : "PUT";
    const res = await fetch("/api/admin/projects", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { toast.success(isNew ? "Project added" : "Project updated"); setEditing(null); load(); }
    else toast.error("Save failed");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/admin/projects", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Deleted"); load();
  };

  const blank: Partial<Project> = { title: "", description: "", short_description: "", tags: [], tech: [], github_url: "", live_url: "", image_url: "", featured: false, sort_order: 0 };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl" style={{ color: "var(--warm-dark)" }}>Projects</h2>
        <button onClick={() => setEditing(blank)} className="btn-pill">+ Add Project</button>
      </div>

      {loading ? <p className="text-warm-light">Loading…</p> : (
        <div className="space-y-3">
          {projects.map(p => (
            <div key={p.id} className="bg-white rounded-lg p-5 border flex items-start justify-between gap-4" style={{ borderColor: "var(--sand)" }}>
              <div>
                <h3 className="font-medium text-sm" style={{ color: "var(--warm-dark)" }}>{p.title}</h3>
                <p className="text-xs mt-1" style={{ color: "var(--warm-light)" }}>{p.tech.join(", ")}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {p.tags.map(t => <span key={t} className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--sand)", color: "var(--warm-mid)" }}>{t}</span>)}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => setEditing(p)} className="text-xs btn-pill">Edit</button>
                <button onClick={() => remove(p.id)} className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-400 hover:bg-red-50">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit Project" : "Add Project"} onClose={() => setEditing(null)} onSave={save}>
          <Field label="Title">
            <input className="admin-input" value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Description">
            <textarea className="admin-input" rows={4} value={editing.description ?? ""} onChange={e => setEditing(p => ({ ...p, description: e.target.value }))} />
          </Field>
          <Field label="Short description (one line, shows on card)">
            <input className="admin-input" value={editing.short_description ?? ""} onChange={e => setEditing(p => ({ ...p, short_description: e.target.value }))} />
          </Field>
          <Field label="Tags (comma-separated — dev, uiux, design)">
            <input className="admin-input" value={(editing.tags ?? []).join(", ")} onChange={e => setEditing(p => ({ ...p, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
          </Field>
          <Field label="Tech stack (comma-separated)">
            <input className="admin-input" value={(editing.tech ?? []).join(", ")} onChange={e => setEditing(p => ({ ...p, tech: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))} />
          </Field>
          <Field label="Image URL (from Supabase Storage or external)">
            <input className="admin-input" value={editing.image_url ?? ""} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} />
          </Field>
          <Field label="GitHub URL">
            <input className="admin-input" value={editing.github_url ?? ""} onChange={e => setEditing(p => ({ ...p, github_url: e.target.value }))} />
          </Field>
          <Field label="Live URL">
            <input className="admin-input" value={editing.live_url ?? ""} onChange={e => setEditing(p => ({ ...p, live_url: e.target.value }))} />
          </Field>
          <Field label="Sort order (lower = first)">
            <input type="number" className="admin-input" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))} />
          </Field>
        </Modal>
      )}
    </div>
  );
}

// ── Gallery tab ───────────────────────────────────────────────
function GalleryTab() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [editing, setEditing] = useState<Partial<GalleryItem> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/gallery");
    setItems(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const res = await fetch("/api/admin/gallery", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { toast.success(isNew ? "Photo added" : "Photo updated"); setEditing(null); load(); }
    else toast.error("Save failed");
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this photo?")) return;
    await fetch("/api/admin/gallery", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Removed"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl" style={{ color: "var(--warm-dark)" }}>Gallery</h2>
        <button onClick={() => setEditing({ title: "", caption: "", image_url: "", sort_order: 0 })} className="btn-pill">+ Add Photo</button>
      </div>

      {loading ? <p className="text-warm-light">Loading…</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-lg overflow-hidden border" style={{ borderColor: "var(--sand)" }}>
              <div className="aspect-square bg-sand relative">
                {item.image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate" style={{ color: "var(--warm-dark)" }}>{item.title}</p>
                {item.caption && <p className="text-xs truncate mt-0.5" style={{ color: "var(--warm-light)" }}>{item.caption}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => setEditing(item)} className="text-xs btn-pill flex-1 text-center">Edit</button>
                  <button onClick={() => remove(item.id)} className="text-xs px-2 py-1 rounded border border-red-200 text-red-400 hover:bg-red-50">✕</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit Photo" : "Add Photo"} onClose={() => setEditing(null)} onSave={save}>
          <Field label="Title">
            <input className="admin-input" value={editing.title ?? ""} onChange={e => setEditing(p => ({ ...p, title: e.target.value }))} />
          </Field>
          <Field label="Caption (optional)">
            <input className="admin-input" value={editing.caption ?? ""} onChange={e => setEditing(p => ({ ...p, caption: e.target.value }))} />
          </Field>
          <Field label="Image URL">
            <input className="admin-input" value={editing.image_url ?? ""} onChange={e => setEditing(p => ({ ...p, image_url: e.target.value }))} placeholder="https://..." />
          </Field>
          <Field label="Sort order">
            <input type="number" className="admin-input" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))} />
          </Field>
        </Modal>
      )}
    </div>
  );
}

// ── Skills tab ───────────────────────────────────────────────
function SkillsTab() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [editing, setEditing] = useState<Partial<Skill> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/skills");
    setSkills(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const res = await fetch("/api/admin/skills", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { toast.success(isNew ? "Skill added" : "Skill updated"); setEditing(null); load(); }
    else toast.error("Save failed");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this skill?")) return;
    await fetch("/api/admin/skills", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Deleted"); load();
  };

  const grouped = skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    const category = skill.category || "Uncategorized";
    acc[category] = [...(acc[category] || []), skill];
    return acc;
  }, {});

  const blank: Partial<Skill> = { name: "", category: "", sort_order: 0 };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl" style={{ color: "var(--warm-dark)" }}>Skills</h2>
        <button onClick={() => setEditing(blank)} className="btn-pill">+ Add Skill</button>
      </div>

      {loading ? <p className="text-warm-light">Loading…</p> : (
        <div className="space-y-6">
          {Object.keys(grouped).map(category => (
            <div key={category} className="bg-white rounded-lg border p-5" style={{ borderColor: "var(--sand)" }}>
              <h3 className="font-medium text-sm mb-4" style={{ color: "var(--warm-dark)" }}>{category}</h3>
              <div className="space-y-3">
                {grouped[category].sort((a, b) => a.sort_order - b.sort_order).map(skill => (
                  <div key={skill.id} className="flex items-center justify-between gap-3 bg-sand/50 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-sm" style={{ color: "var(--warm-dark)" }}>{skill.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "var(--sand)", color: "var(--warm-mid)" }}>{skill.category}</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(skill)} className="text-xs btn-pill">Edit</button>
                      <button onClick={() => remove(skill.id)} className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-400 hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing.id ? "Edit Skill" : "Add Skill"} onClose={() => setEditing(null)} onSave={save}>
          <Field label="Name">
            <input className="admin-input" value={editing.name ?? ""} onChange={e => setEditing(p => ({ ...p, name: e.target.value }))} />
          </Field>
          <Field label="Category">
            <input className="admin-input" value={editing.category ?? ""} onChange={e => setEditing(p => ({ ...p, category: e.target.value }))} />
          </Field>
          <Field label="Sort order (lower = first)">
            <input type="number" className="admin-input" value={editing.sort_order ?? 0} onChange={e => setEditing(p => ({ ...p, sort_order: Number(e.target.value) }))} />
          </Field>
        </Modal>
      )}
    </div>
  );
}

// ── Fun Facts tab ───────────────────────────────────────────
function FunFactsTab() {
  const [facts, setFacts] = useState<FunFact[]>([]);
  const [editing, setEditing] = useState<Partial<FunFact> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/fun-facts");
    setFacts(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!editing) return;
    const isNew = !editing.id;
    const res = await fetch("/api/admin/fun-facts", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing),
    });
    if (res.ok) { toast.success(isNew ? "Fact added" : "Fact updated"); setEditing(null); load(); }
    else toast.error("Save failed");
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this fact?")) return;
    await fetch("/api/admin/fun-facts", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    toast.success("Deleted"); load();
  };

  const blank: Partial<FunFact> = { emoji: "", label: "", text: "" };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl" style={{ color: "var(--warm-dark)" }}>Fun Facts</h2>
        <button onClick={() => setEditing(blank)} className="btn-pill">+ Add Fact</button>
      </div>

      {loading ? <p className="text-warm-light">Loading…</p> : (
        <div className="space-y-4">
          {facts.map(fact => (
            <div key={fact.id} className="bg-white rounded-lg border p-5" style={{ borderColor: "var(--sand)" }}>
              {editing?.id === fact.id ? (
                <div className="space-y-4">
                  <Field label="Emoji">
                    <input className="admin-input" value={editing.emoji ?? ""} onChange={e => setEditing(p => ({ ...p, emoji: e.target.value }))} />
                  </Field>
                  <Field label="Label">
                    <input className="admin-input" value={editing.label ?? ""} onChange={e => setEditing(p => ({ ...p, label: e.target.value }))} />
                  </Field>
                  <Field label="Text">
                    <textarea className="admin-input" rows={3} value={editing.text ?? ""} onChange={e => setEditing(p => ({ ...p, text: e.target.value }))} />
                  </Field>
                  <div className="flex gap-3">
                    <button onClick={save} className="btn-pill">Save</button>
                    <button onClick={() => setEditing(null)} className="text-sm px-5 py-2 rounded-full border" style={{ borderColor: "var(--warm-light)", color: "var(--warm-mid)" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-2xl leading-none">{fact.emoji}</p>
                    <p className="font-medium text-sm mt-2" style={{ color: "var(--warm-dark)" }}>{fact.label}</p>
                    <p className="text-sm mt-1" style={{ color: "var(--warm-mid)" }}>{fact.text}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditing(fact)} className="text-xs btn-pill">Edit</button>
                    <button onClick={() => remove(fact.id)} className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-400 hover:bg-red-50">Delete</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {editing && !editing.id && (
        <div className="bg-white rounded-lg border p-5 mt-6" style={{ borderColor: "var(--sand)" }}>
          <div className="space-y-4">
            <Field label="Emoji">
              <input className="admin-input" value={editing.emoji ?? ""} onChange={e => setEditing(p => ({ ...p, emoji: e.target.value }))} />
            </Field>
            <Field label="Label">
              <input className="admin-input" value={editing.label ?? ""} onChange={e => setEditing(p => ({ ...p, label: e.target.value }))} />
            </Field>
            <Field label="Text">
              <textarea className="admin-input" rows={3} value={editing.text ?? ""} onChange={e => setEditing(p => ({ ...p, text: e.target.value }))} />
            </Field>
            <div className="flex gap-3">
              <button onClick={save} className="btn-pill">Save</button>
              <button onClick={() => setEditing(null)} className="text-sm px-5 py-2 rounded-full border" style={{ borderColor: "var(--warm-light)", color: "var(--warm-mid)" }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Content tab ───────────────────────────────────────────────
const CONTENT_LABELS: Record<string, string> = {
  hero_name: "Name (hero)", hero_tagline: "Hero tagline",
  about_lead: "About — lead paragraph", about_body: "About — body paragraph",
  cv_url: "CV file path (e.g. /cv/Dilsha_Atugedara_CV.pdf)",
  github_url: "GitHub URL", linkedin_url: "LinkedIn URL", instagram_url: "Instagram URL",
  contact_email: "Contact email", contact_location: "Location", contact_open_to: "Open to",
};

function ContentTab() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [dirty, setDirty] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/content").then(r => r.json()).then(data => {
      setRows(data);
      setLoading(false);
    });
  }, []);

  const save = async () => {
    const updates = Object.entries(dirty).map(([key, value]) => ({ key, value }));
    if (updates.length === 0) { toast("No changes to save"); return; }
    const res = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    if (res.ok) { toast.success("Content saved"); setDirty({}); }
    else toast.error("Save failed");
  };

  const val = (key: string) => dirty[key] ?? rows.find(r => r.key === key)?.value ?? "";

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-serif text-2xl" style={{ color: "var(--warm-dark)" }}>Site Content</h2>
        <button onClick={save} className="btn-pill" disabled={Object.keys(dirty).length === 0}>
          Save Changes {Object.keys(dirty).length > 0 && `(${Object.keys(dirty).length})`}
        </button>
      </div>

      {loading ? <p className="text-warm-light">Loading…</p> : (
        <div className="bg-white rounded-lg border p-8 space-y-6" style={{ borderColor: "var(--sand)" }}>
          {Object.entries(CONTENT_LABELS).map(([key, label]) => (
            <Field key={key} label={label}>
              {key.includes("body") || key.includes("lead") ? (
                <textarea
                  className="admin-input"
                  rows={4}
                  value={val(key)}
                  onChange={e => setDirty(d => ({ ...d, [key]: e.target.value }))}
                />
              ) : (
                <input
                  className="admin-input"
                  value={val(key)}
                  onChange={e => setDirty(d => ({ ...d, [key]: e.target.value }))}
                />
              )}
            </Field>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Messages tab ──────────────────────────────────────────────
function MessagesTab() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/messages");
    setMessages(await res.json());
    setLoading(false);
  }, []);
  useEffect(() => { load(); }, [load]);

  const markRead = async (id: string) => {
    await fetch("/api/admin/messages", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    load();
  };

  return (
    <div>
      <h2 className="font-serif text-2xl mb-8" style={{ color: "var(--warm-dark)" }}>
        Messages
        {messages.filter(m => !m.read).length > 0 && (
          <span className="ml-3 text-sm font-sans px-2 py-0.5 rounded-full text-white" style={{ background: "var(--terracotta)" }}>
            {messages.filter(m => !m.read).length} new
          </span>
        )}
      </h2>

      {loading ? <p className="text-warm-light">Loading…</p> : messages.length === 0 ? (
        <p className="text-warm-light">No messages yet.</p>
      ) : (
        <div className="space-y-4">
          {messages.map(m => (
            <div
              key={m.id}
              className={`bg-white rounded-lg p-6 border ${!m.read ? "border-l-4" : ""}`}
              style={{ borderColor: m.read ? "var(--sand)" : "var(--terracotta)" }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-medium text-sm" style={{ color: "var(--warm-dark)" }}>{m.name}</span>
                    <a href={`mailto:${m.email}`} className="text-xs" style={{ color: "var(--warm-light)" }}>{m.email}</a>
                    <span className="text-xs" style={{ color: "var(--warm-light)" }}>{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--warm-mid)" }}>{m.message}</p>
                </div>
                {!m.read && (
                  <button onClick={() => markRead(m.id)} className="shrink-0 text-xs btn-pill">
                    Mark read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Shared UI ─────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: "var(--warm-mid)" }}>{label}</label>
      {children}
    </div>
  );
}

function Modal({ title, onClose, onSave, children }: { title: string; onClose: () => void; onSave: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(18,37,45,0.5)" }}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "var(--sand)" }}>
          <h3 className="font-serif text-xl" style={{ color: "var(--warm-dark)" }}>{title}</h3>
          <button onClick={onClose} className="text-warm-light hover:text-warm-dark text-xl leading-none">×</button>
        </div>
        <div className="overflow-y-auto px-6 py-6 space-y-4 flex-1">{children}</div>
        <div className="flex justify-end gap-3 px-6 py-4 border-t" style={{ borderColor: "var(--sand)" }}>
          <button onClick={onClose} className="text-sm px-5 py-2 rounded-full border" style={{ borderColor: "var(--warm-light)", color: "var(--warm-mid)" }}>Cancel</button>
          <button onClick={onSave} className="btn-pill">Save</button>
        </div>
      </div>
    </div>
  );
}
