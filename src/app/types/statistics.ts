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
