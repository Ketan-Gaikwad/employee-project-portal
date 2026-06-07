import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(
    () => sessionStorage.getItem("loginEmail") || ""
  );
  const [password, setPassword] = useState(
    () => sessionStorage.getItem("loginPassword") || ""
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    sessionStorage.setItem("loginEmail", email);
  }, [email]);

  useEffect(() => {
    sessionStorage.setItem("loginPassword", password);
  }, [password]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        },
        {
          timeout: 90000,
        }
      );

      localStorage.setItem("token", response.data.token);

      sessionStorage.removeItem("loginEmail");
      sessionStorage.removeItem("loginPassword");

      navigate("/dashboard");
    } catch {
      setError(
        "Login failed. If the backend is waking up, please wait 30 seconds and click Login again."
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
          className="w-full bg-blue-600 text-white p-3 rounded font-semibold cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Logging in... please wait" : "Login"}
        </button>

        <p className="text-xs text-slate-500 mt-4 text-center">
          Backend is hosted on Render free tier. First request after inactivity
          may take up to 60 seconds.
        </p>
      </form>
    </div>
  );
}

export default Login;