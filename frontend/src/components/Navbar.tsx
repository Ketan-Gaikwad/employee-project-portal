import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/employees", label: "Employees" },
    { path: "/projects", label: "Projects" },
    { path: "/assignments", label: "Assignments" },
  ];

  return (
    <nav className="bg-slate-950 text-white shadow">
      <div className="px-5 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold">Employee Portal</h1>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-2xl"
        >
          ☰
        </button>

        <div className="hidden md:flex items-center gap-5">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`hover:text-blue-300 ${
                location.pathname === link.path
                  ? "text-blue-300 font-semibold"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden px-5 pb-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`py-2 border-b border-slate-800 ${
                location.pathname === link.path
                  ? "text-blue-300 font-semibold"
                  : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 text-left"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;