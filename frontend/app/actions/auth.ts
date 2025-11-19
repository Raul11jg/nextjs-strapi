"use server";

import { registerUser } from "@/lib/strapi";
import { FormState, SignUpSchema } from "@/validations/auth";
import { z } from "zod";

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

  return {
    success: true,
    message: "User registered successfully",
    strapiError: null,
    isLoading: false,
    zodError: null,
    data: validatedFields.data,
  };
};

export const signOut = async () => {};
