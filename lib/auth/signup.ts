import { createUser } from "../db/user";
import { User } from "@prisma/client";
import { genSaltSync, hashSync } from "bcrypt-ts/browser";

export async function signUp(
  params: Omit<User, "id | password | salt">
): Promise<User> {
  params.salt = genSaltSync(10);
  params.password = hashSync(params.password, params.salt);
  const user = await createUser(params);
  return user;
}
