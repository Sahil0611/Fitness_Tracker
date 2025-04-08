"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function BMIPage() {
  const router = useRouter()
  const [height, setHeight] = useState("")
  const [weight, setWeight] = useState("")
  const [age, setAge] = useState("")
  const [gender, setGender] = useState("male")
  const [bmi, setBmi] = useState<number | null>(null)
  const [bmiCategory, setBmiCategory] = useState("")
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("fitness-user")
    if (!user) {
      router.push("/login")
    }
  }, [router])

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault()

    const heightValue = Number.parseFloat(height)
    const weightValue = Number.parseFloat(weight)
    const ageValue = Number.parseInt(age)

    if (heightValue && weightValue && ageValue) {
      const bmiValue = weightValue / (heightValue / 100) ** 2
      setBmi(Number.parseFloat(bmiValue.toFixed(1)))
      setBmiCategory(getBMICategory(bmiValue))
      setShowResult(true)

      // Store BMI data in localStorage
      localStorage.setItem(
        "bmi-data",
        JSON.stringify({
          height: heightValue,
          weight: weightValue,
          age: ageValue,
          gender,
          bmi: bmiValue.toFixed(1),
          category: getBMICategory(bmiValue),
          date: new Date().toISOString(),
        }),
      )
    }
  }

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  const getIndicatorPosition = () => {
    if (bmi === null) return "0%"
    // Position indicator on 0-40 scale (BMI range)
    const position = Math.min(Math.max((bmi / 40) * 100, 2.5), 97.5)
    return `${position}%`
  }

  const proceedToDashboard = () => {
    router.push("/dashboard")
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">Let's Calculate Your BMI</CardTitle>
          <CardDescription>Enter your details to get personalized fitness recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          {!showResult ? (
            <form onSubmit={calculateBMI} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  min="100"
                  max="250"
                  placeholder="Enter your height"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  min="30"
                  max="300"
                  placeholder="Enter your weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="12"
                  max="120"
                  placeholder="Enter your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Gender</Label>
                <RadioGroup value={gender} onValueChange={setGender} className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="gender-male" />
                    <Label htmlFor="gender-male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="gender-female" />
                    <Label htmlFor="gender-female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <Button type="submit" className="w-full">
                Calculate BMI
              </Button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-lg bg-card p-4 shadow-sm">
                <h3 className="text-center text-lg font-semibold">
                  Your BMI: <span className="text-2xl text-primary">{bmi}</span>
                </h3>
                <p className="text-center text-muted-foreground">
                  Category: <span className="font-medium text-primary">{bmiCategory}</span>
                </p>

                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Underweight</span>
                    <span>Normal</span>
                    <span>Overweight</span>
                    <span>Obese</span>
                  </div>
                  <div className="relative mt-2 h-2 rounded-full bg-muted">
                    <div
                      className="absolute -top-1 h-4 w-4 translate-x-[-50%] rounded-full bg-primary"
                      style={{ left: getIndicatorPosition() }}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={proceedToDashboard} className="w-full">
                Proceed to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
