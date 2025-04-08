import { Chart } from "@/components/ui/chart"
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = localStorage.getItem("fitness-user")
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  // Initialize dashboard components
  initUserProfile()
  initBMIDisplay()
  initWaterTracker()
  initStepTracker()
  initActivityTracker()
  initCharts()
  initLogout()

  // User Profile Initialization
  function initUserProfile() {
    // Display username
    const usernameEls = document.querySelectorAll("#user-name, #profile-name")
    usernameEls.forEach((el) => {
      if (el) el.textContent = currentUser
    })

    // Set member since date
    const memberSinceEl = document.getElementById("member-since")
    if (memberSinceEl) {
      memberSinceEl.textContent = new Date().toLocaleDateString()
    }

    // Load BMI data for profile
    const bmiData = JSON.parse(localStorage.getItem(`bmi-data-${currentUser}`))
    if (bmiData) {
      document.getElementById("profile-height").textContent = `${bmiData.height} cm`
      document.getElementById("profile-weight").textContent = `${bmiData.weight} kg`
      document.getElementById("profile-age").textContent = `${bmiData.age} years`
      document.getElementById("profile-gender").textContent =
        bmiData.gender.charAt(0).toUpperCase() + bmiData.gender.slice(1)
    }

    // Set update BMI button
    const updateBmiBtn = document.getElementById("update-bmi-btn")
    if (updateBmiBtn) {
      updateBmiBtn.addEventListener("click", () => {
        window.location.href = "bmi.html"
      })
    }
  }

  // BMI Display Initialization
  function initBMIDisplay() {
    const bmiData = JSON.parse(localStorage.getItem(`bmi-data-${currentUser}`))
    if (bmiData) {
      document.getElementById("bmi-display").textContent = bmiData.bmi
      document.getElementById("bmi-category").textContent = `(${bmiData.category})`
    }
  }

  // Water Tracker Initialization
  function initWaterTracker() {
    // Load or initialize water data
    let waterData = JSON.parse(localStorage.getItem(`water-data-${currentUser}`))
    if (!waterData) {
      waterData = { count: 0, goal: 8 }
      localStorage.setItem(`water-data-${currentUser}`, JSON.stringify(waterData))
    }

    // Display water data
    document.getElementById("water-count").textContent = waterData.count
    document.getElementById("water-goal").textContent = waterData.goal
    updateWaterProgress(waterData.count, waterData.goal)

    // Add button event listeners
    document.getElementById("water-plus").addEventListener("click", () => {
      adjustWater(1)
    })

    document.getElementById("water-minus").addEventListener("click", () => {
      adjustWater(-1)
    })
  }

  // Step Tracker Initialization
  function initStepTracker() {
    // Load or initialize step data
    let stepData = JSON.parse(localStorage.getItem(`step-data-${currentUser}`))
    if (!stepData) {
      stepData = { steps: 0 }
      localStorage.setItem(`step-data-${currentUser}`, JSON.stringify(stepData))
    }

    // Display step data
    document.getElementById("steps-input").value = stepData.steps
    updateStepStats(stepData.steps)

    // Add save button event listener
    document.getElementById("steps-submit").addEventListener("click", () => {
      const steps = Number.parseInt(document.getElementById("steps-input").value) || 0
      stepData.steps = steps
      localStorage.setItem(`step-data-${currentUser}`, JSON.stringify(stepData))
      updateStepStats(steps)

      // Update step history
      const today = new Date().toISOString().split("T")[0]
      const stepHistory = JSON.parse(localStorage.getItem(`step-history-${currentUser}`)) || []

      // Find or create today's entry
      const todayEntry = stepHistory.find((entry) => entry.date.startsWith(today))
      if (todayEntry) {
        todayEntry.steps = steps
      } else {
        stepHistory.push({
          date: new Date().toISOString(),
          steps: steps,
        })
      }

      localStorage.setItem(`step-history-${currentUser}`, JSON.stringify(stepHistory))
      initCharts() // Refresh charts
    })
  }

  // Activity Tracker Initialization
  function initActivityTracker() {
    const activityForm = document.getElementById("activity-form")
    if (activityForm) {
      activityForm.addEventListener("submit", (e) => {
        e.preventDefault()

        const type = document.getElementById("activity-type").value
        const duration = document.getElementById("activity-duration").value

        if (type && duration) {
          saveActivity(type, duration)
          updateActivityList()
          activityForm.reset()
        }
      })
    }

    // Initialize activity list
    updateActivityList()
  }

  // Chart Initialization
  function initCharts() {
    // Mock weight history data
    const weightHistory = [
      { date: "1 Week Ago", weight: 75 },
      { date: "6 Days Ago", weight: 74.5 },
      { date: "5 Days Ago", weight: 74.2 },
      { date: "4 Days Ago", weight: 74 },
      { date: "3 Days Ago", weight: 73.8 },
      { date: "2 Days Ago", weight: 73.5 },
      { date: "Today", weight: 73.2 },
    ]

    // Weight Chart
    const weightChartEl = document.getElementById("weight-chart")
    if (weightChartEl) {
      const ctx = weightChartEl.getContext("2d")

      // Clear previous chart if it exists
      if (window.weightChart) {
        window.weightChart.destroy()
      }

      window.weightChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: weightHistory.map((d) => d.date),
          datasets: [
            {
              label: "Weight (kg)",
              data: weightHistory.map((d) => d.weight),
              borderColor: "#4361ee",
              backgroundColor: "rgba(67, 97, 238, 0.1)",
              tension: 0.1,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    }

    // Water Chart
    const waterHistory = [
      { date: "Mon", glasses: 6 },
      { date: "Tue", glasses: 5 },
      { date: "Wed", glasses: 8 },
      { date: "Thu", glasses: 7 },
      { date: "Fri", glasses: 9 },
      { date: "Sat", glasses: 6 },
      { date: "Sun", glasses: 8 },
    ]

    const waterChartEl = document.getElementById("water-chart")
    if (waterChartEl) {
      const ctx = waterChartEl.getContext("2d")

      // Clear previous chart if it exists
      if (window.waterChart) {
        window.waterChart.destroy()
      }

      window.waterChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: waterHistory.map((d) => d.date),
          datasets: [
            {
              label: "Glasses",
              data: waterHistory.map((d) => d.glasses),
              backgroundColor: "#3b82f6",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    }

    // Steps Chart
    const stepHistory = [
      { date: "Mon", steps: 8000 },
      { date: "Tue", steps: 10000 },
      { date: "Wed", steps: 9000 },
      { date: "Thu", steps: 7500 },
      { date: "Fri", steps: 12000 },
      { date: "Sat", steps: 11000 },
      { date: "Sun", steps: 9500 },
    ]

    const stepsChartEl = document.getElementById("steps-chart")
    if (stepsChartEl) {
      const ctx = stepsChartEl.getContext("2d")

      // Clear previous chart if it exists
      if (window.stepsChart) {
        window.stepsChart.destroy()
      }

      window.stepsChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels: stepHistory.map((d) => d.date),
          datasets: [
            {
              label: "Steps",
              data: stepHistory.map((d) => d.steps),
              backgroundColor: "#4361ee",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      })
    }
  }

  // Logout Initialization
  function initLogout() {
    const logoutBtn = document.getElementById("logout-btn")
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("fitness-user")
        window.location.href = "login.html"
      })
    }
  }

  // Helper Functions
  function adjustWater(change) {
    const waterData = JSON.parse(localStorage.getItem(`water-data-${currentUser}`))
    waterData.count = Math.max(0, Math.min(waterData.count + change, 20))
    localStorage.setItem(`water-data-${currentUser}`, JSON.stringify(waterData))

    document.getElementById("water-count").textContent = waterData.count
    updateWaterProgress(waterData.count, waterData.goal)

    // Update water history
    const today = new Date().toISOString().split("T")[0]
    const waterHistory = JSON.parse(localStorage.getItem(`water-history-${currentUser}`)) || []

    // Find or create today's entry
    const todayEntry = waterHistory.find((entry) => entry.date.startsWith(today))
    if (todayEntry) {
      todayEntry.glasses = waterData.count
    } else {
      waterHistory.push({
        date: new Date().toISOString(),
        glasses: waterData.count,
      })
    }

    localStorage.setItem(`water-history-${currentUser}`, JSON.stringify(waterHistory))
  }

  function updateWaterProgress(count, goal) {
    const progress = (count / goal) * 100
    document.getElementById("water-progress-bar").style.width = `${progress}%`
  }

  function updateStepStats(steps) {
    // Calculate calories (0.04 cal per step)
    const calories = Math.round(steps * 0.04)
    // Calculate distance (0.000762 km per step)
    const distance = (steps * 0.000762).toFixed(2)

    document.getElementById("calories-burned").textContent = calories
    document.getElementById("distance").textContent = distance
  }

  function saveActivity(type, duration) {
    const activities = JSON.parse(localStorage.getItem(`activities-${currentUser}`)) || []

    activities.unshift({
      type,
      duration,
      date: new Date().toISOString(),
    })

    localStorage.setItem(`activities-${currentUser}`, JSON.stringify(activities))
  }

  function updateActivityList() {
    const activities = JSON.parse(localStorage.getItem(`activities-${currentUser}`)) || []
    const activityList = document.getElementById("activity-list")

    if (activityList) {
      if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-activities">No activities recorded yet</p>'
        return
      }

      let html = ""
      activities.forEach((activity) => {
        html += `
                    <div class="activity-item">
                        <div class="activity-info">
                            <span class="activity-type">${activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</span>
                        </div>
                        <div class="activity-details">
                            <span>${activity.duration} mins</span>
                            <span class="activity-date">${new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                    </div>
                `
      })

      activityList.innerHTML = html
    }
  }
})
