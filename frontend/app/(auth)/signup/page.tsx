import SignUpForm from "@/components/sign-up-form";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
  description:
    "Create a new account to get started and explore all available features.",
};

export default function SignUp() {
  return (
    <div>
      <h1 className="m-2 text-5xl font-bold">Sign Up</h1>
      <p className="m-2">
        Already have an account?{" "}
        <Link href="/signin" className="text-primary hover:underline">
          Sign in
        </Link>
      </p>
      <SignUpForm />
    </div>
  );
}
