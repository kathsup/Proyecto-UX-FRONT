export type Habit = {
  id: string;
  name: string;
  description?: string | null;
  category?: string | null;
  frequency: string;
  targetValue: number;
  unit?: string | null;
  periodDays?: number | null;
  priority?: string | null;
  startDate: string;
  endDate?: string | null;
  active: boolean;
};

export type HabitPayload = {
  name: string;
  frequency: string;
  targetValue: number;
  unit: string;
  startDate: string;
  periodDays?: number;
  description?: string;
  category?: string;
  priority?: string;
  endDate?: string;
};
