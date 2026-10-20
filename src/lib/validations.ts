import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^(\+?880|0)?1[3-9]\d{8}$/, "Please enter a valid Bangladesh phone number")
    .optional()
    .or(z.literal("")),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const checkoutSchema = z.object({
  name: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email address is required"),
  phone: z
    .string()
    .min(11, "Valid phone number is required")
    .regex(/^(\+?880|0)?1[3-9]\d{8}$/, "Valid Bangladesh phone number required (e.g. 017XXXXXXXX)"),
  address: z.string().optional(),
  notes: z.string().optional(),
  paymentMethod: z.enum(["bkash", "nagad", "rocket", "cod"]),
});

export const paymentSubmissionSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  method: z.enum(["bkash", "nagad", "rocket"]),
  transactionId: z.string().min(6, "Valid Transaction ID is required"),
  senderNumber: z
    .string()
    .min(11, "Valid sender mobile number is required")
    .regex(/^(\+?880|0)?1[3-9]\d{8}$/, "Please enter valid sender mobile number"),
});

export const categorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  slug: z.string().min(2, "Slug is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  displayOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export const paymentMethodSettingSchema = z.object({
  merchantNumber: z.string().min(11, "Valid receiving number required"),
  accountType: z.string().optional(),
  instructions: z.string().optional(),
  isActive: z.boolean(),
});
