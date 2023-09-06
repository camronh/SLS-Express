// Import necessary modules
import { Request, Response } from "express";
import userService from "../services/userService";
import { User } from "../models/User";

/**
 * Create User Controller
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const userParams = User.inputSchema.parse(req.body);
    const user = await userService.createUser(userParams);
    res.status(201).send(user);
  } catch (error) {
    // Send Zod error or send default error
    if (error instanceof Error) {
      return res.status(400).send({ error: `Failed to create a user` });
    }
    res.status(500).send({ error: error.toString() });
  }
};

/**
 * Get User Controller
 */
export const getUser = async (req: Request, res: Response) => {
  const userID = req.params.id;
  try {
    const user = await userService.getUser(userID);
    if (!user) throw new Error("User not found");
    res.status(200).send(user);
  } catch (error) {
    res.status(404).send({ error: `Failed to fetch user` });
  }
};

/**
 * Update User Controller
 */
export const updateUser = async (req: Request, res: Response) => {
  const userID = req.params.id;
  try {
    const userParams = User.inputSchema
      .partial()
      .parse({ ...req.body, userID });
    const user = await userService.updateUser(userID, userParams);
    res.status(200).send(user);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).send({ error: `Failed to update a user` });
    }
    res.status(500).send({ error: error.toString() });
  }
};

/**
 * Delete User Controller
 */
export const deleteUser = async (req: Request, res: Response) => {
  const userID = req.params.id;
  try {
    const result = await userService.deleteUser(userID);
    if (!result) throw new Error("Failed to delete user");
    res.status(200).send({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).send({ error: error.toString() });
  }
};
