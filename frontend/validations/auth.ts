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

type TreeifiedError = {
  errors: string[];
  properties?: {
    [K in keyof SignUpSchema]?: {
      errors: string[];
    };
  };
};

export type FormState = {
  data: {
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
  };
  isLoading: boolean;
  zodError: TreeifiedError | null;
  success: boolean;
  message: string;
  strapiError: string | null;
};
