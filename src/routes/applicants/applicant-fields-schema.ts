import { z } from "zod";

const applicantChildSchema = z.object({
  age: z.number(),
});

export const applicantFieldsSchema = z.object({
  age: z.number(),

  maritalStatus: z
    .union([
      z.literal("single"),
      z.literal("married"),
      z.literal("divorced"),
      z.literal("widowed"),
    ])
    .optional(),

  income: z.number().optional(),

  employmentStatus: z
    .union([
      z.literal("employed"),
      z.literal("unemployed"),
      z.literal("self-employed"),
    ])
    .optional(),

  // ISO date format (YYYY-MM-DD)
  retrenchmentDate: z.string().date().optional(),

  children: z.array(applicantChildSchema).optional(),
});
