import { z } from "zod";
import mongoose from "mongoose";

export const emailSchema = z.string().email().min(5).max(255);
const firstNameSchema = z.string().min(3).max(30);
const lastNameSchema = z.string().min(3).max(30);
const phoneSchema = z
  .string()
  .min(10, "Phone number is too short")
  .max(15, "Phone number is too long")
  .regex(/^\+?[0-9\s\-()]+$/, "Invalid phone number");

const leadDataSchema = z.object({
  email: emailSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  phone: phoneSchema,
});

export const leadSchema = z.object({
  postId: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
    message: "Invalid post ID",
  }),
  leadData: leadDataSchema,
});
