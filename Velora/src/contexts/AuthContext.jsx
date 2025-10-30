import { useState, useEffect, createContext, useContext } from "react";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner";

const API_BASE_URL = "https://velora-dm0l.onrender.com/api";
const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // ✅ Automatically check auth state on mount
  useEffect(() => {
    checkUserStatus();
  }, []);

  // ✅ LOGIN
  const loginUser = async (email, password) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user } = data;
      localStorage.setItem("authToken", token);
      setUser(user);
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Login failed. Please try again.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ REGISTER
  const registerUser = async ({ name, email, password }) => {
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${API_BASE_URL}/auth/register`, {
        name,
        email,
        password,
      });

      const { token, user } = data;
      localStorage.setItem("authToken", token);
      setUser(user);
    } catch (error) {
      console.error("Registration error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Registration failed.");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ LOGOUT
  const logoutUser = () => {
    localStorage.removeItem("authToken");
    setUser(null);
  };

  // ✅ CHECK USER STATUS (auth persistence)
  const checkUserStatus = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.get(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(data.user);
    } catch (error) {
      console.error("Session check failed:", error.response?.data || error.message);
      localStorage.removeItem("authToken");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Context data shared across app
  const contextData = {
    user,
    isLoading,
    loginUser,
    logoutUser,
    registerUser,
    checkUserStatus,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

// ✅ Custom hook for consuming auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};

export default AuthContext;
