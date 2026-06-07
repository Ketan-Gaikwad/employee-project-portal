import { useState } from "react";
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password");
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
          <p className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</p>
        )}

        <label className="block mb-2 font-medium">Email</label>
        <input
          className="w-full border p-3 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="block mb-2 font-medium">Password</label>
        <input
          className="w-full border p-3 rounded mb-6"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 text-white p-3 rounded font-semibold">
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;