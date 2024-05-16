import { createUser } from "../db/user";
import { User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts/browser";

/**
 * Signs a user up for a lookacount account.
 *
 * @param {Omit<User, "id | password | salt">} params - User details
 * @returns {Promise<User>} - New user
 */
export async function signUp(
  params: Omit<User, "id | password | salt">
): Promise<User> {
  params.salt = genSaltSync(10);
  params.password = hashSync(params.password, params.salt);
  const user = await createUser(params);
  return user;
}
