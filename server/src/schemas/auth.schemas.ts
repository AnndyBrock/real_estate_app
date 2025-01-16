import { z } from "zod";

export const emailSchema = z.string().email().min(5).max(255);
const passwordSchema = z.string().min(6).max(255);
const userTypeSchema = z.enum(["broker", "agent"]);
const companyNameSchema = z.string().optional();
const firstNameSchema = z.string().min(3).max(30);
const lastNameSchema = z.string().min(3).max(30);
const phoneSchema = z
  .string()
  .min(10, "Phone number is to short")
  .max(15, "Phone number is to long")
  .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  userAgent: z.string().optional(),
});

export const registerSchema = loginSchema
  .extend({
    confirmPassword: passwordSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    userType: userTypeSchema,
    company: companyNameSchema,
    phone: phoneSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verificationCodeSchema = z.string().min(1).max(24);

export const resetPasswordSchema = z.object({
  password: passwordSchema,
  verificationCode: verificationCodeSchema,
});
