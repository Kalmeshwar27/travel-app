import { z } from "zod";

const activitySchema = z.object({
  time: z.string().min(1),
  activity: z.string().min(1),
});

const daySchema = z.object({
  day: z.number().int().positive(),
  title: z.string().min(1),
  morning: z.array(activitySchema).default([]),
  afternoon: z.array(activitySchema).default([]),
  evening: z.array(activitySchema).default([]),
  notes: z.array(z.string()).default([]),
});

export const itinerarySchema = z.object({
  destination: z.string().min(1),
  days: z.array(daySchema).min(1),
});

export const itineraryFormSchema = z.object({
  days: z.coerce.number().int().min(1, "At least 1 day").max(14, "Keep it to 14 days or fewer"),
  interests: z.array(z.string()).default([]),
  pace: z.enum(["relaxed", "balanced", "packed"]).default("balanced"),
  budget: z.enum(["low", "moderate", "high"]).default("moderate"),
});
