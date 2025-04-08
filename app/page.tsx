"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("fitness-user")

    if (user) {
      // If user has BMI data, go to dashboard, otherwise go to BMI page
      const bmiData = localStorage.getItem("bmi-data")
      if (bmiData) {
        router.push("/dashboard")
      } else {
        router.push("/bmi")
      }
    } else {
      router.push("/login")
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-lg text-muted-foreground">Loading...</p>
      </div>
    </div>
  )
}
