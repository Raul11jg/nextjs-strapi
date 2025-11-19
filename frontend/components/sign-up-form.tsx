"use client";

import { useState } from "react";
import SocialLoginButton from "@/components/ui/social-login-button";
import FormDivider from "@/components/ui/form-divider";
import FormInput from "@/components/ui/form-input";
import PasswordInput from "@/components/ui/password-input";
import SubmitButton from "@/components/ui/submit-button";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    setIsLoading(true);
    // TODO: Implement registration logic
    setTimeout(() => setIsLoading(false), 1000);
  };

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
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          id="fullName"
          type="text"
          label="Full Name"
          placeholder="John Doe"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          autoComplete="name"
        />

        <FormInput
          id="email"
          type="email"
          label="Email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <PasswordInput
          id="password"
          label="Password"
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
        />

        <PasswordInput
          id="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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

        <SubmitButton isLoading={isLoading} loadingText="Creating account...">
          Create account
        </SubmitButton>
      </form>
    </div>
  );
}
