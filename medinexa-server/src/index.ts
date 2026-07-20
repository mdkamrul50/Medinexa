import "dotenv/config";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
import { getDB } from "./db.js";

const REQUIRED_ENV_VARS = ["MONGODB_URI", "BETTER_AUTH_SECRET", "BETTER_AUTH_URL"] as const;
const missing: string[] = [];
for (const key of REQUIRED_ENV_VARS) {
  if (!process.env[key]) missing.push(key);
}
if (missing.length > 0) {
  console.error(`Missing required environment variables: ${missing.join(", ")}`);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.use("/api/auth/sign-up/email", (req, res, next) => {
  if (req.method !== "POST") return next();

  const { password } = req.body;
  if (!password || typeof password !== "string") {
    res.status(422).json({ message: "Password is required" });
    return;
  }

  if (password.length < 5) {
    res.status(422).json({ message: "Password must be at least 5 characters" });
    return;
  }

  if (!/[a-zA-Z]/.test(password)) {
    res.status(422).json({ message: "Password must contain at least one letter" });
    return;
  }

  if (!/[0-9]/.test(password)) {
    res.status(422).json({ message: "Password must contain at least one number" });
    return;
  }

  next();
});

app.all("/api/auth/*path", toNodeHandler(auth));

app.get("/api/users", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const db = await getDB();
    const users = await db
      .collection("users")
      .find({}, { projection: { _id: 1, name: 1, email: 1, emailVerified: 1, role: 1, createdAt: 1, updatedAt: 1 } })
      .sort({ createdAt: -1 })
      .toArray();

    const total = await db.collection("users").countDocuments();

    res.json({ total, users });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.patch("/api/users/role", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { userId, role } = req.body;
    if (!userId || !role) {
      res.status(400).json({ message: "userId and role are required" });
      return;
    }

    const validRoles = ["admin", "doctor", "patient", "receptionist"];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: "Invalid role" });
      return;
    }

    const db = await getDB();
    const result = await db.collection("users").updateOne(
      { _id: userId },
      { $set: { role } }
    );

    if (result.matchedCount === 0) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json({ message: "Role updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update role" });
  }
});

app.patch("/api/users/profile", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const { name, phone, address } = req.body;
    if (!name && phone === undefined && address === undefined) {
      res.status(400).json({ message: "At least one field is required" });
      return;
    }

    const db = await getDB();
    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (address !== undefined) updateData.address = address;

    const userId = new ObjectId(session.user.id);

    await db.collection("users").updateOne(
      { _id: userId },
      { $set: updateData }
    );

    const updated = await db.collection("users").findOne(
      { _id: userId },
      { projection: { _id: 0, name: 1, email: 1, phone: 1, address: 1, role: 1, image: 1, createdAt: 1, updatedAt: 1 } }
    );

    res.json({ user: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
});

/* ─── Doctor CRUD Endpoints ─── */

function validatePassword(password: unknown): string | null {
  if (!password || typeof password !== "string") return "Password is required";
  if (password.length < 5) return "Password must be at least 5 characters";
  if (!/[a-zA-Z]/.test(password)) return "Password must contain at least one letter";
  if (!/[0-9]/.test(password)) return "Password must contain at least one number";
  return null;
}

const DOCTOR_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "department", "specialization", "qualifications", "experience",
  "consultationFee", "availableDays", "availableTime", "hospitalBranch",
  "biography", "status", "rating",
];

function pickDoctorFields(body: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of DOCTOR_UPDATABLE_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
}

app.get("/api/doctors", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const db = await getDB();
    const { search, department, status, sortBy = "createdAt", sortOrder = "desc", page = "1", limit = "10" } = req.query as Record<string, string>;

    const query: Record<string, unknown> = {};
    if (search?.trim()) query.name = { $regex: search.trim(), $options: "i" };
    if (department) query.department = department;
    if (status) query.status = status;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await db.collection("doctors").countDocuments(query);
    const doctors = await db.collection("doctors")
      .find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    res.json({ doctors, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch { res.status(500).json({ message: "Failed to fetch doctors" }); }
});

app.get("/api/doctors/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const db = await getDB();
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(req.params.id) });
    if (!doctor) { res.status(404).json({ message: "Doctor not found" }); return; }

    res.json(doctor);
  } catch { res.status(500).json({ message: "Failed to fetch doctor" }); }
});

app.post("/api/doctors", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session || session.user.role !== "admin") { res.status(403).json({ message: "Forbidden" }); return; }

    const { password, ...rest } = req.body;
    const passwordError = validatePassword(password);
    if (passwordError) { res.status(400).json({ message: passwordError }); return; }
    if (!rest.name || !rest.email) { res.status(400).json({ message: "name and email are required" }); return; }

    const db = await getDB();
    const existingUser = await db.collection("users").findOne({ email: rest.email });
    let userId: string;

    if (existingUser) {
      userId = existingUser._id.toString();
      await db.collection("users").updateOne({ _id: existingUser._id }, { $set: { role: "doctor" } });
    } else {
      const { user: createdUser } = await auth.api.signUpEmail({
        body: { name: rest.name, email: rest.email, password },
        headers: fromNodeHeaders(req.headers),
      });
      userId = createdUser.id;
      await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { role: "doctor" } });
    }

    const doctorDoc = {
      ...pickDoctorFields(rest),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("doctors").insertOne(doctorDoc);
    res.status(201).json({ ...doctorDoc, _id: result.insertedId });
  } catch { res.status(400).json({ message: "Failed to create doctor. Email may already be in use." }); }
});

