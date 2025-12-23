import { getUser, clearAuth } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = getUser();
  const navigate = useNavigate();

  const logout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-2">Welcome: {user?.name} ({user?.role})</p>

      <button onClick={logout} className="mt-4 border px-4 py-2 rounded">
        Logout
      </button>
    </div>
  );
}
