import SignUpForm from "./form";
import { signUp } from "@/lib/db/user";
import { auth, signIn } from "@/lib/auth/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");

  async function signUpAction(form: FormData) {
    "use server";

    const first_name = form.get("first_name")?.toString();
    const last_name = form.get("last_name")?.toString();
    const username = form.get("username")?.toString();
    const email = form.get("email")?.toString();
    const password = form.get("password")?.toString();

    if (
      first_name == null ||
      last_name == null ||
      username == null ||
      email == null ||
      password == null
    ) {
      return;
    }

    const userDetails = {
      first_name: first_name,
      last_name: last_name,
      username: username,
      email: email,
      password: password,
    };

    const newUser = await signUp(userDetails);
    const credentials = {
      login: userDetails.email,
      password: userDetails.password,
    };
    await signIn("credentials", credentials);
    redirect("/dashboard/projects");
  }

  return (
    <div className="mt-16 grid grid-cols-8">
      <div className="col-span-2"></div>
      <div className="col-span-4">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Welcome to Lookout
        </h1>
        <h1 className="text-xl font-medium text-center mb-6">
          Create a new account
        </h1>
        <SignUpForm action={signUpAction} />
      </div>
      <div className="col-span-2"></div>
    </div>
  );
}
