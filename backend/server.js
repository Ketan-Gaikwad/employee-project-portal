const multer = require("multer");
const path = require("path");
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.get("/", (req, res) => {
  res.send("Backend Running");
});

// AUTH ROUTES
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully",
      userId: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to register user" });
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET || "employee_portal_secret",
      {
        expiresIn: "1d",
      }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to login" });
  }
});

// DASHBOARD ROUTE
app.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const totalEmployees = await prisma.employee.count();
    const totalProjects = await prisma.project.count();
    const activeProjects = await prisma.project.count({
      where: { status: "Active" },
    });

    res.json({
      totalEmployees,
      totalProjects,
      activeProjects,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch dashboard data" });
  }
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.post("/upload", authMiddleware, upload.single("profileImage"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  res.json({
    imageUrl: `http://localhost:5000/uploads/${req.file.filename}`,
  });
});

// EMPLOYEE ROUTES
app.get("/employees", authMiddleware, async (req, res) => {
  try {
    const employees = await prisma.employee.findMany();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employees" });
  }
});


app.post("/employees", authMiddleware, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      designation,
      department,
      joiningDate,
      profileImage,
    } = req.body;

    const employee = await prisma.employee.create({
      data: {
        fullName,
        email,
        phone,
        designation,
        department,
        joiningDate: new Date(joiningDate),
        profileImage,
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create employee" });
  }
});

app.put("/employees/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const {
      fullName,
      email,
      phone,
      designation,
      department,
      joiningDate,
      profileImage,
    } = req.body;

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        fullName,
        email,
        phone,
        designation,
        department,
        joiningDate: new Date(joiningDate),
        profileImage,
      },
    });

    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update employee" });
  }
});

app.delete("/employees/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employeeProject.deleteMany({
      where: {
        employeeId: id,
      },
    });

    await prisma.employee.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete employee" });
  }
});

// PROJECT ROUTES
app.get("/projects", authMiddleware, async (req, res) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

app.post("/projects", authMiddleware, async (req, res) => {
  try {
    const { projectName, description, startDate, endDate, status } = req.body;

    const project = await prisma.project.create({
      data: {
        projectName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to create project" });
  }
});

app.put("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { projectName, description, startDate, endDate, status } = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: {
        projectName,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      },
    });

    res.json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update project" });
  }
});

app.delete("/projects/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employeeProject.deleteMany({
      where: {
        projectId: id,
      },
    });

    await prisma.project.delete({
      where: {
        id,
      },
    });

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

// ASSIGNMENT ROUTES
app.post("/assign", authMiddleware, async (req, res) => {
  try {
    const { employeeId, projectId } = req.body;

    const existingAssignment = await prisma.employeeProject.findFirst({
      where: {
        employeeId,
        projectId,
      },
    });

    if (existingAssignment) {
      return res.status(400).json({
          message: "This employee is already assigned to this project",
      });
    }

    const assignment = await prisma.employeeProject.create({
      data: {
        employeeId,
        projectId,
      },
    });

    res.status(201).json(assignment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to assign employee to project" });
  }
});

app.get("/employees/:id/projects", authMiddleware, async (req, res) => {
  try {
    const employeeId = Number(req.params.id);

    const assignments = await prisma.employeeProject.findMany({
      where: { employeeId },
      include: { project: true },
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch employee projects" });
  }
});

app.delete("/assign/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.employeeProject.delete({
      where: { id },
    });

    res.json({ message: "Employee removed from project successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to remove employee from project" });
  }
});

app.get("/projects/:id/employees", authMiddleware, async (req, res) => {
  try {
    const projectId = Number(req.params.id);

    const assignments = await prisma.employeeProject.findMany({
      where: { projectId },
      include: {
        employee: true,
      },
    });

    res.json(assignments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch project employees",
    });
  }
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});