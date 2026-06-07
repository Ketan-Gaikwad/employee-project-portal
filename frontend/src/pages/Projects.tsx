import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import api from "../services/api";

type Project = {
  id: number;
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
};

type Employee = {
  id: number;
  fullName: string;
  email: string;
  designation: string;
  profileImage?: string;
};

type ProjectEmployee = {
  id: number;
  employee: Employee;
};

type ProjectForm = {
  projectName: string;
  description: string;
  startDate: string;
  endDate: string;
  status: string;
};

const initialForm: ProjectForm = {
  projectName: "",
  description: "",
  startDate: "",
  endDate: "",
  status: "Active",
};

function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [employeesModal, setEmployeesModal] = useState(false);
  const [projectEmployees, setProjectEmployees] = useState<ProjectEmployee[]>(
    []
  );
  const [selectedProjectName, setSelectedProjectName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProjectForm>(initialForm);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await api.get("/projects");
      setProjects(response.data);
    };

    fetchProjects();
  }, []);

  const refreshProjects = async () => {
    const response = await api.get("/projects");
    setProjects(response.data);
  };

  const filteredProjects = projects.filter((project) =>
    `${project.projectName} ${project.description} ${project.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingId(project.id);
    setForm({
      projectName: project.projectName,
      description: project.description,
      startDate: project.startDate.split("T")[0],
      endDate: project.endDate.split("T")[0],
      status: project.status,
    });
    setIsModalOpen(true);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/projects/${editingId}`, form);
    } else {
      await api.post("/projects", form);
    }

    setForm(initialForm);
    setEditingId(null);
    setIsModalOpen(false);
    refreshProjects();
  };

  const deleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return;

    await api.delete(`/projects/${id}`);
    refreshProjects();
  };

  const viewEmployees = async (projectId: number, projectName: string) => {
    const response = await api.get(`/projects/${projectId}/employees`);

    setProjectEmployees(response.data);
    setSelectedProjectName(projectName);
    setEmployeesModal(true);
  };

  const getStatusClass = (status: string) => {
    if (status === "Active") return "bg-green-100 text-green-700";
    if (status === "Completed") return "bg-blue-100 text-blue-700";
    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Projects</h1>
            <p className="text-slate-500">Manage organization projects</p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer transition-all duration-200 hover:scale-105"
          >
            + Add Project
          </button>
        </div>

        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search projects by name, description, status..."
            className="w-full md:w-96 border border-slate-300 p-3 rounded-xl shadow-sm bg-white"
          />

          <p className="text-sm text-slate-500">
            Showing {filteredProjects.length} of {projects.length} projects
          </p>
        </div>

        {/* Mobile Cards */}
        <div className="grid gap-4 md:hidden">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow p-5 border border-slate-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">
                    {project.projectName}
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    {project.description}
                  </p>
                </div>

                <span
                  className={`${getStatusClass(
                    project.status
                  )} px-3 py-1 rounded-full text-xs whitespace-nowrap`}
                >
                  {project.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 mt-4">
                <div>
                  <p className="font-semibold text-slate-800">Start Date</p>
                  <p>{new Date(project.startDate).toLocaleDateString()}</p>
                </div>

                <div>
                  <p className="font-semibold text-slate-800">End Date</p>
                  <p>{new Date(project.endDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 mt-5">
                <button
                  onClick={() =>
                    viewEmployees(project.id, project.projectName)
                  }
                  className="bg-indigo-600 text-white px-3 py-2 rounded cursor-pointer"
                >
                  View Employees
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditModal(project)}
                    className="bg-yellow-500 text-white px-3 py-2 rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="bg-red-600 text-white px-3 py-2 rounded cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-6 text-center text-slate-500">
              No projects found.
            </div>
          )}
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block bg-white rounded-2xl shadow overflow-x-auto hover:shadow-lg transition-all duration-300">
          <table className="w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4">Project Name</th>
                <th className="p-4">Description</th>
                <th className="p-4">Start Date</th>
                <th className="p-4">End Date</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProjects.map((project) => (
                <tr key={project.id} className="border-b hover:bg-slate-50">
                  <td className="p-4 font-medium">{project.projectName}</td>
                  <td className="p-4">{project.description}</td>
                  <td className="p-4">
                    {new Date(project.startDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {new Date(project.endDate).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <span
                      className={`${getStatusClass(
                        project.status
                      )} px-3 py-1 rounded-full text-sm`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="p-4 flex flex-wrap gap-2">
                    <button
                      onClick={() =>
                        viewEmployees(project.id, project.projectName)
                      }
                      className="bg-indigo-600 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Employees
                    </button>
                    <button
                      onClick={() => openEditModal(project)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredProjects.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan={6}>
                    No projects found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Project" : "Add Project"}
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={saveProject}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="Project Name"
                className="border p-3 rounded"
                required
              />

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="border p-3 rounded cursor-pointer"
                required
              >
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="On Hold">On Hold</option>
              </select>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-3 rounded md:col-span-2"
                required
              />

              <input
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                type="date"
                className="border p-3 rounded cursor-pointer"
                required
              />

              <input
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                type="date"
                className="border p-3 rounded cursor-pointer"
                required
              />

              <div className="md:col-span-2 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded border cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 cursor-pointer"
                >
                  {editingId ? "Update Project" : "Save Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {employeesModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">
                  Assigned Employees
                </h2>
                <p className="text-slate-500 mt-1">
                  Project: {selectedProjectName}
                </p>
              </div>

              <button
                onClick={() => setEmployeesModal(false)}
                className="text-slate-500 hover:text-slate-800 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-auto">
              {projectEmployees.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-xl p-4 flex items-center gap-4"
                >
                  {item.employee.profileImage ? (
                    <img
                      src={item.employee.profileImage}
                      alt={item.employee.fullName}
                      className="w-14 h-14 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600">
                      {item.employee.fullName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {item.employee.fullName}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {item.employee.email}
                    </p>
                    <p className="text-sm text-slate-500">
                      {item.employee.designation}
                    </p>
                  </div>
                </div>
              ))}

              {projectEmployees.length === 0 && (
                <div className="text-center text-slate-500 py-10">
                  No employees assigned to this project.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Projects;