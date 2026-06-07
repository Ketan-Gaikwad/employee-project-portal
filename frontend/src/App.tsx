import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import Projects from "./pages/Projects";
import Assignments from "./pages/Assignments";

function App() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={token ? <Dashboard /> : <Navigate to="/login" />}
      />

      <Route
        path="/employees"
        element={token ? <Employees /> : <Navigate to="/login" />}
      />

      <Route
        path="/projects"
        element={token ? <Projects /> : <Navigate to="/login" />}
      />

      <Route
        path="/assignments"
        element={token ? <Assignments /> : <Navigate to="/login" />}
      />

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}

export default App;