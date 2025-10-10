import axios from "axios";
import Cookies from "js-cookie";
import { USER_ROLES } from "../constants/user-roles";
import { responseExtractError } from "../utils/responseExtractError";

// Create an axios instance with the base URL from environment variables
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "Auth",
  headers: { "Content-Type": "application/json" },
});

// User login
export async function loginUser(credentials) {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Login failed"));
  }
}

// User registration
export async function registerUser(userData) {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Registration failed"));
  }
}

// Fetch current authenticated user
export async function getCurrentUser() {
  try {
    const token = Cookies.get("accessToken");
    if (!token) throw new Error("User not authenticated");

    const response = await api.get("/me", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const apiRole = response.data.roles?.[0] || "customer";
    let normalizedRole = USER_ROLES.CUSTOMER;

    switch (apiRole.toLowerCase()) {
      case "stationoperator":
        normalizedRole = USER_ROLES.STATION_OPERATOR;
        break;
      case "backoffice":
        normalizedRole = USER_ROLES.BACKOFFICE;
        break;
      default:
        normalizedRole = USER_ROLES.CUSTOMER;
    }

    return {
      name: response.data.name,
      email: response.data.email,
      role: normalizedRole,
    };
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to fetch user"));
  }
}
