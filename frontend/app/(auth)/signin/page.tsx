import SignInForm from "@/components/sign-in-form";
import Link from "next/link";

export default function SignIn() {
  return (
    <div>
      <h1 className="m-2 text-5xl font-bold">Sign In</h1>
      <p className="m-2">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-primary hover:underline">
          Sign up
        </Link>
      </p>
      <SignInForm />
    </div>
  );
}
