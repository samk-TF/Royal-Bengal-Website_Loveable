import { useState, useEffect } from "react";

/**
 * Simple authentication hook used by the dashboard. It persists
 * authentication state in localStorage. The default credentials are
 * username: "tester" and password: "tester".
 */
export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);

  // Load authentication state from localStorage on mount.
  useEffect(() => {
    const stored = localStorage.getItem("auth");
    setAuthenticated(stored === "true");
  }, []);

  /**
   * Attempt to log in with the provided username and password. Returns
   * true if successful. On success it writes to localStorage and
   * updates the internal state.
   */
  const login = (username: string, password: string): boolean => {
    if (username === "tester" && password === "tester") {
      setAuthenticated(true);
      localStorage.setItem("auth", "true");
      return true;
    }
    return false;
  };

  /**
   * Logs out the current user by clearing state and localStorage.
   */
  const logout = () => {
    setAuthenticated(false);
    localStorage.removeItem("auth");
  };

  return { authenticated, login, logout };
}