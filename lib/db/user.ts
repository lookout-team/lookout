import prisma from "./prisma";
import { User } from "@prisma/client";
import { UserWithIncludes } from "./types";
import { genSaltSync, hashSync } from "bcrypt-ts/browser";

const inclusions = {
  task: true,
  activities: true,
  role: true,
  projects: true,
  comments: true,
  chats: true,
};

/**
 * Creates a new user.
 *
 * @param {Omit<User, "id">} params - User details
 * @returns {Promise<User>} - New user
 */
export async function createUser(params: Omit<User, "id">): Promise<User> {
  const user = await prisma.user.create({
    data: {
      ...params,
    },
  });
  return user;
}

/**
 * Retrieves a user.
 *
 * @param {Partial<User>} params - User details
 * @returns {Promise<UserWithIncludes | null>} - User, if found
 */
export async function getUser(
  params: Partial<User>
): Promise<UserWithIncludes | null> {
  const user = await prisma.user.findFirst({
    where: { ...params },
    include: inclusions,
  });
  return user;
}

/**
 * Retrieves users.
 *
 * @param {Partial<User>} params - User details
 * @returns {Promise<UserWithIncludes[]>} - User array
 */
export async function getUsers(
  params?: Partial<User>
): Promise<UserWithIncludes[]> {
  const user = await prisma.user.findMany({
    where: { ...params },
    include: inclusions,
  });
  return user;
}

/**
 * Update user details.
 *
 * @param {Partial<User>} params - User details
 * @returns {Promise<User>} - Updated user details
 */
export async function updateUser(params: Partial<User>): Promise<User> {
  const user = await prisma.user.update({
    where: { id: params.id },
    data: { ...params },
  });
  return user;
}

/**
 * Deletes a user.
 *
 * @param {number} id - User ID
 * @returns {Promise<User>} - Deleted user details
 */
export async function deleteUser(id: number): Promise<User> {
  const user = await prisma.user.delete({
    where: { id: id },
  });
  return user;
}

/**
 * Signs a user up for a lookout account.
 *
 * @param {Omit<User, "id" | "salt">} params - User details
 * @returns {Promise<User>} - New user
 */
export async function signUp(params: Omit<User, "id" | "salt">): Promise<User> {
  const userSalt = genSaltSync(10);
  const data = {
    ...params,
    salt: userSalt,
    password: hashSync(params.password, userSalt),
  };
  const user = createUser(data);
  return user;
}
