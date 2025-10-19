import axios from "axios";

export type LoginData = { email: string; password: string };
export type RegisterData = {
  email: string;
  password: string;
  confirmPassword: string;
};

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export const login = async (data: LoginData) => {
  const res = await axios.post(`${API_BASE}/auth/login`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};

export const register = async (data: RegisterData) => {
  const res = await axios.post(`${API_BASE}/auth/register`, data, {
    headers: { "Content-Type": "application/json" },
  });
  return res.data;
};
