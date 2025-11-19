"use server";

const initialSignUpState = {
  fields: {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  isLoading: false,
  error: null as string | null,
};

export const signIn = async (formData: FormData) => {};

export const signUp = async (
  prevState: typeof initialSignUpState,
  formData: FormData
) => {
  const email = formData.get("email");
  const password = formData.get("password");
  const fullName = formData.get("fullName");
  const confirmPassword = formData.get("confirmPassword");

  console.log(email, password, fullName, confirmPassword);
  return {
    fields: {
      fullName: fullName as string,
      email: email as string,
      password: password as string,
      confirmPassword: confirmPassword as string,
    },
    isLoading: false,
    error: null,
  };
};

export const signOut = async () => {};
