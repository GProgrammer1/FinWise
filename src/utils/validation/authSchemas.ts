import { z } from "zod";

// Password validation - matches backend (min 8 chars, max 100)
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password must be less than 100 characters");

// Email validation
const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address")
  .toLowerCase();

// Login validation schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Signup - Step 1 (Common fields for both roles)
export const signupStep1Schema = z.object({
  role: z.enum(["PARENT", "CHILD"], {
    required_error: "Please select an account type",
  }),
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string().min(1, "Please confirm your password"),
  agreeToTerms: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms and conditions"),
});

// Signup - Step 2 (PARENT only)
export const signupStep2ParentSchema = z.object({
  country: z
    .string()
    .length(2, "Please select a valid country"),
  numberOfChildren: z
    .number()
    .int("Number of children must be a whole number")
    .min(0, "Number of children cannot be negative")
    .max(20, "Number of children cannot exceed 20"),
  monthlyIncomeBase: z
    .number()
    .positive("Monthly income must be greater than 0"),
  monthlyRentBase: z
    .number()
    .nonnegative("Monthly rent cannot be negative")
    .optional(),
  monthlyLoansBase: z
    .number()
    .nonnegative("Monthly loans cannot be negative")
    .optional(),
  otherNotes: z
    .string()
    .max(1000, "Notes must be less than 1000 characters")
    .optional(),
});

export type SignupStep1FormData = z.infer<typeof signupStep1Schema>;
export type SignupStep2ParentFormData = z.infer<typeof signupStep2ParentSchema>;

// Forgot password schema
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset password schema
export const resetPasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema> & {
  token: string;
};

// Change password schema (for authenticated users)
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
