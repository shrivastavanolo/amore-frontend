"use client"

export default function LoginPage() {
  const devLogin = async () => {
    const res = await fetch("http://127.0.0.1:8000/auth/google/login")
    const data = await res.json()

    // Redirect browser to Google
    window.location.href = data.url
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h2 className="text-3xl font-semibold">Login</h2>

      <button
        onClick={devLogin}
        className="px-6 py-3 rounded bg-red-500 text-white"
      >
        Continue with Google
      </button>
    </main>
  )
}
