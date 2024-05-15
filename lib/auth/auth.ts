import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { compareSync, hashSync } from "bcrypt-ts";
import { getUser } from "../db/user";
import { signInSchema } from "./zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // Specify which fields should be submitted:
      credentials: {
        login: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null;
          let { login, password } = await signInSchema.parseAsync(credentials);
          // Validate if email or username exists.
          user =
            (await getUser({ email: login })) ||
            (await getUser({ username: login }));
          if (!user) {
            throw new Error("User not found.");
          }

          // Check if valid password
          if (!compareSync(password, user?.password)) {
            throw new Error("Invalid password.");
          }
          return user as any;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null;
          }
        }
      },
    }),
  ],
  callbacks: {
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
