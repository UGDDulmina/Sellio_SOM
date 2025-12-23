import { useState } from "react";
import api from "../api/axios";
import { setAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { username, password });
      setAuth(res.data);
      navigate("/dashboard");
    } catch (e2) {
      setErr(e2?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form onSubmit={onSubmit} className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold">Sellio Login</h1>
        <p className="text-gray-600 text-sm mb-6">Sign in to continue</p>

        {err && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{err}</div>}

        <label className="text-sm font-medium">Username</label>
        <input
          className="border w-full p-2 rounded mb-4"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin@sellio.com"
        />

        <label className="text-sm font-medium">Password</label>
        <input
          className="border w-full p-2 rounded mb-4"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="******"
        />

        <button
          disabled={loading}
          className="w-full bg-black text-white p-2 rounded"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
