// ─────────────────────────────────────────────────────────────
// Central API config — frontend
// Production mein sirf .env ka VITE_API_BASE_URL change karo
// ─────────────────────────────────────────────────────────────

// All backend API calls (auth, navbar, courses, leads, banners)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";
