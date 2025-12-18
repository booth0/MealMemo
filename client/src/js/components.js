// /src/js/components.js
// Component loader for header and footer

import { isAuthenticated, getUser, logout } from "./auth.js";

// ========== Load Header ==========

export function loadHeader() {
  const headerElement = document.getElementById("header");
  if (!headerElement) return;

  const user = getUser();
  const isAuth = isAuthenticated();

  const headerHTML = `
    <header class="site-header">
      <nav class="navbar">
        <div class="nav-container">
          <a href="/" class="logo">
            <span class="logo-icon">🍳</span>
            <span class="logo-text">MealMemo</span>
          </a>
          
          <ul class="nav-menu">
            <li><a href="/">Home</a></li>
            <li><a href="/featured/index.html">Featured Recipes</a></li>
            
            ${
              isAuth
                ? `
              <li><a href="/recipes/index.html">My Recipes</a></li>
              
              ${
                user && (user.role === "contributor" || user.role === "admin")
                  ? `
                <li><a href="/contributor/index.html">Review Submissions</a></li>
              `
                  : ""
              }
              
              ${
                user && user.role === "admin"
                  ? `
                <li><a href="/admin/index.html">Admin</a></li>
              `
                  : ""
              }
              
              <li class="user-menu">
                <span class="user-greeting">Hello, ${user?.firstName || "User"}!</span>
                <button id="logout-btn" class="btn-link">Logout</button>
              </li>
            `
                : `
              <li><a href="/login/index.html">Login</a></li>
              <li><a href="/register/index.html" class="btn btn-primary">Sign Up</a></li>
            `
            }
          </ul>
        </div>
      </nav>
    </header>
  `;

  headerElement.innerHTML = headerHTML;

  // Add logout event listener
  if (isAuth) {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        if (confirm("Are you sure you want to logout?")) {
          logout();
        }
      });
    }
  }
}

// ========== Load Footer ==========

export function loadFooter() {
  const footerElement = document.getElementById("footer");
  if (!footerElement) return;

  const isAuth = isAuthenticated();
  const currentYear = new Date().getFullYear();

  const footerHTML = `
    <footer class="site-footer">
      <div class="footer-container">
        <div class="footer-section">
          <h3>MealMemo</h3>
          <p>Your personal recipe manager</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/featured/index.html">Featured Recipes</a></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Account</h4>
          <ul>
            ${
              isAuth
                ? `
              <li><a href="/recipes/index.html">My Recipes</a></li>
            `
                : `
              <li><a href="/login/index.html">Login</a></li>
              <li><a href="/register/index.html">Sign Up</a></li>
            `
            }
          </ul>
        </div>
        
        <div class="footer-bottom">
          <p>&copy; ${currentYear} MealMemo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  `;

  footerElement.innerHTML = footerHTML;
}
