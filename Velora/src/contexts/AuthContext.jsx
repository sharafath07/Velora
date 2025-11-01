import { useState, useEffect, createContext, useContext } from "react";
// import { account } from "../lib/appwriteConfig"; // make sure this is configured correctly
// import { ID } from "appwrite";
import LoadingSpinner from "../components/LoadingSpinner";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // On mount, check if the user is already logged in
  useEffect(() => {
    checkUserStatus();
  }, []);

  // LOGIN FUNCTION
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      // v21 syntax for email/password login
      await account.createEmailPasswordSession(email, password);

      // Get current user details
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error("Login error:", error);
      setUser(null);
    }
    setLoading(false);
  };

  // LOGOUT FUNCTION
  const logoutUser = async () => {
    setLoading(true);
    try {
      await account.deleteSession({ sessionId: "current" });
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
    setLoading(false);
  };

  // REGISTER FUNCTION
  const registerUser = async ({ name, email, password1 }) => {
    setLoading(true);
    try {
      // Create new user
      await account.create({
        userId: ID.unique(),
        email,
        password: password1,
        name,
      });

      // Automatically log in after registration
      await account.createEmailSession(email, password1);

      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      console.error("Registration error:", error);
      setUser(null);
    }
    setLoading(false);
  };

  // CHECK CURRENT USER SESSION
  const checkUserStatus = async () => {
    setLoading(true);
    try {
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch (error) {
      // No active session, user not logged in
      setUser(null);
    }
    setLoading(false);
  };

  const contextData = {
    user,
    loginUser,
    logoutUser,
    registerUser,
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
