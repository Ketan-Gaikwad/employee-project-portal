import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      setError(
        "Login failed. If this is the first request, please wait a few seconds and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleLogin}
        className="bg-white w-full max-w-md p-8 rounded-xl shadow"
      >
        <h1 className="text-2xl font-bold text-center mb-6">
          Employee Project Portal
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">
            {error}
          </p>
        )}

        <label className="block mb-2 font-medium">Email</label>
        <input
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          className="w-full border p-3 rounded mb-6"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold cursor-pointer disabled:opacity-60"
        >
          {loading ? "Logging in... please wait" : "Login"}
        </button>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Note: The backend is hosted on Render free tier, so the first request
          may take a few seconds to wake up.
        </p>
      </form>
    </div>
  );
}

export default Login;