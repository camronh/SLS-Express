import { z } from "zod";
import { dynamo, marshall, unmarshall } from "../utils";

/**
 * Input params for our model. Can be used for validation in the controller, but we can also parse the interface from it and use just the model.
 */
export const UserParamsSchema = z.object({
  username: z.string().describe("The user's username"),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
});

/*
 * This is the type interface for easy use. It is inferred from the schema above.
 */
export type IUserParams = z.infer<typeof UserParamsSchema>;

/**
 * This schema represents the data that is stored in the DB. We write it in zod in case we need to use it in migrations or other places.
 */
export const UserDBEntrySchema = z.object({
  userID: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  ...UserParamsSchema.shape,
});

export type IUser = z.infer<typeof UserDBEntrySchema>;

const tableName = "Users";

/**
 * User Model
 */
export class User {
  // User Data
  readonly userID: string;
  readonly email: string;
  readonly createdAt: number;
  readonly updatedAt: number;
  username: string;
  firstName: string;
  lastName: string;

  // Schemas
  static inputSchema = UserParamsSchema;
  static dbSchema = UserDBEntrySchema;

  constructor(user: IUser) {
    Object.assign(this, user); // Assign all the properties from the user to this instance
  }

  /**
   * Stores the user data in the DB
   */
  async save() {
    const params = {
      TableName: tableName,
      Item: marshall(this.getData()),
    };

    await dynamo.putItem(params);
    return this.getData();
  }

  /**
   * Get a user by their ID
   */
  static async get(userID: string) {
    const params = {
      TableName: tableName,
      Key: marshall({ userID }),
    };

    const result = await dynamo.getItem(params);
    if (!result || !result.Item) throw new Error("User not found");
    const userData = unmarshall(result.Item) as IUser;

    return new User(userData);
  }

  /**
   * Delete a user by their ID
   */
  static async delete(userID: string) {
    const params = {
      TableName: tableName,
      Key: marshall({ userID }),
    };
    await dynamo.deleteItem(params);
    return true;
  }

  /**
   * Returns the user data
   */
  getData(): IUser {
    return {
      userID: this.userID,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      username: this.username,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    };
  }
}
