import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default function AdminIndexPage() {
  if (isAuthenticated()) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
