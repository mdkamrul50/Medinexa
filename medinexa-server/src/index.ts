import "dotenv/config";
import express from "express";
import cors from "cors";
import { ObjectId } from "mongodb";
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";
import { getDB } from "./db.js";

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

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
