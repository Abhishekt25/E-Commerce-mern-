// src/hooks/useAuth.tsx
import { useState, useEffect, createContext, useContext, useCallback } from "react";
import type { ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, isAdmin?: boolean) => Promise<void>;
  logout: () => void;
  loading: boolean;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  loading: true,
  checkAuth: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🌐 Backend base URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:2507/api";

  console.log('🔧 AuthProvider - API_BASE:', API_BASE);

  // 🔍 Verify JWT and fetch user
  const checkAuth = useCallback(async () => {
    try {
      console.log('🔄 checkAuth started');
      const token = localStorage.getItem("token");
      console.log('🔑 Token from localStorage:', token);

      if (!token) {
        console.log('❌ No token found');
        setUser(null);
        setLoading(false);
        return;
      }

      console.log('📡 Making request to:', `${API_BASE}/auth/me`);
      
      const response = await fetch(`${API_BASE}/auth/me`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log('📊 Response status:', response.status);
      console.log('📊 Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ User data received:', data);
        setUser(data.user);
      } else {
        console.log('❌ Response not OK, removing token');
        localStorage.removeItem("token");
        setUser(null);
      }
    } catch (error) {
      console.error("❌ checkAuth error:", error);
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      console.log('🏁 checkAuth completed, setting loading to false');
      setLoading(false);
    }
  }, [API_BASE]);

  useEffect(() => {
    console.log('🎯 AuthProvider mounted, calling checkAuth');
    checkAuth();
  }, [checkAuth]);

  // 🔑 Login function (User or Admin)
 // 🔑 Login function (User or Admin)
const login = async (email: string, password: string, isAdmin = false) => {
  try {
    const endpoint = isAdmin
      ? `${API_BASE}/admin/login`
      : `${API_BASE}/login`;

    console.log('🌍 Sending login request to:', endpoint);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("🧠 Backend login response:", data);

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    // ✅ Save token and user
    localStorage.setItem("token", data.token);
    setUser(data.user);

    // Optional: immediately checkAuth to validate the token
    await checkAuth();
  } catch (error: any) {
    console.error("❌ Login error:", error);
    throw new Error(error.message || "Unable to login");
  }
};



  // 🚪 Logout
  const logout = () => {
    console.log('🚪 Logging out');
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};