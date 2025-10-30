import { createContext, useState, useEffect, useContext } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  // Fetch user data if token exists
  useEffect(() => {
    if (token) {
      checkUserStatus();
    } else {
      setLoading(false);
    }
  }, [token]);

  /** ✅ LOGIN USER **/
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error("Login error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ REGISTER USER **/
  const registerUser = async ({ name, email, password1 }) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password: password1 }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      // Save token and user immediately after signup
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setUser(data.user);
    } catch (err) {
      console.error("Register error:", err.message);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ LOGOUT USER **/
  const logoutUser = async () => {
    setLoading(true);
    try {
      // Optional: You can also call your backend logout endpoint if implemented
      localStorage.removeItem("token");
      setUser(null);
      setToken(null);
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setLoading(false);
    }
  };

  /** ✅ CHECK USER STATUS **/
  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Not authenticated");
      const data = await res.json();
      setUser(data.user);
    } catch {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  };

  const contextData = {
    user,
    token,
    loginUser,
    registerUser,
    logoutUser,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <LoadingSpinner /> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
