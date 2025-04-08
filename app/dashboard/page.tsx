"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Activity, BarChart3, Droplets, LogOut, Plus, Minus, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

// Types
interface BMIData {
  height: number
  weight: number
  age: number
  gender: string
  bmi: string
  category: string
  date: string
}

interface ActivityData {
  type: string
  duration: string
  date: string
}

interface WaterData {
  count: number
  goal: number
}

interface StepData {
  steps: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [bmiData, setBmiData] = useState<BMIData | null>(null)
  const [waterData, setWaterData] = useState<WaterData>({ count: 0, goal: 8 })
  const [stepData, setStepData] = useState<StepData>({ steps: 0 })
  const [activities, setActivities] = useState<ActivityData[]>([])
  const [activityType, setActivityType] = useState("")
  const [activityDuration, setActivityDuration] = useState("")
  const [stepsInput, setStepsInput] = useState("")

  // Mock data for charts
  const [weightHistory] = useState([
    { date: "1 Week Ago", weight: 75 },
    { date: "6 Days Ago", weight: 74.5 },
    { date: "5 Days Ago", weight: 74.2 },
    { date: "4 Days Ago", weight: 74 },
    { date: "3 Days Ago", weight: 73.8 },
    { date: "2 Days Ago", weight: 73.5 },
    { date: "Today", weight: 73.2 },
  ])

  const [waterHistory] = useState([
    { date: "Mon", glasses: 6 },
    { date: "Tue", glasses: 5 },
    { date: "Wed", glasses: 8 },
    { date: "Thu", glasses: 7 },
    { date: "Fri", glasses: 9 },
    { date: "Sat", glasses: 6 },
    { date: "Sun", glasses: 8 },
  ])

  const [stepHistory] = useState([
    { date: "Mon", steps: 8000 },
    { date: "Tue", steps: 10000 },
    { date: "Wed", steps: 9000 },
    { date: "Thu", steps: 7500 },
    { date: "Fri", steps: 12000 },
    { date: "Sat", steps: 11000 },
    { date: "Sun", steps: 9500 },
  ])

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("fitness-user")
    if (!user) {
      router.push("/login")
      return
    }

    setUsername(user)

    // Load BMI data
    const storedBmiData = localStorage.getItem("bmi-data")
    if (storedBmiData) {
      setBmiData(JSON.parse(storedBmiData))
    } else {
      router.push("/bmi")
      return
    }

    // Load water data
    const storedWaterData = localStorage.getItem(`water-data-${user}`)
    if (storedWaterData) {
      setWaterData(JSON.parse(storedWaterData))
    } else {
      // Initialize water data for this user
      const initialWaterData = { count: 0, goal: 8 }
      localStorage.setItem(`water-data-${user}`, JSON.stringify(initialWaterData))
      setWaterData(initialWaterData)
    }

    // Load step data
    const storedStepData = localStorage.getItem(`step-data-${user}`)
    if (storedStepData) {
      const parsedStepData = JSON.parse(storedStepData)
      setStepData(parsedStepData)
      setStepsInput(parsedStepData.steps.toString())
    } else {
      // Initialize step data for this user
      const initialStepData = { steps: 0 }
      localStorage.setItem(`step-data-${user}`, JSON.stringify(initialStepData))
      setStepData(initialStepData)
    }

    // Load activities
    const storedActivities = localStorage.getItem(`activities-${user}`)
    if (storedActivities) {
      setActivities(JSON.parse(storedActivities))
    } else {
      // Initialize activities for this user
      localStorage.setItem(`activities-${user}`, JSON.stringify([]))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("fitness-user")
    router.push("/login")
  }

  const adjustWater = (change: number) => {
    const newCount = Math.max(0, Math.min(waterData.count + change, 20))
    const newWaterData = { ...waterData, count: newCount }
    setWaterData(newWaterData)
    localStorage.setItem(`water-data-${username}`, JSON.stringify(newWaterData))
  }

  const saveSteps = () => {
    const steps = Number.parseInt(stepsInput) || 0
    const newStepData = { steps }
    setStepData(newStepData)
    localStorage.setItem(`step-data-${username}`, JSON.stringify(newStepData))
  }

