// User Routes

import { Router } from "express";

const app = Router();
// Import the necessary controllers
import { createUser, getUser, updateUser, deleteUser } from "../controllers/userControllers";

// Create User endpoint
app.post("/", createUser);

// Get User endpoint
app.get("/:id", getUser);

// Update User endpoint
app.put("/:id", updateUser);

// Delete User endpoint
app.delete("/:id", deleteUser);

export default app;
