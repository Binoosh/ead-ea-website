import axios from "axios";
import Cookies from "js-cookie";
import { responseExtractError } from "../utils/responseExtractError";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + "EvOwners",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add Authorization header with token automatically
api.interceptors.request.use((config) => {
  const token = Cookies.get("accessToken"); // use your accessToken cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Service function for EV Owner login
export async function loginEvOwner(credentials) {
  try {
    const response = await api.post("/login", credentials);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "EV Owner login failed"));
  }
}

// Get all EV owners
export async function fetchEVOwners() {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to fetch EV owners"));
  }
}

// Get EV owner by ID
export async function fetchEVOwnerById(id) {
  try {
    const response = await api.get(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to fetch EV owner"));
  }
}

// Create a new EV owner
export async function createEVOwner(payload) {
  try {
    const response = await api.post("/", payload);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to create EV owner"));
  }
}

// Update EV owner
export async function updateEVOwner(id, payload) {
  try {
    const response = await api.put(`/${id}`, payload);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to update EV owner"));
  }
}

// Update EV owner status
export async function updateEVOwnerStatus(id, isActive) {
  try {
    const response = await api.patch(`/${id}/status?isActive=${isActive}`);
    return response.data;
  } catch (err) {
    throw new Error(
      responseExtractError(err, "Failed to update EV owner status")
    );
  }
}

// Delete EV owner
export async function deleteEVOwner(id) {
  try {
    const response = await api.delete(`/${id}`);
    return response.data;
  } catch (err) {
    throw new Error(responseExtractError(err, "Failed to delete EV owner"));
  }
}
