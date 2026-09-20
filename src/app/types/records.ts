export type HabitRecord = {
  id: string;
  date: string;
  value: number;
  completed: boolean;
  habitId: string;
  userId: string;
};

export type MatrixCell = { value: number; completed: boolean };

export type MatrixHabit = {
  id: string;
  name: string;
  frequency: string;
  targetValue: number;
  unit: string | null;
  active: boolean;
  startDate: string;
  endDate: string | null;
  cells: Record<string, MatrixCell>;
  expectedDays: number;
  completedDays: number;
  totalValue: number;
  percent: number;
};

export type Matrix = {
  from: string;
  to: string;
  days: string[];
  habits: MatrixHabit[];
};

export type Progress = {
  habitId: string;
  period: "daily" | "weekly" | "monthly";
  from: string;
  to: string;
  targetValue: number;
  unit: string | null;
  expectedDays: number;
  completedDays: number;
  totalValue: number;
  percent: number;
};
