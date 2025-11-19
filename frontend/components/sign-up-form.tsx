"use client";

import { useActionState } from "react";
import SocialLoginButton from "@/components/ui/social-login-button";
import FormDivider from "@/components/ui/form-divider";
import FormInput from "@/components/ui/form-input";
import PasswordInput from "@/components/ui/password-input";
import SubmitButton from "@/components/ui/submit-button";
import { actions } from "@/app/actions";
import { FormState } from "@/validations/auth";

const INITIAL_STATE: FormState = {
  success: false,
  message: "",
  strapiError: null,
  isLoading: false,
  zodError: null,
  data: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
};

export default function SignUpForm() {
  const [formState, formAction] = useActionState(
    actions.auth.signUp,
    INITIAL_STATE
  );

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log(`Sign up with ${provider}`);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Social Login Buttons */}
      <div className="space-y-3">
        <SocialLoginButton
          provider="google"
          onClick={() => handleSocialLogin("Google")}
        />
        <SocialLoginButton
          provider="facebook"
          onClick={() => handleSocialLogin("Facebook")}
        />
        <SocialLoginButton
          provider="apple"
          onClick={() => handleSocialLogin("Apple")}
        />
      </div>

      <FormDivider />

      {/* Registration Form */}
      <form action={formAction} className="space-y-4">
        <FormInput
          id="fullName"
          type="text"
          name="fullName"
          label="Full Name"
          placeholder="John Doe"
          required
          autoComplete="name"
        />

        <FormInput
          id="email"
          type="email"
          name="email"
          label="Email"
          placeholder="your@email.com"
          required
          autoComplete="email"
        />

        <PasswordInput
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          required
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          required
          autoComplete="new-password"
        />

        <div className="text-sm">
          <label className="flex items-start gap-2">
            <input
              type="checkbox"
              required
              className="border-border text-primary focus:ring-primary mt-0.5 h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
            />
            <span className="text-muted-foreground">
              I agree to the{" "}
              <a
                href="#"
                className="text-foreground font-medium hover:underline"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="text-foreground font-medium hover:underline"
              >
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        <SubmitButton
          isLoading={formState.isLoading}
          loadingText="Creating account..."
        >
          Create account
        </SubmitButton>
      </form>
    </div>
  );
}
