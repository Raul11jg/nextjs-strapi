"use client";

import { useState } from "react";
import SocialLoginButton from "@/components/ui/social-login-button";
import FormDivider from "@/components/ui/form-divider";
import FormInput from "@/components/ui/form-input";
import PasswordInput from "@/components/ui/password-input";
import SubmitButton from "@/components/ui/submit-button";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement authentication logic
    setTimeout(() => setIsLoading(false), 1000);
  };

  const handleSocialLogin = (provider: string) => {
    // TODO: Implement social login
    console.log(`Login with ${provider}`);
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

      {/* Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              className="border-border text-primary focus:ring-primary h-4 w-4 rounded focus:ring-2 focus:ring-offset-2"
            />
            <span className="text-muted-foreground">Remember me</span>
          </label>
          <a
            href="#"
            className="text-foreground font-medium underline-offset-4 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <SubmitButton isLoading={isLoading} loadingText="Signing in...">
          Sign in
        </SubmitButton>
      </form>
    </div>
  );
}
