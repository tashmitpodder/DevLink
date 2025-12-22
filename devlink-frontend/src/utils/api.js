// utils/api.js

//need to understand this file properly..

//i still didn't understand what this file does, but in simple terms what it does is basically create a reusable function which you can call from anyfile, and this function is used for making GET, POST, etc requests and if it is a protected routed it also manages the token authentication and errors and other still. It is basically a reusable function so that you don't have to fetch() or axios() numerous times in every jsx file.. you can just use this api file.. which makes calling the api and making requests to the routes much easier..

// 🔧 Base URL from Vite env (set this in frontend/.env)
// Example: VITE_API_URL=http://localhost:5000/api
// Always point to backend root only
const API_URL = import.meta.env.VITE_API_URL;

// Add /api prefix here
function makeUrl(endpoint) {
  const ep = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  return `${API_URL}/api${ep}`;
}

/**
 * Universal API request helper
 * @param {string} endpoint - API route (e.g., "/auth/login" or "/posts")
 * @param {string} method - HTTP method (default: GET)
 * @param {object} body - request body (for POST/PUT)
 * @param {string} token - optional JWT token (for protected routes)
 */

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  try {
    const headers = { "Content-Type": "application/json" };

    // attach token if available (for protected APIs)
    if (token) headers.Authorization = `Bearer ${token}`;

    // make the request
    const response = await fetch(makeUrl(endpoint), {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    // parse response safely
    const text = await response.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text || "Invalid JSON response" };
    }

    // handle errors
    if (!response.ok) {
      console.error(`❌ API Error [${response.status}]:`, data.message);
      throw new Error(data.message || "Request failed");
    }

    return data;
  } catch (err) {
    console.error("🚨 API request error:", err.message);
    return { message: "Something went wrong ❌" };
  }
}
