"use client"

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/google/login")
    const data = await res.json()
    window.location.href = data.url
  }

  return (
    <main style={{ background: "var(--bg)", minHeight: "100vh", display: "flex" }}>
      {/* ── Left panel ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "46%",
          background: "var(--amore-ink)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "60px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Stripe texture */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `repeating-linear-gradient(
            0deg, transparent, transparent 48px,
            rgba(232,0,106,0.04) 48px, rgba(232,0,106,0.04) 49px
          )`,
        }} />
        {/* Gold ring decorations */}
        {[560, 380, 220].map((size, i) => (
          <div key={i} style={{
            position: "absolute",
            width: size, height: size,
            border: `1px solid rgba(212,160,23,${0.08 - i * 0.02})`,
            borderRadius: "50%",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }} />
        ))}

        {/* Logo mark */}
        <div style={{ position: "relative", textAlign: "center", color: "white", maxWidth: 340 }}>
          {/* Bird icon (inline SVG heart/birds suggestion) */}
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(135deg, var(--amore-pink) 0%, #FF4DA6 100%)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 28px",
            boxShadow: "0 8px 24px rgba(232,0,106,0.4)",
            fontSize: 32,
          }}>
            🕊️
          </div>

          <p style={{
            fontFamily: "var(--font-ui)",
            fontSize: 11,
            letterSpacing: "0.22em",
            color: "var(--amore-gold-light)",
            textTransform: "uppercase",
            marginBottom: 20,
          }}>
            Amore Invites Co.
          </p>
          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: 50,
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: 22,
            color: "white",
          }}>
            Craft invitations<br />
            <em style={{ fontStyle: "italic", fontWeight: 400, color: "var(--amore-pink-light)" }}>
              worth keeping
            </em>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 14, lineHeight: 1.75 }}>
            Design stunning wedding invitations with professionally
            crafted templates — no design skills needed.
          </p>
        </div>

        {/* Bottom tagline */}
        <div style={{ position: "absolute", bottom: 36, display: "flex", gap: 10, alignItems: "center" }}>
          {["Elegant", "Joyful", "Yours"].map((w, i) => (
            <span key={w}>
              <span style={{ color: "rgba(255,255,255,0.35)", fontSize: 12, fontFamily: "var(--font-ui)" }}>{w}</span>
              {i < 2 && <span style={{ color: "rgba(212,160,23,0.45)", margin: "0 10px", fontSize: 9 }}>♦</span>}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right: form ── */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "60px 40px",
        background: "var(--amore-cream)",
        position: "relative",
      }}>
        {/* Subtle pink stripe background */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: `repeating-linear-gradient(
            90deg, transparent, transparent 56px,
            rgba(232,0,106,0.025) 56px, rgba(232,0,106,0.025) 57px
          )`,
        }} />

        <div style={{ width: "100%", maxWidth: 380, position: "relative" }}>
          {/* Mobile logo */}
          <div className="lg:hidden" style={{ marginBottom: 44, textAlign: "center" }}>
            <p style={{
              fontFamily: "var(--font-ui)",
              fontSize: 20,
              fontWeight: 600,
              color: "var(--amore-pink)",
              letterSpacing: "0.01em",
            }}>
              Amore Invites Co.
            </p>
          </div>

          <div className="animate-fade-up">
            {/* Welcome */}
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: 38,
              fontWeight: 400,
              color: "var(--text-primary)",
              marginBottom: 6,
              lineHeight: 1.2,
            }}>
              Welcome back
            </h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, marginBottom: 36, fontFamily: "var(--font-ui)" }}>
              Sign in to access your invitation studio
            </p>

            {/* Divider */}
            <div style={{
              display: "flex", alignItems: "center", gap: 12, marginBottom: 28,
            }}>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
              <span style={{ fontSize: 11, color: "var(--text-muted)", fontFamily: "var(--font-ui)", letterSpacing: "0.08em" }}>
                CONTINUE WITH
              </span>
              <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            </div>

            {/* Google button */}
            <button
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                padding: "14px 24px",
                background: "white",
                border: "1.5px solid var(--border-strong)",
                borderRadius: "var(--radius)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "var(--font-ui)",
                fontWeight: 500,
                color: "var(--text-primary)",
                transition: "all 0.18s ease",
                boxShadow: "var(--shadow-sm)",
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "var(--amore-pink)"
                el.style.boxShadow = "var(--shadow-pink), var(--shadow-sm)"
                el.style.transform = "translateY(-1px)"
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = "var(--border-strong)"
                el.style.boxShadow = "var(--shadow-sm)"
                el.style.transform = "translateY(0)"
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </button>

            <p style={{
              textAlign: "center",
              color: "var(--text-muted)",
              fontSize: 11,
              marginTop: 22,
              lineHeight: 1.7,
              fontFamily: "var(--font-ui)",
            }}>
              By continuing, you agree to our Terms of Service<br />and Privacy Policy
            </p>
          </div>
        </div>

        <p style={{
          position: "absolute", bottom: 28,
          color: "var(--text-muted)",
          fontSize: 11,
          fontFamily: "var(--font-ui)",
          letterSpacing: "0.04em",
        }}>
          © 2026 Amore Invites Co.
        </p>
      </div>
    </main>
  )
}