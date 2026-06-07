import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

type DashboardData = {
  totalEmployees: number;
  totalProjects: number;
  activeProjects: number;
};

function Dashboard() {
  const [data, setData] = useState<DashboardData>({
    totalEmployees: 0,
    totalProjects: 0,
    activeProjects: 0,
  });

  useEffect(() => {
    const fetchDashboard = async () => {
      const response = await api.get("/dashboard");
      setData(response.data);
    };

    fetchDashboard();
  }, []);

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 mt-2">
            Welcome back. Here is your organization overview.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">👨‍💼</div>
            <p className="text-blue-100">Total Employees</p>
            <h2 className="text-5xl font-bold mt-3">{data.totalEmployees}</h2>
          </div>

          <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-purple-600 to-purple-800 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-purple-100">Total Projects</p>
            <h2 className="text-5xl font-bold mt-3">{data.totalProjects}</h2>
          </div>

          <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="text-4xl mb-4">🚀</div>
            <p className="text-emerald-100">Active Projects</p>
            <h2 className="text-5xl font-bold mt-3">{data.activeProjects}</h2>
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;