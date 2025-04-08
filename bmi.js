document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  const currentUser = localStorage.getItem("fitness-user")
  if (!currentUser) {
    window.location.href = "login.html"
    return
  }

  const bmiForm = document.getElementById("bmi-form")
  const resultSection = document.getElementById("bmi-result")
  const proceedBtn = document.getElementById("proceed-btn")

  // Initially hide results
  if (resultSection) {
    resultSection.classList.add("hidden")
  }

  if (proceedBtn) {
    proceedBtn.style.opacity = "0"
  }

  // Handle BMI form submission
  if (bmiForm) {
    bmiForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const height = Number.parseFloat(document.getElementById("height").value)
      const weight = Number.parseFloat(document.getElementById("weight").value)
      const age = Number.parseInt(document.getElementById("age").value)
      const gender = document.getElementById("gender-male").checked ? "male" : "female"

      if (height && weight && age) {
        // Calculate BMI
        const bmi = (weight / (height / 100) ** 2).toFixed(1)

        // Display BMI result
        document.getElementById("bmi-value").textContent = bmi

        // Set BMI category
        const category = getBMICategory(bmi)
        document.getElementById("bmi-category").textContent = `Category: ${category}`

        // Position indicator on scale
        positionBMIIndicator(bmi)

        // Store data with user-specific key
        localStorage.setItem(
          `bmi-data-${currentUser}`,
          JSON.stringify({
            height,
            weight,
            age,
            gender,
            bmi,
            category,
            date: new Date().toISOString(),
          }),
        )

        // Show results with animation
        resultSection.classList.remove("hidden")

        // Show proceed button with animation
        setTimeout(() => {
          proceedBtn.style.opacity = "1"
        }, 500)
      }
    })
  }

  // Handle proceed button click
  if (proceedBtn) {
    proceedBtn.addEventListener("click", () => {
      window.location.href = "dashboard.html"
    })
  }

  // Helper functions
  function getBMICategory(bmi) {
    bmi = Number.parseFloat(bmi)
    if (bmi < 18.5) return "Underweight"
    if (bmi < 25) return "Normal"
    if (bmi < 30) return "Overweight"
    return "Obese"
  }

  function positionBMIIndicator(bmi) {
    const indicator = document.getElementById("bmi-indicator")
    if (!indicator) return

    // Position indicator on 0-40 scale (BMI range)
    const position = Math.min(Math.max((bmi / 40) * 100, 2.5), 97.5)
    indicator.style.left = `${position}%`
  }
})
