"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

function formatDate(dateStr: string) {
  if (!dateStr) return ""
  const d = new Date(dateStr)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays} days ago`
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

// Template colour map for card thumbnails
const TEMPLATE_COLORS: Record<string, { bg: string; accent: string }> = {
  blank:            { bg: "#FFFDF9", accent: "#D4A017" },
  classic_elegance: { bg: "#FFFFF5", accent: "#B8860B" },
  modern_minimal:   { bg: "#F8F8F6", accent: "#1A1A1A" },
  garden_romance:   { bg: "#F0F4EC", accent: "#6B8F5E" },
}

function ProjectCard({
  project, onClick, onDelete, onDuplicate,
}: {
  project: any
  onClick: () => void
  onDelete: () => void
  onDuplicate: () => void
}) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const colors = TEMPLATE_COLORS[project.template_id] || { bg: "#FFF0F7", accent: "#E8006A" }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMenuOpen(false) }}
      style={{
        background: "var(--surface)",
        border: `1.5px solid ${hovered ? "var(--amore-pink)" : "var(--border)"}`,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.2s ease",
        boxShadow: hovered ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hovered ? "translateY(-3px)" : "none",
        position: "relative",
      }}
    >
      {/* Preview */}
      <div
        onClick={onClick}
        style={{
          height: 160,
          background: colors.bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          transition: "background 0.2s",
        }}
      >
        {/* Mini invitation mockup */}
        <div style={{
          width: 96, height: 128,
          background: "white",
          borderRadius: 3,
          boxShadow: "0 4px 16px rgba(26,10,18,0.14)",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 6, padding: "12px",
          transform: hovered ? "scale(1.04) rotate(-1deg)" : "scale(1) rotate(-1deg)",
          transition: "transform 0.2s",
        }}>
          <div style={{ width: 52, height: 1, background: colors.accent, opacity: 0.5 }} />
          <div style={{ fontFamily: "var(--font-display)", fontSize: 7, letterSpacing: "0.15em", color: colors.accent, textTransform: "uppercase" }}>Together</div>
          <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 13, color: "#1A0A12", textAlign: "center", lineHeight: 1.2 }}>
            {project.name || "Invitation"}
          </div>
          <div style={{ width: 36, height: 1, background: colors.accent, opacity: 0.35 }} />
          <div style={{ fontSize: 6.5, color: colors.accent, letterSpacing: "0.06em" }}>Date · Venue</div>
          <div style={{ width: 52, height: 1, background: colors.accent, opacity: 0.5 }} />
        </div>

        {project.is_active && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            background: "var(--success)", color: "white",
            fontSize: 9, fontWeight: 600, fontFamily: "var(--font-ui)",
            padding: "2px 8px", borderRadius: 20, letterSpacing: "0.05em",
          }}>
            Active
          </div>
        )}
      </div>

      {/* Info row */}
      <div style={{ padding: "12px 14px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div onClick={onClick} style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-primary)", marginBottom: 2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: "var(--font-ui)" }}>
            {project.name || "Untitled"}
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>
            {project.updated_at ? formatDate(project.updated_at) : "Just created"}
          </p>
        </div>

        {/* Context menu */}
        <div style={{ position: "relative" }}>
          <button
            onClick={e => { e.stopPropagation(); setMenuOpen(v => !v) }}
            style={{
              width: 28, height: 28, borderRadius: "50%",
              border: "none", background: menuOpen ? "var(--accent-light)" : "transparent",
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              color: "var(--text-muted)", transition: "all 0.15s", flexShrink: 0,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = "var(--accent-light)")}
            onMouseLeave={e => { if (!menuOpen) e.currentTarget.style.background = "transparent" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor">
              <circle cx="7" cy="3" r="1.2"/><circle cx="7" cy="7" r="1.2"/><circle cx="7" cy="11" r="1.2"/>
            </svg>
          </button>

          {menuOpen && (
            <div style={{
              position: "absolute", right: 0, top: 32, zIndex: 200,
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", boxShadow: "var(--shadow-md)",
              minWidth: 140, overflow: "hidden",
            }}>
              {[
                { label: "Open", action: onClick, icon: "→" },
                { label: "Duplicate", action: onDuplicate, icon: "⎘" },
                { label: "Delete", action: onDelete, icon: "✕", danger: true },
              ].map(item => (
                <button
                  key={item.label}
                  onClick={e => { e.stopPropagation(); setMenuOpen(false); item.action() }}
                  style={{
                    width: "100%", padding: "9px 14px",
                    background: "none", border: "none",
                    display: "flex", alignItems: "center", gap: 10,
                    fontSize: 13, fontFamily: "var(--font-ui)",
                    color: item.danger ? "#C8004F" : "var(--text-secondary)",
                    cursor: "pointer", textAlign: "left",
                    transition: "background 0.1s",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = item.danger ? "#FFF0F5" : "var(--bg)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "none")}
                >
                  <span style={{ fontSize: 12, opacity: 0.7 }}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewCard({ onClick }: { onClick: () => void }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--amore-pink-pale)" : "var(--surface)",
        border: `1.5px dashed ${hovered ? "var(--amore-pink)" : "var(--border-strong)"}`,
        borderRadius: "var(--radius-lg)",
        minHeight: 220, cursor: "pointer",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 12,
        transition: "all 0.2s ease",
        transform: hovered ? "translateY(-3px)" : "none",
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: "50%",
        border: `1.5px solid ${hovered ? "var(--amore-pink)" : "var(--border-strong)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.2s",
        background: hovered ? "white" : "transparent",
        boxShadow: hovered ? "var(--shadow-pink)" : "none",
        color: hovered ? "var(--amore-pink)" : "var(--text-muted)",
      }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: hovered ? "var(--amore-pink)" : "var(--text-secondary)", fontFamily: "var(--font-ui)", marginBottom: 3, transition: "color 0.2s" }}>
          New Invitation
        </p>
        <p style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>
          Start from a template
        </p>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null

  useEffect(() => {
    if (!token) { router.push("/login"); return }

    const load = async () => {
      try {
        const [projRes, userRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/me`,  { headers: { Authorization: `Bearer ${token}` } }).catch(() => null),
        ])
        if (!projRes.ok) { router.push("/login"); return }
        const data = await projRes.json()
        setProjects(Array.isArray(data) ? data : [])
        if (userRes?.ok) {
          const u = await userRes.json()
          setUserName(u.name || u.email || "")
        }
      } catch {
        setProjects([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router, token])

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this invitation?")) return
    setDeletingId(id)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}`, {
        method: "DELETE", headers: { Authorization: `Bearer ${token}` },
      })
      setProjects(ps => ps.filter(p => p.id !== id))
    } finally {
      setDeletingId(null)
    }
  }

  const handleDuplicate = async (id: string) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${id}/duplicate`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        const data = await res.json()
        // Re-fetch projects
        const projRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`, { headers: { Authorization: `Bearer ${token}` } })
        if (projRes.ok) setProjects(await projRes.json())
      }
    } catch {}
  }

  const firstName = userName.split(" ")[0] || "there"

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
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>🕊️</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 21, fontWeight: 400, color: "var(--amore-pink)" }}>Amore</span>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.14em", color: "var(--gold)", textTransform: "uppercase", paddingTop: 2, fontFamily: "var(--font-ui)" }}>Invites</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          {userName && <span style={{ fontSize: 13, color: "var(--text-secondary)", fontFamily: "var(--font-ui)" }}>{userName}</span>}
          <button
            onClick={() => { localStorage.removeItem("token"); router.push("/login") }}
            style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-ui)", padding: "4px 8px", borderRadius: "var(--radius)", transition: "color 0.15s" }}
            onMouseEnter={e => (e.currentTarget.style.color = "var(--amore-pink)")}
            onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
          >
            Sign out
          </button>
        </div>
      </header>

      <main style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 28px" }}>
        {/* Page heading */}
        <div className="animate-fade-up" style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 11, letterSpacing: "0.14em", color: "var(--amore-pink)", textTransform: "uppercase", fontWeight: 600, marginBottom: 8, fontFamily: "var(--font-ui)" }}>
            My Workspace
          </p>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--text-primary)", lineHeight: 1.1 }}>
            {loading ? "Loading…" : `Hello, ${firstName}`}
          </h1>
        </div>

        {/* Toolbar */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
          <h2 style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>
            {loading ? "" : `${projects.length} Invitation${projects.length !== 1 ? "s" : ""}`}
          </h2>
          <button
            onClick={() => router.push("/templates")}
            className="btn-primary"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M6 1v10M1 6h10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            New Invitation
          </button>
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 224, borderRadius: "var(--radius-lg)" }} />
            ))}
          </div>
        ) : (
          <div className="animate-fade-up delay-1" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            <NewCard onClick={() => router.push("/templates")} />
            {projects.map((project, i) => (
              <div key={project.id || i} style={{ opacity: deletingId === project.id ? 0.4 : 1, transition: "opacity 0.2s" }}>
                <ProjectCard
                  project={project}
                  onClick={() => router.push(`/editor/${project.id}`)}
                  onDelete={() => handleDelete(project.id)}
                  onDuplicate={() => handleDuplicate(project.id)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && projects.length === 0 && (
          <div className="animate-fade-up delay-2" style={{ textAlign: "center", padding: "72px 0" }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>💌</div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, color: "var(--text-secondary)", marginBottom: 10 }}>
              No invitations yet
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 28, fontFamily: "var(--font-ui)" }}>
              Start with a beautiful template and make it uniquely yours
            </p>
            <button onClick={() => router.push("/templates")} className="btn-primary" style={{ padding: "12px 28px" }}>
              Browse Templates
            </button>
          </div>
        )}
      </main>
    </div>
  )
}