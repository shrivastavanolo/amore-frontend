"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

// Matches backend template keys — preview color palettes per template
const TEMPLATE_META: Record<string, { bg: string; accent: string; text: string; label: string; desc: string }> = {
  classic_elegance: { bg: "#FFFFF5", accent: "#B8860B", text: "#2C1810", label: "Classic Elegance", desc: "Timeless & traditional" },
  modern_minimal:   { bg: "#F8F8F6", accent: "#1A1A1A", text: "#1A1A1A", label: "Modern Minimal",   desc: "Clean & contemporary" },
  garden_romance:   { bg: "#F0F4EC", accent: "#6B8F5E", text: "#2D4A1E", label: "Garden Romance",   desc: "Botanical & lush" },
}

function TemplateCard({ template, onClick, creating }: { template: any; onClick: () => void; creating: boolean }) {
  const [hovered, setHovered] = useState(false)
  const meta = TEMPLATE_META[template.key] || { bg: "#FFF0F7", accent: "#E8006A", text: "#1A0A12", label: template.name, desc: "" }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: creating ? "wait" : "pointer",
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        border: `1.5px solid ${hovered ? "var(--amore-pink)" : "var(--border)"}`,
        transition: "all 0.22s ease",
        boxShadow: hovered ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-4px)" : "none",
        background: "var(--surface)",
        position: "relative",
      }}
    >
      {creating && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 10,
          background: "rgba(253,247,242,0.85)",
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: "var(--radius-lg)",
          backdropFilter: "blur(2px)",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>✨</div>
            <p style={{ fontSize: 12, color: "var(--amore-pink)", fontFamily: "var(--font-ui)", fontWeight: 500 }}>Creating…</p>
          </div>
        </div>
      )}

      {/* Preview */}
      <div style={{
        height: 210,
        background: meta.bg,
        display: "flex", alignItems: "center", justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Subtle stripe bg like the logo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 16px, rgba(0,0,0,0.012) 16px, rgba(0,0,0,0.012) 17px)`,
        }} />

        {/* Invitation mockup */}
        <div style={{
          width: 126, height: 170, background: "white",
          borderRadius: 3, boxShadow: "0 6px 24px rgba(26,10,18,0.14)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 7, padding: "14px",
          transform: hovered ? "scale(1.05) rotate(-1.5deg)" : "scale(1) rotate(-1.5deg)",
          transition: "transform 0.22s ease",
          position: "relative",
        }}>
          <div style={{ width: 58, height: 1.5, background: meta.accent, opacity: 0.6 }} />
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 7.5, letterSpacing: "0.14em", color: meta.accent, textTransform: "uppercase" }}>
            Together
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 17, color: meta.text, lineHeight: 1.15, textAlign: "center" }}>
            Emma &<br />James
          </div>
          <div style={{ width: 38, height: 1, background: meta.accent, opacity: 0.35 }} />
          <div style={{ fontSize: 6.5, color: meta.accent, textAlign: "center", letterSpacing: "0.07em" }}>
            October 12 · 2025
          </div>
          <div style={{ width: 58, height: 1.5, background: meta.accent, opacity: 0.6 }} />
        </div>

        {/* Pink heart badge */}
        {template.key !== "blank" && (
          <div style={{
            position: "absolute", top: 12, left: 12,
            background: "white", borderRadius: 20,
            padding: "3px 10px",
            fontSize: 9, fontFamily: "var(--font-ui)", fontWeight: 600,
            color: "var(--amore-pink)", letterSpacing: "0.05em",
            boxShadow: "0 2px 8px rgba(232,0,106,0.15)",
            border: "1px solid var(--border)",
          }}>
            ♥ {meta.desc}
          </div>
        )}
      </div>

      {/* Label row */}
      <div style={{
        padding: "14px 16px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 2, fontFamily: "var(--font-ui)" }}>
            {meta.label}
          </p>
          {meta.desc && (
            <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>
              {meta.desc}
            </p>
          )}
        </div>
        <div style={{
          width: 30, height: 30, borderRadius: "50%",
          background: hovered ? "var(--amore-pink)" : "var(--bg-secondary)",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.2s", flexShrink: 0,
          boxShadow: hovered ? "0 0 0 3px var(--amore-pink-subtle)" : "none",
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6h7M6.5 3l3 3-3 3" stroke={hovered ? "white" : "var(--text-secondary)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function TemplatesPage() {
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates`)
      .then(r => r.json())
      .then(data => setTemplates(Array.isArray(data) ? data : []))
      .catch(() => setTemplates([]))
      .finally(() => setLoading(false))
  }, [])

  const createProject = async (template_id: string, name: string) => {
    if (creating) return
    setCreating(template_id)
    const token = localStorage.getItem("token")
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ template_id, name }),
      })
      const data = await res.json()
      if (data.project_id) router.push(`/editor/${data.project_id}`)
      else setCreating(null)
    } catch {
      setCreating(null)
    }
  }

  // Fallback display list if API not yet connected
  const displayTemplates = templates.length > 0 ? templates : [
    { key: "blank",            name: "Blank Canvas" },
    { key: "classic_elegance", name: "Classic Elegance" },
    { key: "modern_minimal",   name: "Modern Minimal" },
    { key: "garden_romance",   name: "Garden Romance" },
  ]

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <header style={{
        height: 60, borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 28px", background: "var(--surface)",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 1px 0 var(--border), var(--shadow-sm)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              fontSize: 13, color: "var(--text-secondary)",
              background: "none", border: "none", cursor: "pointer",
              padding: "5px 8px", borderRadius: "var(--radius)",
              fontFamily: "var(--font-ui)", transition: "color 0.15s",
            }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--amore-pink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-secondary)")}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Dashboard
          </button>
          <span style={{ color: "var(--border-strong)" }}>·</span>
          <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>Templates</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 16 }}>🕊️</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 400, color: "var(--amore-pink)" }}>Amore</span>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.14em", color: "var(--gold)", textTransform: "uppercase", paddingTop: 2, fontFamily: "var(--font-ui)" }}>Invites</span>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 28px" }}>
        <div className="animate-fade-up" style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--amore-pink)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8, fontFamily: "var(--font-ui)" }}>
            Choose a starting point
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.1, marginBottom: 12 }}>
            Select a template
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-secondary)", maxWidth: 460, fontFamily: "var(--font-ui)", lineHeight: 1.7 }}>
            Every template is fully customizable — change fonts, colors, and every word to make it completely yours.
          </p>
        </div>

        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 290, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : (
          <div className="animate-fade-up delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 20 }}>
            {displayTemplates.map((t, i) => (
              <div key={t.key || i} className={`animate-fade-up delay-${Math.min(i + 1, 5)}`}>
                <TemplateCard
                  template={t}
                  creating={creating === (t.key || t.id)}
                  onClick={() => createProject(t.key || t.id, TEMPLATE_META[t.key]?.label || t.name)}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}