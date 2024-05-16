import { auth } from "@/lib/auth/auth";

export default async function Page() {
  const session = await auth();
  if (session && session.user) {
    console.log(session.user.id);
  }
  return <h1 className="text-lg text-center">Construction in progress!</h1>;
}
