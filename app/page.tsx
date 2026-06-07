import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-actions";

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");
  else redirect("/login");
}
