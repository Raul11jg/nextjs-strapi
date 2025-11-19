import { z } from "zod";

export const SignUpSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
});

export type SignUpSchema = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export type SignInSchema = z.infer<typeof SignInSchema>;

export type FormState = {
  data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  isLoading: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  zodError: any;
  success: boolean;
  message: string;
  strapiError: string | null;
};
