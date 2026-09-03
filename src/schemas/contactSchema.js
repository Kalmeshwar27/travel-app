import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Enter your full name"),
  email: z.email("Enter a valid email address"),
  subject: z
    .string()
    .min(3, "Subject must be at least 3 characters")
    .max(100, "Subject must be 100 characters or fewer"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});
