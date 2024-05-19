import { redirect } from "next/navigation";
import SignInForm from "./form";
import { auth, signIn } from "@/lib/auth/auth";

export default async function Page() {
  const session = await auth();
  if (session?.user) redirect("/dashboard");
  
  async function signInAction(form: FormData) {
    "use server";
    await signIn("credentials", form);
  }

  return (
    <div className="mt-16 grid grid-cols-8">
      <div className="col-span-2"></div>
      <div className="col-span-4">
        <h1 className="text-3xl font-semibold text-center mb-2">
          Good to see you again
        </h1>
        <h1 className="text-xl font-medium text-center mb-6">
          Sign in to Lookout
        </h1>
        <SignInForm action={signInAction} />
      </div>
      <div className="col-span-2"></div>
    </div>
  );
}
