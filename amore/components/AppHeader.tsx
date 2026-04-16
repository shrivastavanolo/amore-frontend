"use client"

interface AppHeaderProps {
  rightSlot?: React.ReactNode
  leftSlot?: React.ReactNode
  showLogo?: boolean
}

export function AppHeader({ rightSlot, leftSlot, showLogo = true }: AppHeaderProps) {
  return (
    <header style={{
      height: 60,
      borderBottom: "1px solid var(--border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 28px",
      background: "var(--surface)",
      position: "sticky",
      top: 0,
      zIndex: 100,
      boxShadow: "0 1px 0 var(--border), var(--shadow-sm)",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {leftSlot}
        {showLogo && (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>🕊️</span>
            <span style={{
              fontFamily: "var(--font-display)",
              fontSize: 21,
              fontWeight: 400,
              color: "var(--amore-pink)",
              letterSpacing: "0.01em",
            }}>
              Amore
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.14em",
              color: "var(--gold)",
              textTransform: "uppercase",
              paddingTop: 2,
              fontFamily: "var(--font-ui)",
            }}>
              Invites
            </span>
          </div>
        )}
      </div>
      {rightSlot && (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {rightSlot}
        </div>
      )}
    </header>
  )
}