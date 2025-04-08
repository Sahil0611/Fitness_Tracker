document.addEventListener("DOMContentLoaded", () => {
  // Check if user is already logged in
  const currentUser = localStorage.getItem("fitness-user")
  if (currentUser) {
    // Check if BMI data exists
    const bmiData = localStorage.getItem(`bmi-data-${currentUser}`)
    if (bmiData) {
      window.location.href = "dashboard.html"
    } else {
      window.location.href = "bmi.html"
    }
  }

  // Toggle password visibility
  const togglePassword = document.getElementById("toggle-password")
  if (togglePassword) {
    togglePassword.addEventListener("click", () => {
      const passwordInput = document.getElementById("password")
      if (passwordInput.type === "password") {
        passwordInput.type = "text"
        togglePassword.classList.remove("fa-eye")
        togglePassword.classList.add("fa-eye-slash")
      } else {
        passwordInput.type = "password"
        togglePassword.classList.remove("fa-eye-slash")
        togglePassword.classList.add("fa-eye")
      }
    })
  }

  // Handle login form submission
  const loginForm = document.getElementById("login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      if (!username) return

      // Show loading spinner
      const loginText = document.getElementById("login-text")
      const loginSpinner = document.getElementById("login-spinner")

      loginText.style.display = "none"
      loginSpinner.style.display = "block"

      // Simulate login delay
      setTimeout(() => {
        // Store user in localStorage
        localStorage.setItem("fitness-user", username)

        // Redirect to BMI page
        window.location.href = "bmi.html"
      }, 1000)
    })
  }
})
