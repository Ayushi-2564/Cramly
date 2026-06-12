import { create } from "zustand";
import {
  registerUser,
  loginUser,
  getLoggedInUser,
  logoutUser,
} from "../services/authService";

const savedUser = localStorage.getItem("cramlyUser");
const savedToken = localStorage.getItem("cramlyToken");

const useAuthStore = create((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: Boolean(savedToken),
  loading: false,
  error: null,

  register: async (userData) => {
    try {
      set({ loading: true, error: null });

      const data = await registerUser(userData);

      localStorage.setItem("cramlyToken", data.token);
      localStorage.setItem("cramlyUser", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Registration failed. Try again.";

      set({
        error: message,
        loading: false,
      });

      throw new Error(message);
    }
  },

  login: async (userData) => {
    try {
      set({ loading: true, error: null });

      const data = await loginUser(userData);

      localStorage.setItem("cramlyToken", data.token);
      localStorage.setItem("cramlyUser", JSON.stringify(data.user));

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        loading: false,
      });

      return data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Login failed. Try again.";

      set({
        error: message,
        loading: false,
      });

      throw new Error(message);
    }
  },

  fetchMe: async () => {
    try {
      const data = await getLoggedInUser();

      localStorage.setItem("cramlyUser", JSON.stringify(data.user));

      set({
        user: data.user,
        isAuthenticated: true,
      });

      return data;
    } catch (error) {
      localStorage.removeItem("cramlyToken");
      localStorage.removeItem("cramlyUser");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.log("Logout error:", error.message);
    } finally {
      localStorage.removeItem("cramlyToken");
      localStorage.removeItem("cramlyUser");

      set({
        user: null,
        token: null,
        isAuthenticated: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;