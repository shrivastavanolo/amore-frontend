import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-5xl font-bold">Amore 💍</h1>
      <p className="text-lg text-gray-600">
        Design beautiful wedding invitations in minutes
      </p>

      <Link
        href="/login"
        className="px-6 py-3 rounded bg-black text-white"
      >
        Get Started
      </Link>
    </main>
  )
}
