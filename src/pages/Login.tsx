import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

/**
 * Login page for accessing the dashboard. Requires the user to enter
 * username and password (both "tester") before proceeding to the
 * dashboard. If already authenticated, redirect to the dashboard.
 */
const Login = () => {
  const { authenticated, loading, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Redirect authenticated users to the dashboard
  useEffect(() => {
    if (!loading && authenticated) {
      navigate("/dashboard");
    }
  }, [authenticated, loading, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username.trim(), password.trim());
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Invalid username or password");
    }
  };

  // Show nothing while checking authentication to prevent bouncing
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-card p-8 rounded-lg shadow-md w-full max-w-sm space-y-6 border border-border"
      >
        <h1 className="text-2xl font-bold text-center">Dashboard Login</h1>
        {error && <p className="text-red-600 text-sm text-center">{error}</p>}
        <div className="space-y-4">
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoComplete="username"
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
          />
        </div>
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
          Sign In
        </Button>
      </form>
    </div>
  );
};

export default Login;