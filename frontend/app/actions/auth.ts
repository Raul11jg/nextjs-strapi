"use server";

import { registerUser } from "@/lib/strapi";
import { FormState, SignUpSchema } from "@/validations/auth";
import { z } from "zod";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookieConfig = {
  maxAge: 60 * 60 * 24 * 7,
  httpOnly: true, // only accessible by server
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  path: "/",
} as const;

export const signIn = async (formData: FormData) => {};

export const signUp = async (
  prevState: FormState,
  formData: FormData
): Promise<FormState> => {
  const fields = {
    email: (formData.get("email") as string) || "",
    password: (formData.get("password") as string) || "",
    fullName: (formData.get("fullName") as string) || "",
    confirmPassword: (formData.get("confirmPassword") as string) || "",
  };

  const validatedFields = SignUpSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log("Validation failed", flattenedErrors.fieldErrors);
    return {
      success: false,
      message: "Validation failed",
      strapiError: null,
      isLoading: false,
      zodError: flattenedErrors.fieldErrors,
      data: fields,
    };
  }

  console.log("Fields are valid", fields);

  const response = await registerUser(fields);

  if (!response || response.error) {
    console.log("User registration failed", response);
    return {
      success: false,
      message: "User registration failed",
      strapiError: response?.error.message,
      isLoading: false,
      zodError: null,
      data: fields,
    };
  }

  console.log("User registered successfully", response);

  const cookieStore = await cookies();
  cookieStore.set("strapi-jwt", response.jwt, cookieConfig);
  redirect("/dashboard");
};

export const signOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("strapi-jwt");
  redirect("/");
};
