import * as z from "zod";

export const habitSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(100, "El nombre no puede superar los 100 caracteres"),
    description: z.string().trim().max(300, "Máximo 300 caracteres").optional(),
    category: z.string().optional(),
    frequency: z.string().min(1, "Selecciona una frecuencia"),
    targetValue: z
      .string()
      .regex(/^[1-9]\d{0,3}$/, "Ingresa un número entero entre 1 y 9999"),
    unit: z.string().optional(),
    periodDays: z.string().optional(),
    priority: z.string().optional(),
    startDate: z.string().min(1, "Selecciona una fecha de inicio"),
    endDate: z.string().optional(),
  })
  .refine((data) => data.frequency !== "custom" || !!data.periodDays, {
    message: "Selecciona cada cuántos días",
    path: ["periodDays"],
  });
