"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import EditorCanvas from "./editorCanvas"

export default function EditorPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const router = useRouter()
  const [project, setProject] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!projectId) return
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }

    const loadProject = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        if (!res.ok) { router.push("/dashboard"); return }
        const data = await res.json()
        setProject(data)
        // Activate in background - don't block load
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/activate`, {
          method: "POST", headers: { Authorization: `Bearer ${token}` },
        }).catch(() => {})
      } catch {
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }

    loadProject()

    const handleUnload = () => {
      navigator.sendBeacon(`${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}/deactivate`)
    }
    window.addEventListener("beforeunload", handleUnload)
    return () => {
      window.removeEventListener("beforeunload", handleUnload)
      handleUnload()
    }
  }, [projectId, router])

  if (loading) {
    return (
      <div style={{
        height: "100vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 18,
        background: "var(--amore-cream)",
      }}>
        <div style={{
          width: 56, height: 56,
          background: "linear-gradient(135deg, var(--amore-pink), #FF4DA6)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, boxShadow: "0 6px 20px rgba(232,0,106,0.3)",
          animation: "pulsePink 2s infinite",
        }}>🕊️</div>
        <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 400, color: "var(--amore-pink)", animation: "fadeIn 0.6s ease" }}>
          Amore
        </div>
        <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>Loading your invitation…</p>
      </div>
    )
  }

  if (!project) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>💌</div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 22, color: "var(--text-secondary)", marginBottom: 20 }}>
            Invitation not found
          </p>
          <button onClick={() => router.push("/dashboard")} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  return <EditorCanvas project={project} />
}