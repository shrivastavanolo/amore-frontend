"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams.get("token")
    if (token) {
      localStorage.setItem("token", token)
      router.replace("/dashboard")
    } else {
      router.replace("/login")
    }
  }, [searchParams, router])

  return (
    <div style={{
      height: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 20,
      background: "var(--amore-cream)",
    }}>
      {/* Animated logo mark */}
      <div style={{
        width: 64, height: 64,
        background: "linear-gradient(135deg, var(--amore-pink), #FF4DA6)",
        borderRadius: "50%",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 28,
        boxShadow: "0 8px 24px rgba(232,0,106,0.35)",
        animation: "pulsePink 2s infinite",
      }}>🕊️</div>
      <div style={{ fontFamily: "var(--font-display)", fontSize: 30, fontWeight: 400, color: "var(--amore-pink)" }}>
        Amore Invites Co.
      </div>
      <p style={{ fontSize: 13, color: "var(--text-muted)", fontFamily: "var(--font-ui)" }}>
        Signing you in…
      </p>
    </div>
  )
}