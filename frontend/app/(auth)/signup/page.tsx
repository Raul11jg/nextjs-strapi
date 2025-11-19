import SignUpForm from "@/components/sign-up-form";
import Link from "next/link";

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
