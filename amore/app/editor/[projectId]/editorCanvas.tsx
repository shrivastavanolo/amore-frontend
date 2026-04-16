"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

/* ─────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────── */
interface CanvasData {
  canvas: { width: number; height: number; background: string }
  elements: Element[]
}

interface Element {
  id: string
  type: "text" | "shape"
  text?: string
  x: number
  y: number
  fontSize?: number
  fontFamily?: string
  color?: string
  fontStyle?: string
  fontWeight?: string | number
  align?: string
  letterSpacing?: number
  shape?: string
  width?: number
  height?: number
  fill?: string
}

/* ─────────────────────────────────────────────────────────
   Canvas — renders the invitation with drag support
───────────────────────────────────────────────────────── */
function InvitationCanvas({
  data, selectedId, onSelect, onUpdateElement, scale,
}: {
  data: CanvasData
  selectedId: string | null
  onSelect: (id: string | null) => void
  onUpdateElement: (id: string, patch: Partial<Element>) => void
  scale: number
}) {
  const dragState = useRef<{ startX: number; startY: number; elX: number; elY: number } | null>(null)

  const handleMouseDown = (e: React.MouseEvent, el: Element) => {
    e.stopPropagation()
    onSelect(el.id)
    dragState.current = {
      startX: e.clientX,
      startY: e.clientY,
      elX: el.x,
      elY: el.y,
    }

    const onMouseMove = (me: MouseEvent) => {
      if (!dragState.current) return
      const dx = (me.clientX - dragState.current.startX) / scale
      const dy = (me.clientY - dragState.current.startY) / scale
      onUpdateElement(el.id, {
        x: Math.round(dragState.current.elX + dx),
        y: Math.round(dragState.current.elY + dy),
      })
    }
    const onMouseUp = () => {
      dragState.current = null
      window.removeEventListener("mousemove", onMouseMove)
      window.removeEventListener("mouseup", onMouseUp)
    }
    window.addEventListener("mousemove", onMouseMove)
    window.addEventListener("mouseup", onMouseUp)
  }

  return (
    <div
      id="invitation-canvas"
      onClick={e => { if (e.target === e.currentTarget) onSelect(null) }}
      style={{
        width: data?.canvas?.width || 1080,
        height: data?.canvas?.height || 1350,
        background: data?.canvas?.background || "white",
        position: "relative",
        boxShadow: "0 8px 60px rgba(26,10,18,0.20), 0 2px 12px rgba(232,0,106,0.10)",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      {(data?.elements || []).map((el: Element) => {
        if (el.type === "shape") {
          return (
            <div
              key={el.id}
              onMouseDown={e => handleMouseDown(e, el)}
              style={{
                position: "absolute",
                left: el.x, top: el.y,
                width: el.width, height: el.height,
                background: el.fill || "#000",
                outline: el.id === selectedId ? "2px solid var(--amore-pink)" : "2px solid transparent",
                outlineOffset: 3,
                cursor: "grab",
                borderRadius: 2,
              }}
            />
          )
        }
        return (
          <div
            key={el.id}
            onMouseDown={e => handleMouseDown(e, el)}
            style={{
              position: "absolute",
              left: el.x, top: el.y,
              cursor: "grab",
              outline: el.id === selectedId ? "2px solid var(--amore-pink)" : "2px solid transparent",
              outlineOffset: 4,
              borderRadius: 3,
              padding: "2px 4px",
              fontFamily: el.fontFamily || "Georgia, serif",
              fontSize: el.fontSize || 16,
              fontWeight: el.fontWeight || 400,
              fontStyle: el.fontStyle || "normal",
              color: el.color || "#1A0A12",
              letterSpacing: el.letterSpacing ? `${el.letterSpacing}px` : "normal",
              whiteSpace: "pre-wrap",
              minWidth: 20,
              minHeight: 20,
              transition: "outline-color 0.12s",
              transform: el.align === "center" ? "translateX(-50%)" : "none",
            }}
          >
            {el.text}
          </div>
        )
      })}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Zoom controls
───────────────────────────────────────────────────────── */
function ZoomBar({ scale, setScale }: { scale: number; setScale: (s: number) => void }) {
  const steps = [0.15, 0.25, 0.35, 0.5, 0.65, 0.8, 1]
  return (
    <div style={{
      position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)",
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 30, padding: "5px 8px",
      display: "flex", alignItems: "center", gap: 4,
      boxShadow: "var(--shadow-md)", zIndex: 20,
    }}>
      <button
        onClick={() => { const i = steps.indexOf(scale); if (i > 0) setScale(steps[i - 1]) }}
        style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
        disabled={scale <= steps[0]}
      >−</button>
      <span style={{ fontSize: 11, fontFamily: "var(--font-ui)", color: "var(--text-secondary)", minWidth: 38, textAlign: "center" }}>
        {Math.round(scale * 100)}%
      </span>
      <button
        onClick={() => { const i = steps.indexOf(scale); if (i < steps.length - 1) setScale(steps[i + 1]) }}
        style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}
        disabled={scale >= steps[steps.length - 1]}
      >+</button>
      <div style={{ width: 1, height: 14, background: "var(--border)", margin: "0 2px" }} />
      <button
        onClick={() => setScale(0.35)}
        title="Fit"
        style={{ width: 26, height: 26, borderRadius: "50%", border: "none", background: "none", cursor: "pointer", color: "var(--text-secondary)", fontSize: 10, fontFamily: "var(--font-ui)", display: "flex", alignItems: "center", justifyContent: "center" }}
      >Fit</button>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Properties Panel
───────────────────────────────────────────────────────── */
function PropertiesPanel({
  data, selectedId, onUpdate, onDelete, onDeselect,
}: {
  data: CanvasData
  selectedId: string | null
  onUpdate: (id: string, patch: Partial<Element>) => void
  onDelete: (id: string) => void
  onDeselect: () => void
}) {
  const el = data?.elements?.find((e: Element) => e.id === selectedId)

  if (!selectedId || !el) {
    return (
      <div style={{ padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 28, marginBottom: 12 }}>✦</div>
        <p style={{ fontSize: 12, color: "var(--text-muted)", fontFamily: "var(--font-ui)", lineHeight: 1.7 }}>
          Click any element<br />on the canvas to edit it
        </p>
        <p style={{ fontSize: 11, color: "var(--border-strong)", fontFamily: "var(--font-ui)", marginTop: 10 }}>
          Drag elements to reposition
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "var(--font-ui)" }}>
          {el.type === "shape" ? "Shape" : "Text"} Properties
        </span>
        <button onClick={onDeselect} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: 18, padding: 2, lineHeight: 1 }}>×</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Text content */}
        {el.type === "text" && (
          <Field label="Content">
            <textarea
              value={el.text ?? ""}
              onChange={e => onUpdate(el.id, { text: e.target.value })}
              rows={3}
              style={inputStyle}
            />
          </Field>
        )}

        {/* Font size */}
        {el.type === "text" && (
          <Field label={`Font Size — ${el.fontSize || 16}px`}>
            <input
              type="range" min={8} max={120}
              value={el.fontSize || 16}
              onChange={e => onUpdate(el.id, { fontSize: Number(e.target.value) })}
              style={{ width: "100%", accentColor: "var(--amore-pink)", cursor: "pointer" }}
            />
          </Field>
        )}

        {/* Color */}
        <Field label={el.type === "shape" ? "Fill Color" : "Text Color"}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="color"
              value={el.type === "shape" ? (el.fill || "#000000") : (el.color || "#1A0A12")}
              onChange={e => onUpdate(el.id, el.type === "shape" ? { fill: e.target.value } : { color: e.target.value })}
              style={{ width: 32, height: 32, border: "1px solid var(--border)", borderRadius: "var(--radius)", cursor: "pointer", padding: 2, background: "none" }}
            />
            <input
              value={el.type === "shape" ? (el.fill || "#000000") : (el.color || "#1A0A12")}
              onChange={e => onUpdate(el.id, el.type === "shape" ? { fill: e.target.value } : { color: e.target.value })}
              style={{ ...inputStyle, flex: 1, fontFamily: "monospace", fontSize: 12 }}
            />
          </div>
        </Field>

        {/* Style toggles for text */}
        {el.type === "text" && (
          <Field label="Style">
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { label: "I", prop: "fontStyle" as const,  on: "italic", off: "normal", style: { fontStyle: "italic" } },
                { label: "B", prop: "fontWeight" as const, on: "600",    off: "400",    style: { fontWeight: 700 } },
              ].map(({ label, prop, on, off, style }) => {
                const active = el[prop] === on || (prop === "fontWeight" && Number(el[prop]) >= 600 && on === "600")
                return (
                  <button
                    key={label}
                    onClick={() => onUpdate(el.id, { [prop]: active ? off : on })}
                    style={{
                      width: 34, height: 34,
                      border: `1.5px solid ${active ? "var(--amore-pink)" : "var(--border)"}`,
                      borderRadius: "var(--radius)",
                      background: active ? "var(--amore-pink-subtle)" : "var(--surface)",
                      color: active ? "var(--amore-pink)" : "var(--text-secondary)",
                      cursor: "pointer", fontSize: 13, transition: "all 0.15s",
                      ...style,
                    }}
                  >{label}</button>
                )
              })}
            </div>
          </Field>
        )}

        {/* Position */}
        <Field label="Position">
          <div style={{ display: "flex", gap: 8 }}>
            {(["x", "y"] as const).map(prop => (
              <div key={prop} style={{ flex: 1 }}>
                <label style={{ fontSize: 10, color: "var(--text-muted)", display: "block", marginBottom: 3, fontFamily: "var(--font-ui)" }}>
                  {prop.toUpperCase()}
                </label>
                <input
                  type="number"
                  value={el[prop] || 0}
                  onChange={e => onUpdate(el.id, { [prop]: Number(e.target.value) })}
                  style={{ ...inputStyle, width: "100%" }}
                />
              </div>
            ))}
          </div>
        </Field>

        {/* Size for shapes */}
        {el.type === "shape" && (
          <Field label="Size">
            <div style={{ display: "flex", gap: 8 }}>
              {(["width", "height"] as const).map(prop => (
                <div key={prop} style={{ flex: 1 }}>
                  <label style={{ fontSize: 10, color: "var(--text-muted)", display: "block", marginBottom: 3, fontFamily: "var(--font-ui)" }}>
                    {prop.charAt(0).toUpperCase() + prop.slice(1)}
                  </label>
                  <input
                    type="number"
                    value={el[prop] || 0}
                    onChange={e => onUpdate(el.id, { [prop]: Number(e.target.value) })}
                    style={{ ...inputStyle, width: "100%" }}
                  />
                </div>
              ))}
            </div>
          </Field>
        )}

        {/* Delete */}
        <button
          onClick={() => onDelete(el.id)}
          style={{
            marginTop: 4, padding: "8px",
            border: "1px solid #FFD0E0",
            borderRadius: "var(--radius)",
            background: "none", color: "#C8004F",
            cursor: "pointer", fontSize: 12,
            fontFamily: "var(--font-ui)", fontWeight: 500,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            transition: "all 0.15s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#FFF0F5" }}
          onMouseLeave={e => { e.currentTarget.style.background = "none" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1.5 3h9M4 3V2h4v1M5 5.5v3M7 5.5v3M2 3l.75 7.5h6.5L10 3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete Element
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 10, fontWeight: 600, letterSpacing: "0.07em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 6, fontFamily: "var(--font-ui)" }}>
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: "100%", padding: "7px 10px",
  border: "1px solid var(--border)", borderRadius: "var(--radius)",
  fontSize: 13, fontFamily: "var(--font-body)",
  color: "var(--text-primary)", background: "white",
  outline: "none", transition: "border-color 0.15s", resize: "vertical",
}

/* ─────────────────────────────────────────────────────────
   Add Element Panel (left sidebar)
───────────────────────────────────────────────────────── */
function AddElementPanel({ onAdd }: { onAdd: (el: Partial<Element>) => void }) {
  const presets = [
    { label: "Header Text",  icon: "H", el: { type: "text" as const, text: "Heading",     fontSize: 60, color: "#2C1810", fontFamily: "Georgia, serif" } },
    { label: "Body Text",    icon: "T", el: { type: "text" as const, text: "Body text",   fontSize: 26, color: "#6B5744", fontFamily: "Georgia, serif" } },
    { label: "Caption",      icon: "c", el: { type: "text" as const, text: "Caption",     fontSize: 16, color: "#9E8870", fontFamily: "Georgia, serif", fontStyle: "italic" } },
    { label: "Decorative",   icon: "✦", el: { type: "text" as const, text: "✦",           fontSize: 32, color: "#D4A017" } },
    { label: "Divider Line", icon: "—", el: { type: "shape" as const, shape: "rect", width: 400, height: 2, fill: "#D4A017" } },
  ]

  return (
    <div style={{ padding: "16px 12px" }}>
      <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: 14, fontFamily: "var(--font-ui)" }}>
        Add Element
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {presets.map(p => (
          <button
            key={p.label}
            onClick={() => onAdd(p.el)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 10px", border: "1px solid var(--border)",
              borderRadius: "var(--radius)", background: "var(--surface)",
              cursor: "pointer", fontSize: 12, fontFamily: "var(--font-ui)",
              color: "var(--text-secondary)", textAlign: "left", width: "100%",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = "var(--amore-pink)"
              e.currentTarget.style.background = "var(--amore-pink-pale)"
              e.currentTarget.style.color = "var(--amore-pink)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = "var(--border)"
              e.currentTarget.style.background = "var(--surface)"
              e.currentTarget.style.color = "var(--text-secondary)"
            }}
          >
            <span style={{ width: 22, height: 22, borderRadius: 4, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, flexShrink: 0 }}>
              {p.icon}
            </span>
            {p.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Export Modal
───────────────────────────────────────────────────────── */
function ExportModal({ projectName, canvasW, canvasH, onClose }: { projectName: string; canvasW: number; canvasH: number; onClose: () => void }) {
  const [exporting, setExporting] = useState(false)
  const [format, setFormat] = useState<"pdf" | "jpeg">("jpeg")

  const handleExport = async () => {
    setExporting(true)
    const canvas = document.getElementById("invitation-canvas")
    if (!canvas) { setExporting(false); return }
    try {
      const html2canvas = (await import("html2canvas")).default
      const rendered = await html2canvas(canvas, { scale: 2, useCORS: true, backgroundColor: null })

      if (format === "jpeg") {
        const link = document.createElement("a")
        link.download = `${projectName || "invitation"}.jpg`
        link.href = rendered.toDataURL("image/jpeg", 0.95)
        link.click()
      } else {
        const { jsPDF } = await import("jspdf")
        const imgData = rendered.toDataURL("image/jpeg", 0.95)
        const pdf = new jsPDF({ orientation: canvasW > canvasH ? "landscape" : "portrait", unit: "px", format: [canvasW / 2, canvasH / 2] })
        pdf.addImage(imgData, "JPEG", 0, 0, canvasW / 2, canvasH / 2)
        pdf.save(`${projectName || "invitation"}.pdf`)
      }
    } catch (err) { console.error("Export failed:", err) }
    finally { setExporting(false); onClose() }
  }

  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(26,10,18,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="animate-fade-up" style={{ background: "var(--surface)", borderRadius: "var(--radius-xl)", padding: 32, width: 360, boxShadow: "var(--shadow-lg)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 400, marginBottom: 6, color: "var(--amore-pink)" }}>
          Download invitation
        </h3>
        <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 24, fontFamily: "var(--font-ui)" }}>
          Choose your preferred format
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {(["jpeg", "pdf"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              style={{
                flex: 1, padding: "14px 12px",
                border: `1.5px solid ${format === f ? "var(--amore-pink)" : "var(--border)"}`,
                borderRadius: "var(--radius-lg)",
                background: format === f ? "var(--amore-pink-pale)" : "var(--surface)",
                cursor: "pointer", textAlign: "center", transition: "all 0.15s",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>{f === "jpeg" ? "🖼️" : "📄"}</div>
              <div style={{ fontSize: 13, fontWeight: 600, fontFamily: "var(--font-ui)", color: format === f ? "var(--amore-pink)" : "var(--text-primary)" }}>{f.toUpperCase()}</div>
              <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2, fontFamily: "var(--font-ui)" }}>{f === "jpeg" ? "For sharing" : "For printing"}</div>
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={handleExport} disabled={exporting} className="btn-primary" style={{ flex: 2 }}>
            {exporting ? "Exporting…" : `Download ${format.toUpperCase()}`}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Rename Modal
───────────────────────────────────────────────────────── */
function RenameModal({ currentName, onSave, onClose }: { currentName: string; onSave: (name: string) => void; onClose: () => void }) {
  const [value, setValue] = useState(currentName)
  return (
    <div
      style={{ position: "fixed", inset: 0, background: "rgba(26,10,18,0.45)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, backdropFilter: "blur(4px)" }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="animate-fade-up" style={{ background: "var(--surface)", borderRadius: "var(--radius-xl)", padding: 28, width: 340, boxShadow: "var(--shadow-lg)" }}>
        <h3 style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 400, marginBottom: 18, color: "var(--text-primary)" }}>Rename Invitation</h3>
        <input
          autoFocus
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") onSave(value); if (e.key === "Escape") onClose() }}
          style={{ ...inputStyle, marginBottom: 18 }}
        />
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} className="btn-ghost" style={{ flex: 1 }}>Cancel</button>
          <button onClick={() => onSave(value)} className="btn-primary" style={{ flex: 2 }}>Save</button>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   Main Editor
───────────────────────────────────────────────────────── */
export default function EditorCanvas({ project }: { project: any }) {
  const router = useRouter()
  const [editorData, setEditorData] = useState<CanvasData>(project.data)
  const [projectName, setProjectName] = useState(project.name || "Untitled")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMsg, setSaveMsg] = useState("")
  const [showExport, setShowExport] = useState(false)
  const [showRename, setShowRename] = useState(false)
  const [scale, setScale] = useState(0.35)

  /* Auto-fit scale on mount */
  useEffect(() => {
    const availH = window.innerHeight - 120
    const availW = window.innerWidth - 340
    const scaleH = availH / (editorData?.canvas?.height || 1350)
    const scaleW = availW / (editorData?.canvas?.width  || 1080)
    const fit = Math.min(scaleH, scaleW, 1)
    const steps = [0.15, 0.25, 0.35, 0.5, 0.65, 0.8, 1]
    const closest = steps.reduce((a, b) => Math.abs(b - fit) < Math.abs(a - fit) ? b : a)
    setScale(closest)
  }, [])

  const updateElement = useCallback((id: string, patch: Partial<Element>) => {
    setEditorData(prev => ({
      ...prev,
      elements: prev.elements.map(el => el.id === id ? { ...el, ...patch } : el),
    }))
    setIsDirty(true)
  }, [])

  const deleteElement = useCallback((id: string) => {
    setEditorData(prev => ({ ...prev, elements: prev.elements.filter(el => el.id !== id) }))
    setSelectedId(null)
    setIsDirty(true)
  }, [])

  const addElement = useCallback((partial: Partial<Element>) => {
    const newEl: Element = {
      id: `el_${Date.now()}`,
      type: "text",
      text: "New text",
      x: Math.round((editorData?.canvas?.width || 1080) / 2 - 80),
      y: Math.round((editorData?.canvas?.height || 1350) / 2 - 20),
      fontSize: 28,
      color: "#1A0A12",
      fontFamily: "Georgia, serif",
      ...partial,
    } as Element
    setEditorData(prev => ({ ...prev, elements: [...prev.elements, newEl] }))
    setSelectedId(newEl.id)
    setIsDirty(true)
  }, [editorData?.canvas])

  const handleSave = useCallback(async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    setSaving(true)
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: editorData, name: projectName }),
      })
      setIsDirty(false)
      setSaveMsg("Saved ✓")
      setTimeout(() => setSaveMsg(""), 2500)
    } finally {
      setSaving(false)
    }
  }, [editorData, project.id, projectName])

  const handleRename = async (name: string) => {
    setProjectName(name)
    setShowRename(false)
    setIsDirty(true)
  }

  const handleBack = async () => {
    if (isDirty && !window.confirm("You have unsaved changes. Leave anyway?")) return
    const token = localStorage.getItem("token")
    if (token) {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${project.id}/deactivate`, {
        method: "POST", headers: { Authorization: `Bearer ${token}` },
      })
    }
    router.push("/dashboard")
  }

  /* Keyboard shortcuts */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === "s") { e.preventDefault(); handleSave() }
      if (e.key === "Escape") setSelectedId(null)
      if ((e.key === "Delete" || e.key === "Backspace") && selectedId) {
        const active = document.activeElement
        if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) return
        deleteElement(selectedId)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handleSave, selectedId, deleteElement])

  useEffect(() => {
    const h = (e: BeforeUnloadEvent) => { if (isDirty) { e.preventDefault(); e.returnValue = "" } }
    window.addEventListener("beforeunload", h)
    return () => window.removeEventListener("beforeunload", h)
  }, [isDirty])

  return (
    <>
      <div style={{ height: "100vh", display: "flex", flexDirection: "column", background: "var(--bg)", overflow: "hidden" }}>
        {/* ── Header ── */}
        <header style={{
          height: 56, borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 16px", background: "var(--surface)", flexShrink: 0, zIndex: 50,
          boxShadow: "0 1px 0 var(--border)",
        }}>
          {/* Left */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button
              onClick={handleBack}
              style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 13, color: "var(--text-secondary)", background: "none", border: "none", cursor: "pointer", padding: "5px 8px", borderRadius: "var(--radius)", fontFamily: "var(--font-ui)", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--amore-pink-pale)"; e.currentTarget.style.color = "var(--amore-pink)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-secondary)" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back
            </button>

            <span style={{ color: "var(--border-strong)" }}>·</span>

            {/* Editable project name */}
            <button
              onClick={() => setShowRename(true)}
              style={{
                fontSize: 13, fontWeight: 500, color: "var(--text-primary)",
                background: "none", border: "none", cursor: "pointer",
                padding: "4px 8px", borderRadius: "var(--radius)",
                fontFamily: "var(--font-ui)",
                maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--amore-pink-pale)"; e.currentTarget.style.color = "var(--amore-pink)" }}
              onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "var(--text-primary)" }}
              title="Click to rename"
            >
              ✏️ {projectName}
            </button>

            {isDirty && !saveMsg && (
              <span style={{ fontSize: 10, color: "var(--amore-gold)", background: "var(--amore-gold-subtle)", padding: "2px 8px", borderRadius: 20, fontFamily: "var(--font-ui)" }}>
                Unsaved
              </span>
            )}
            {saveMsg && (
              <span style={{ fontSize: 10, color: "var(--success)", background: "#EFF8EF", padding: "2px 8px", borderRadius: 20, fontFamily: "var(--font-ui)" }}>
                {saveMsg}
              </span>
            )}
          </div>

          {/* Centre logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
            <span style={{ fontSize: 15 }}>🕊️</span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: 18, fontWeight: 400, color: "var(--amore-pink)" }}>Amore</span>
          </div>

          {/* Right */}
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button onClick={() => setShowExport(true)} className="btn-ghost" style={{ fontSize: 12 }}>
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                <path d="M6.5 1v7M3.5 6l3 3 3-3M1 10v1.5A.5.5 0 001.5 12h10a.5.5 0 00.5-.5V10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Export
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !isDirty}
              className="btn-primary"
              style={{ fontSize: 12 }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </header>

        {/* ── Body ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
          {/* Left: Add elements */}
          <div style={{ width: 156, borderRight: "1px solid var(--border)", background: "var(--surface)", overflowY: "auto", flexShrink: 0 }}>
            <AddElementPanel onAdd={addElement} />
          </div>

          {/* Centre: Canvas */}
          <div style={{ flex: 1, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "auto", padding: 40, position: "relative" }}>
            <div style={{ transform: `scale(${scale})`, transformOrigin: "center center", flexShrink: 0 }}>
              <InvitationCanvas
                data={editorData}
                selectedId={selectedId}
                onSelect={setSelectedId}
                onUpdateElement={updateElement}
                scale={scale}
              />
            </div>
            <ZoomBar scale={scale} setScale={setScale} />
          </div>

          {/* Right: Properties */}
          <aside style={{ width: 260, borderLeft: "1px solid var(--border)", background: "var(--surface)", overflowY: "auto", flexShrink: 0 }}>
            <PropertiesPanel
              data={editorData}
              selectedId={selectedId}
              onUpdate={updateElement}
              onDelete={deleteElement}
              onDeselect={() => setSelectedId(null)}
            />
          </aside>
        </div>
      </div>

      {showExport && (
        <ExportModal
          projectName={projectName}
          canvasW={editorData?.canvas?.width || 1080}
          canvasH={editorData?.canvas?.height || 1350}
          onClose={() => setShowExport(false)}
        />
      )}
      {showRename && (
        <RenameModal
          currentName={projectName}
          onSave={handleRename}
          onClose={() => setShowRename(false)}
        />
      )}
    </>
  )
}