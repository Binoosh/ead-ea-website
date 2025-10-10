import axios from "axios";
import Cookies from "js-cookie";
import { responseExtractError } from "../utils/responseExtractError";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "ChargeStations",
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

// Get all charge stations
export async function fetchChargeStations() {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to fetch charge stations")
    );
  }
}

// Get charge stations for the current user
export async function fetchMyChargeStations(userId) {
  try {
    const response = await api.get(`/my-stations/${userId}`);
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to fetch your charge stations")
    );
  }
}

// Get charge station by ID
export async function fetchChargeStationById(id) {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to fetch charge station")
    );
  }
}

// Create a new charge station
export async function createChargeStation(payload) {
  try {
    const response = await api.post("/", payload);
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to create charge station")
    );
  }
}

// Update charge station
export async function updateChargeStation(id, payload) {
  try {
    const response = await api.put(`/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to update charge station")
    );
  }
}

// Delete charge station
export async function deleteChargeStation(id) {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to delete charge station")
    );
  }
}

// Update charge station status
export async function updateChargeStationStatus(id, isAvailable) {
  try {
    const response = await api.patch(
      `/${id}/availability?isAvailable=${isAvailable}`
    );
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to update charge station status")
    );
  }
}
