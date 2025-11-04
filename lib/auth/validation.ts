import * as z from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
export const SignUpSchema = z.object({
  firstname: z.string().min(2, "FirstName must be at least 2 characters"),
  lastname: z.string().min(2, "Last Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
