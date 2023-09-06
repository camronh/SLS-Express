import { User, IUserParams } from "../models/User";
import { v4 as uuid } from "uuid";

/**
 * Creates a new user and stores it in the DB
 */
async function createUser(userParams: IUserParams) {
  console.log(`Creating user ${userParams.username}`);
  const user = new User({
    ...userParams,
    userID: uuid(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });
  await user.save();
  console.log(user.getData());
  return user;
}

/**
 * Get a user by their ID
 * @param userID
 */
async function getUser(userID: string) {
  console.log(`Getting user ${userID}`);
  return await User.get(userID);
}

/**
 * Update a user's data
 */
async function updateUser(userID: string, userParams: IUserParams) {
  console.log(`Updating user ${userID}`);
  console.log(userParams);
  const user = await User.get(userID);
  Object.assign(user, userParams, { updatedAt: Date.now() });
  await user.save();
  return user;
}

/**
 * Delete a user by their ID
 * @param userID
 */
async function deleteUser(userID: string) {
  console.log(`Deleting user ${userID}`);
  return await User.delete(userID);
}

export default {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
