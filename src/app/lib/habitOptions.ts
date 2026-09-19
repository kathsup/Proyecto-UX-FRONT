export const frequencyOptions = [
  { value: "daily", label: "Diaria" },
  { value: "weekly", label: "Semanal" },
  { value: "custom", label: "Personalizada" },
];

export const frequencyLabels: Record<string, string> = {
  daily: "Diaria",
  weekly: "Semanal",
  custom: "Personalizada",
};

export const unitOptions = [
  "veces",
  "vasos",
  "minutos",
  "páginas",
  "pasos",
  "km",
  "repeticiones",
];

export const periodDaysOptions = [2, 3, 4, 5, 6, 10, 14, 15, 30];

export const labelByFrequency: Record<string, string> = {
  daily: "Meta diaria",
  weekly: "Meta semanal",
  custom: "Meta por periodo",
};

export const categoryOptions = ["Salud", "Educación", "Personal"];
export const priorityOptions = ["Alta", "Media", "Baja"];

export type PredefinedHabit = {
  name: string;
  category: string;
  frequency: "daily" | "weekly" | "custom";
  targetValue: string;
  unit: string;
};

export const predefinedHabits: PredefinedHabit[] = [
  {
    name: "Beber agua",
    category: "Salud",
    frequency: "daily",
    targetValue: "8",
    unit: "vasos",
  },
  {
    name: "Leer",
    category: "Educación",
    frequency: "daily",
    targetValue: "30",
    unit: "minutos",
  },
  {
    name: "Caminar",
    category: "Salud",
    frequency: "daily",
    targetValue: "30",
    unit: "minutos",
  },
  {
    name: "Hacer ejercicio",
    category: "Salud",
    frequency: "weekly",
    targetValue: "3",
    unit: "veces",
  },
];
