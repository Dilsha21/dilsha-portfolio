export default function Footer({ content }: { content: Record<string, string> }) {
  const socials = [
    { label: "GitHub", url: content.github_url },
    { label: "LinkedIn", url: content.linkedin_url },
    { label: "Instagram", url: content.instagram_url },
  ].filter((s) => s.url && s.url !== "#");

  return (
    <footer className="py-12 px-6 text-center" style={{ background: "var(--warm-dark)" }}>
      <div className="max-w-4xl mx-auto">
        <div className="font-serif text-2xl text-white mb-6">
          Dilsha<span style={{ color: "var(--gold)" }}>.</span>
        </div>
        {socials.length > 0 && (
          <ul className="flex justify-center gap-8 mb-8">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors hover:text-[var(--gold)]"
                  style={{ color: "rgba(255,255,255,0.45)" }}
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.78rem" }}>
          &copy; {new Date().getFullYear()} Dilsha Atugedara.
        </p>
      </div>
    </footer>
  );
}
