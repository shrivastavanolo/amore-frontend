"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function Dashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <p className="p-8">Loading...</p>

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Your Dashboard</h1>
      <p className="text-gray-600 mt-2">
        Continue your project or create a new wedding card
      </p>
    </div>
  )
}
