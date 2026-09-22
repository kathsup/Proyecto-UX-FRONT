export type MonthPercent = { month: string; percent: number | null }; // "2026-09"
export type WeekPercent = { weekStart: string; percent: number | null };

export type OverviewData = {
  totalHabits: number;
  activeHabits: number;
  finishedHabits: number;
  consecutiveDays: number;
  monthlyProgress: MonthPercent[];
  trend: WeekPercent[];
  trendChange: number | null;
};

export type HeatmapDay = { day: string; done: boolean };

export type DayPercent = {
  day: string;
  percent: number | null;
};

export type DashboardData = {
  activeHabits: number;
  completedToday: number;
  currentStreak: number;
  bestStreak: number;
  percentToday: number | null;
  weekly: DayPercent[];
  monthly: DayPercent[];
};
