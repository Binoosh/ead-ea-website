import axios from "axios";
import Cookies from "js-cookie";
import { responseExtractError } from "../utils/responseExtractError";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "Reservations",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create a new reservation
export async function createReservation(payload) {
  try {
    const response = await api.post("/", payload);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to create reservation"));
  }
}

// Get all reservations
export async function fetchReservations() {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to fetch reservations"));
  }
}

// Get all reservations with details
export async function fetchReservationsWithDetails() {
  try {
    const response = await api.get("/with-details");
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to fetch reservations"));
  }
}

// Get reservation by ID
export async function fetchReservationById(id) {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to fetch reservation"));
  }
}

// Update reservation
export async function updateReservation(id, payload) {
  try {
    const response = await api.put(`/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to update reservation"));
  }
}

// Delete reservation
export async function deleteReservation(id) {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to delete reservation"));
  }
}
