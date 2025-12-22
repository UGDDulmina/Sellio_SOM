import { useQuery } from "@tanstack/react-query";
import api from "./api/axios";

export default function App() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["health"],
    queryFn: async () => {
      const res = await api.get("/health");
      return res.data;
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white shadow rounded-xl p-6 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Sellio — Phase 0</h1>
        <p className="text-gray-600 mb-4">Frontend ↔ Backend Health Check</p>

        {isLoading && <p>Loading...</p>}
        {isError && (
          <p className="text-red-600">
            Error: {error?.message || "Something went wrong"}
          </p>
        )}

        {data && (
          <div className="text-sm bg-gray-100 p-4 rounded-lg">
            <pre className="whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
