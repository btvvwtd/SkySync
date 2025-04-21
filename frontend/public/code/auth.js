let isLoginMode = true;

// DOM elements
const authForm = document.getElementById("auth-form");
const authTitle = document.getElementById("auth-title");
const authSubmit = document.getElementById("auth-submit");
const loginError = document.getElementById("login-error");
const switchAuthText = document.getElementById("switch-auth");
const emailField = document.getElementById("email");

const authContainer = document.getElementById("auth-container");
const uploadContainer = document.getElementById("upload-container");
const userNameDisplay = document.getElementById("user-name");
const logoutButton = document.getElementById("logout-button");

// Toggle between login/signup
function toggleAuthMode() {
  isLoginMode = !isLoginMode;

  // Update UI texts
  authTitle.textContent = isLoginMode ? "Login to SkySync" : "Sign Up to SkySync";
  authSubmit.textContent = isLoginMode ? "Login" : "Sign Up";
  switchAuthText.innerHTML = isLoginMode
    ? `Don't have an account? <a href="#" id="toggle-auth">Sign Up</a>`
    : `Already have an account? <a href="#" id="toggle-auth">Login</a>`;

  // Manage email field
  emailField.style.display = isLoginMode ? "none" : "block";
  emailField.required = !isLoginMode;

  // Reset errors and form
  loginError.style.display = "none";
  authForm.reset();
}

// Event delegation for toggle link
document.addEventListener("click", (e) => {
  if (e.target?.id === "toggle-auth") {
    e.preventDefault();
    toggleAuthMode();
  }
});

// Show error message
function showError(message) {
  loginError.textContent = message;
  loginError.style.display = "block";
}

// Form submission handler
authForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const email = isLoginMode ? undefined : document.getElementById("email").value.trim();

  // Validation
  if (!username || !password) {
    showError("Please fill in all required fields");
    return;
  }

  if (!isLoginMode) {
    if (!email) {
      showError("Please enter your email");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      showError("Password must be at least 6 characters");
      return;
    }
  }

  const endpoint = isLoginMode ? "/auth/login" : "/auth/register";
  const body = JSON.stringify({ username, password, ...(!isLoginMode && { email }) });

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.detail || data.message || "Authentication failed");
    }

    // Save token and user data
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", username);

    showFileSection();
  } catch (error) {
    console.error("Auth error:", error);
    showError(error.message || "Invalid credentials. Please try again.");
  }
});

// Show file section after auth
function showFileSection() {
  authContainer.style.display = "none";
  uploadContainer.style.display = "block";
  userNameDisplay.textContent = localStorage.getItem("username");
}

// Logout handler
logoutButton.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  authContainer.style.display = "block";
  uploadContainer.style.display = "none";
  isLoginMode = true;
  toggleAuthMode();
});

// Check auth status on load
document.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("token")) {
    showFileSection();
  }
  toggleAuthMode(); // Initialize form state
});