import { signIn } from "@/lib/auth/auth";

export default async function Page() {
  return (
    <form
      action={async (FormData) => {
        "use server";
        await signIn("credentials", FormData);
      }}
    >
      <label>
        Login
        <input name="login" type="login" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  );
}
