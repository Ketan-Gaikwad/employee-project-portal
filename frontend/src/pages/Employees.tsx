import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import api from "../services/api";

type Employee = {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  profileImage?: string;
};

type EmployeeForm = {
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  department: string;
  joiningDate: string;
  profileImage: string;
};

const initialForm: EmployeeForm = {
  fullName: "",
  email: "",
  phone: "",
  designation: "",
  department: "",
  joiningDate: "",
  profileImage: "",
};

function Employees() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<EmployeeForm>(initialForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await api.get("/employees");
      setEmployees(response.data);
    };

    fetchEmployees();
  }, []);

  const refreshEmployees = async () => {
    const response = await api.get("/employees");
    setEmployees(response.data);
  };

  const filteredEmployees = employees.filter((employee) =>
    `${employee.fullName} ${employee.email} ${employee.phone} ${employee.designation} ${employee.department}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setForm({
        ...form,
        profileImage: reader.result as string,
      });

      toast.success("Profile image selected successfully");
    };

    reader.onerror = () => {
      toast.error("Failed to read image");
    };

    reader.readAsDataURL(file);
  };

  const openAddModal = () => {
    setEditingId(null);
    setForm(initialForm);
    setIsModalOpen(true);
  };

  const openEditModal = (employee: Employee) => {
    setEditingId(employee.id);

    setForm({
      fullName: employee.fullName,
      email: employee.email,
      phone: employee.phone,
      designation: employee.designation,
      department: employee.department,
      joiningDate: employee.joiningDate.split("T")[0],
      profileImage: employee.profileImage || "",
    });

    setIsModalOpen(true);
  };

  const saveEmployee = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId) {
        await api.put(`/employees/${editingId}`, form);
        toast.success("Employee updated successfully");
      } else {
        await api.post("/employees", form);
        toast.success("Employee added successfully");
      }

      setForm(initialForm);
      setEditingId(null);
      setIsModalOpen(false);
      refreshEmployees();
    } catch {
      toast.error("Failed to save employee");
    }
  };

  const deleteEmployee = async (id: number) => {
    if (!confirm("Are you sure you want to delete this employee?")) return;

    try {
      await api.delete(`/employees/${id}`);
      toast.success("Employee deleted successfully");
      refreshEmployees();
    } catch {
      toast.error("Failed to delete employee");
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-slate-100 p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Employees</h1>
            <p className="text-slate-500">Manage organization employees</p>
          </div>

          <button
            onClick={openAddModal}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer transition-all duration-200 hover:scale-105"
          >
            + Add Employee
          </button>
        </div>

        <div className="mb-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍 Search by name, email, phone, department..."
            className="w-full md:w-96 border border-slate-300 p-3 rounded-xl shadow-sm bg-white"
          />

          <p className="text-sm text-slate-500">
            Showing {filteredEmployees.length} of {employees.length} employees
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-x-auto hover:shadow-lg transition-all duration-300 max-w-full">
          <table className="min-w-[900px] w-full text-left">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="p-4">Profile</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Designation</th>
                <th className="p-4">Department</th>
                <th className="p-4">Joining Date</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredEmployees.map((employee) => (
                <tr key={employee.id} className="border-b hover:bg-slate-50">
                  <td className="p-4">
                    {employee.profileImage ? (
                      <img
                        src={employee.profileImage}
                        alt={employee.fullName}
                        className="h-11 w-11 rounded-full object-cover border"
                      />
                    ) : (
                      <div className="h-11 w-11 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                        {employee.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </td>

                  <td className="p-4 font-medium">{employee.fullName}</td>
                  <td className="p-4">{employee.email}</td>
                  <td className="p-4">{employee.phone}</td>
                  <td className="p-4">{employee.designation}</td>
                  <td className="p-4">{employee.department}</td>
                  <td className="p-4">
                    {new Date(employee.joiningDate).toLocaleDateString()}
                  </td>

                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => openEditModal(employee)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => deleteEmployee(employee.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded cursor-pointer transition-all duration-200 hover:scale-105"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredEmployees.length === 0 && (
                <tr>
                  <td className="p-6 text-center text-slate-500" colSpan={8}>
                    No employees found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-2xl font-bold text-slate-800">
                {editingId ? "Edit Employee" : "Add Employee"}
              </h2>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-800 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={saveEmployee}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                placeholder="Full Name"
                className="border p-3 rounded"
                required
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                type="email"
                className="border p-3 rounded"
                required
              />

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone Number"
                className="border p-3 rounded"
                required
              />

              <input
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="Designation"
                className="border p-3 rounded"
                required
              />

              <input
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Department"
                className="border p-3 rounded"
                required
              />

              <input
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
                type="date"
                className="border p-3 rounded cursor-pointer"
                required
              />

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium text-slate-700">
                  Profile Image
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full border p-3 rounded cursor-pointer"
                />

                {form.profileImage && (
                  <div className="mt-4 flex items-center gap-4">
                    <img
                      src={form.profileImage}
                      alt="Preview"
                      className="h-20 w-20 rounded-full object-cover border"
                    />

                    <button
                      type="button"
                      onClick={() => setForm({ ...form, profileImage: "" })}
                      className="text-red-600 font-medium cursor-pointer"
                    >
                      Remove Image
                    </button>
                  </div>
                )}
              </div>

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
                  {editingId ? "Update Employee" : "Save Employee"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Employees;