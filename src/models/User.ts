import { z } from "zod";

/**
 * Input params for our model. Can be used for validation in the controller, but we can also parse the interface from it and use just the model.
 */
export const UserParamsSchema = z.object({
  username: z.string(),
  email: z.string().email(),
});

/**
 * This is the type interface for easy use. It is inferred from the schema above.
 */
export type UserParams = z.infer<typeof UserParamsSchema>;

/**
 * This schema represents the data that is stored in the DB. We write it in zod in case we need to use it in migrations or other places.
 */
export const UserDBEntrySchema = z.object({
  id: z.string(),
  createdAt: z.number(),
  updatedAt: z.number(),
  ...UserParamsSchema.shape,
});

export type IUser = z.infer<typeof UserDBEntrySchema>;

/**
 * User Model
 */
export class User {
  constructor(user: IUser) { // Allows us to only need to write our properties once in zod. 
    Object.assign(this, user); // Assign all the properties from the user to this instance
  }
}