  const addActivity = (e: React.FormEvent) => {
    e.preventDefault()

    if (!activityType || !activityDuration) return

    const newActivity = {
      type: activityType,
      duration: activityDuration,
      date: new Date().toISOString(),
    }

    const updatedActivities = [newActivity, ...activities]
    setActivities(updatedActivities)
    localStorage.setItem(`activities-${username}`, JSON.stringify(updatedActivities))

    // Reset form
    setActivityType("")
    setActivityDuration("")
  }

  const calculateCaloriesBurned = () => {
    // Simple calculation: 0.04 calories per step
    return Math.round(stepData.steps * 0.04)
  }

  const calculateDistance = () => {
    // Simple calculation: 0.000762 km per step
    return (stepData.steps * 0.000762).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-primary p-4 text-primary-foreground shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FitTrack Pro</h1>
            <p className="text-sm opacity-90">Welcome back, {username}</p>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="gap-2 text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </Button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* BMI Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Your BMI Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold text-primary">{bmiData?.bmi}</span>
                <span className="text-sm text-muted-foreground">({bmiData?.category})</span>
              </div>

              <div className="mt-4 h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={weightHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={["dataMin - 1", "dataMax + 1"]} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#4361ee"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Water Intake Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Water Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Button variant="outline" size="icon" onClick={() => adjustWater(-1)} disabled={waterData.count <= 0}>
                    <Minus className="h-4 w-4" />
                  </Button>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">{waterData.count}</span>
                    <span className="text-muted-foreground">/ {waterData.goal} glasses</span>
                  </div>

                  <Button variant="outline" size="icon" onClick={() => adjustWater(1)}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <Droplets className="h-8 w-8 text-blue-500" />
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-blue-500 transition-all duration-300"
                  style={{ width: `${(waterData.count / waterData.goal) * 100}%` }}
                />
              </div>

              <div className="mt-6 h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={waterHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="glasses" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Step Counter Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Step Counter</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={stepsInput}
                  onChange={(e) => setStepsInput(e.target.value)}
                  placeholder="Enter today's steps"
                />
                <Button onClick={saveSteps}>Save</Button>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-sm text-muted-foreground">Calories burned</p>
                  <p className="text-xl font-semibold">{calculateCaloriesBurned()}</p>
                </div>
                <div className="rounded-lg bg-muted p-3 text-center">
                  <p className="text-sm text-muted-foreground">Distance (km)</p>
                  <p className="text-xl font-semibold">{calculateDistance()}</p>
                </div>
              </div>

              <div className="mt-4 h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stepHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="steps" fill="#4361ee" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Activity Tracker Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Track Your Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addActivity} className="space-y-4">
                <Select value={activityType} onValueChange={setActivityType} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="walking">Walking</SelectItem>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="cycling">Cycling</SelectItem>
                    <SelectItem value="swimming">Swimming</SelectItem>
                    <SelectItem value="strength">Strength Training</SelectItem>
                    <SelectItem value="yoga">Yoga/Stretching</SelectItem>
                    <SelectItem value="meditation">Meditation</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Duration (minutes)"
                    value={activityDuration}
                    onChange={(e) => setActivityDuration(e.target.value)}
                    required
                  />
                  <Button type="submit">Add</Button>
                </div>
              </form>

              <div className="mt-4 max-h-[300px] overflow-y-auto">
                {activities.length > 0 ? (
                  <div className="space-y-2">
                    {activities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-muted p-3">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="capitalize">{activity.type}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{activity.duration} mins</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(activity.date).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">No activities recorded yet</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Suggestions Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Today's Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Droplets className="h-4 w-4 text-primary" />
                  </div>
                  <span>Drink 8 glasses of water</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <BarChart3 className="h-4 w-4 text-primary" />
                  </div>
                  <span>Take 10,000 steps</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <span>15 minutes of stretching</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <span>7-8 hours of sleep</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="rounded-full bg-primary/10 p-1">
                    <Activity className="h-4 w-4 text-primary" />
                  </div>
                  <span>10 minutes of meditation</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* User Profile Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{username}</h3>
                  <p className="text-sm text-muted-foreground">Member since {new Date().toLocaleDateString()}</p>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Height</span>
                  <span>{bmiData?.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight</span>
                  <span>{bmiData?.weight} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age</span>
                  <span>{bmiData?.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender</span>
                  <span className="capitalize">{bmiData?.gender}</span>
                </div>
              </div>

              <Button variant="outline" className="mt-4 w-full" onClick={() => router.push("/bmi")}>
                Update BMI
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
