import express from "express";
import { pgDb } from "../db/postgresStore.js";

const router = express.Router();

// GET all users/personas
router.get("/users", async (req, res) => {
  const users = await pgDb.getUsers();
  res.json({ success: true, data: users });
});

// GET current user by id
router.get("/users/:id", async (req, res) => {
  const user = await pgDb.getUserById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  res.json({ success: true, data: user });
});

// POST login (mock persona login or credentials)
router.post("/login", async (req, res) => {
  const { userId, phone, email } = req.body;
  const users = await pgDb.getUsers();

  if (userId && users[userId]) {
    return res.json({
      success: true,
      token: `jsicp_token_${userId}_${Date.now()}`,
      user: users[userId]
    });
  }

  // Find by phone or email
  const found = Object.values(users).find(
    (u) => (phone && u.phone === phone) || (email && u.email?.toLowerCase() === email.toLowerCase())
  );

  if (found) {
    return res.json({
      success: true,
      token: `jsicp_token_${found.id}_${Date.now()}`,
      user: found
    });
  }

  // Fallback default citizen user
  const defaultUser = users["citizen-sunita"] || Object.values(users)[0];
  return res.json({
    success: true,
    token: `jsicp_token_${defaultUser?.id || "citizen-sunita"}_${Date.now()}`,
    user: defaultUser
  });
});

// POST register user
router.post("/register", async (req, res) => {
  const { fullName, phone, role, district, organizationName, department } = req.body;
  const newUser = await pgDb.createUser({
    fullName,
    phone,
    role,
    district,
    organizationName,
    department
  });

  res.status(201).json({
    success: true,
    token: `jsicp_token_${newUser.id}_${Date.now()}`,
    user: newUser
  });
});

export default router;

