import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";
import toast from "react-hot-toast";

type Employee = {
  id: number;
  fullName: string;
};

type Project = {
  id: number;
  projectName: string;
  description: string;
  status: string;
};

type Assignment = {
  id: number;
  employeeId: number;
  projectId: number;
  project: Project;
};

type ApiError = {
  response?: {
    data?: {
      message?: string;
    };
  };
};

function Assignments() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [employeeId, setEmployeeId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const employeesResponse = await api.get("/employees");
      const projectsResponse = await api.get("/projects");

      setEmployees(employeesResponse.data);
      setProjects(projectsResponse.data);
    };

    fetchData();
  }, []);

  const fetchAssignments = async (id: string) => {
    if (!id) {
      setAssignments([]);
      return;
    }

    const response = await api.get(`/employees/${id}/projects`);
    setAssignments(response.data);
  };

  const handleAssign = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!employeeId || !projectId) {
      toast.error("Please select employee and project");
      return;
    }

    try {
      await api.post("/assign", {
        employeeId: Number(employeeId),
        projectId: Number(projectId),
      });

      toast.success("Employee assigned to project successfully");

      await fetchAssignments(employeeId);
      setSelectedEmployeeId(employeeId);

      setEmployeeId("");
      setProjectId("");
    } catch (error: unknown) {
      const err = error as ApiError;

      toast.error(
        err.response?.data?.message ||
          "This employee is already assigned to this project"
      );
    }
  };

  const removeAssignment = async (assignmentId: number) => {
    if (!confirm("Are you sure you want to remove this assignment?")) return;

    await api.delete(`/assign/${assignmentId}`);

    toast.success("Assignment removed successfully");

    if (selectedEmployeeId) {
      await fetchAssignments(selectedEmployeeId);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-6">
        <h1 className="text-3xl font-bold text-slate-800">
          Employee Project Assignments
        </h1>
        <p className="text-slate-500 mb-6">
          Assign employees to projects and view assigned project lists
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form
            onSubmit={handleAssign}
            className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300"
          >
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              Assign Employee
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block mb-2 font-medium">Employee</label>
                <select
                  className="w-full border p-3 rounded cursor-pointer"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.fullName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Project</label>
                <select
                  className="w-full border p-3 rounded cursor-pointer"
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                >
                  <option value="">Select Project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.projectName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer transition-all duration-200 hover:scale-105">
              Assign Employee
            </button>
          </form>

          <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition-all duration-300">
            <h2 className="text-xl font-bold text-slate-800 mb-4">
              View Assigned Projects
            </h2>

            <label className="block mb-2 font-medium">Select Employee</label>
            <select
              className="w-full border p-3 rounded mb-6 cursor-pointer"
              value={selectedEmployeeId}
              onChange={(e) => {
                setSelectedEmployeeId(e.target.value);
                fetchAssignments(e.target.value);
              }}
            >
              <option value="">Select Employee</option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.fullName}
                </option>
              ))}
            </select>

            <div className="space-y-3">
              {assignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="border rounded-lg p-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-all duration-200"
                >
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {assignment.project.projectName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {assignment.project.description}
                    </p>
                    <span className="inline-block mt-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {assignment.project.status}
                    </span>
                  </div>

                  <button
                    onClick={() => removeAssignment(assignment.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 cursor-pointer transition-all duration-200 hover:scale-105"
                  >
                    Remove
                  </button>
                </div>
              ))}

              {selectedEmployeeId && assignments.length === 0 && (
                <p className="text-slate-500">
                  No projects assigned to this employee.
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default Assignments;