app.patch("/api/doctors/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session || session.user.role !== "admin") { res.status(403).json({ message: "Forbidden" }); return; }

    const db = await getDB();
    const updateData = { ...pickDoctorFields(req.body), updatedAt: new Date().toISOString() };

    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) { res.status(404).json({ message: "Doctor not found" }); return; }

    const updated = await db.collection("doctors").findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch { res.status(500).json({ message: "Failed to update doctor" }); }
});

app.delete("/api/doctors/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session || session.user.role !== "admin") { res.status(403).json({ message: "Forbidden" }); return; }

    const db = await getDB();
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(req.params.id) });
    if (!doctor) { res.status(404).json({ message: "Doctor not found" }); return; }

    await db.collection("doctors").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Doctor deleted successfully" });
  } catch { res.status(500).json({ message: "Failed to delete doctor" }); }
});

/* ─── Patient CRUD Endpoints ─── */

const PATIENT_UPDATABLE_FIELDS = [
  "name", "email", "phone", "image", "gender", "dateOfBirth",
  "bloodGroup", "height", "weight", "emergencyContact", "address",
  "assignedDoctor", "medicalHistory", "allergies", "currentMedications", "status",
];

function pickPatientFields(body: Record<string, unknown>) {
  const picked: Record<string, unknown> = {};
  for (const key of PATIENT_UPDATABLE_FIELDS) {
    if (body[key] !== undefined) picked[key] = body[key];
  }
  return picked;
}

app.get("/api/patients", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const db = await getDB();
    const { search, bloodGroup, status, assignedDoctor, sortBy = "createdAt", sortOrder = "desc", page = "1", limit = "10" } = req.query as Record<string, string>;

    const query: Record<string, unknown> = {};
    if (search?.trim()) {
      query.$or = [
        { name: { $regex: search.trim(), $options: "i" } },
        { email: { $regex: search.trim(), $options: "i" } },
      ];
    }
    if (bloodGroup) query.bloodGroup = bloodGroup;
    if (status) query.status = status;
    if (assignedDoctor) query.assignedDoctor = assignedDoctor;

    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    const total = await db.collection("patients").countDocuments(query);
    const patients = await db.collection("patients")
      .find(query)
      .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 })
      .skip(skip)
      .limit(limitNum)
      .toArray();

    res.json({ patients, total, page: pageNum, totalPages: Math.ceil(total / limitNum) });
  } catch { res.status(500).json({ message: "Failed to fetch patients" }); }
});

app.get("/api/patients/by-user/:userId", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const db = await getDB();
    const patient = await db.collection("patients").findOne({ userId: req.params.userId });
    if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }

    res.json(patient);
  } catch { res.status(500).json({ message: "Failed to fetch patient" }); }
});

app.get("/api/patients/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const db = await getDB();
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(req.params.id) });
    if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }

    res.json(patient);
  } catch { res.status(500).json({ message: "Failed to fetch patient" }); }
});

app.post("/api/patients", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const allowedRoles = ["admin", "receptionist"];
    if (!allowedRoles.includes(session.user.role)) { res.status(403).json({ message: "Forbidden" }); return; }

    const { password, ...rest } = req.body;
    const passwordError = validatePassword(password);
    if (passwordError) { res.status(400).json({ message: passwordError }); return; }
    if (!rest.name || !rest.email) { res.status(400).json({ message: "name and email are required" }); return; }

    const db = await getDB();
    const existingUser = await db.collection("users").findOne({ email: rest.email });
    let userId: string;

    if (existingUser) {
      userId = existingUser._id.toString();
      await db.collection("users").updateOne({ _id: existingUser._id }, { $set: { role: "patient" } });
    } else {
      const { user: createdUser } = await auth.api.signUpEmail({
        body: { name: rest.name, email: rest.email, password },
        headers: fromNodeHeaders(req.headers),
      });
      userId = createdUser.id;
      await db.collection("users").updateOne({ _id: new ObjectId(userId) }, { $set: { role: "patient" } });
    }

    const patientDoc = {
      ...pickPatientFields(rest),
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const result = await db.collection("patients").insertOne(patientDoc);
    res.status(201).json({ ...patientDoc, _id: result.insertedId });
  } catch { res.status(400).json({ message: "Failed to create patient. Email may already be in use." }); }
});

app.patch("/api/patients/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session) { res.status(401).json({ message: "Unauthorized" }); return; }

    const allowedRoles = ["admin", "doctor", "receptionist"];
    if (!allowedRoles.includes(session.user.role)) { res.status(403).json({ message: "Forbidden" }); return; }

    const db = await getDB();

    if (session.user.role === "doctor") {
      const patient = await db.collection("patients").findOne({ _id: new ObjectId(req.params.id) });
      if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }
      if (patient.assignedDoctor !== session.user.id && patient.assignedDoctor !== session.user.name) {
        res.status(403).json({ message: "You can only update your assigned patients" }); return;
      }
    }

    const updateData = { ...pickPatientFields(req.body), updatedAt: new Date().toISOString() };

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) { res.status(404).json({ message: "Patient not found" }); return; }

    const updated = await db.collection("patients").findOne({ _id: new ObjectId(req.params.id) });
    res.json(updated);
  } catch { res.status(500).json({ message: "Failed to update patient" }); }
});

app.delete("/api/patients/:id", async (req, res) => {
  try {
    const session = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!session || session.user.role !== "admin") { res.status(403).json({ message: "Forbidden" }); return; }

    const db = await getDB();
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(req.params.id) });
    if (!patient) { res.status(404).json({ message: "Patient not found" }); return; }

    await db.collection("patients").deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Patient deleted successfully" });
  } catch { res.status(500).json({ message: "Failed to delete patient" }); }
});

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
