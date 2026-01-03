export type WeeklySchedule = {
  weekday: number; // 0 Sun - 6 Sat
  start: string;
  end: string;
  interval: number;
};

export const weeklySchedule: WeeklySchedule[] = [
  { weekday: 1, start: "09:00", end: "18:00", interval: 30 },
  { weekday: 2, start: "09:00", end: "18:00", interval: 30 },
  { weekday: 3, start: "09:00", end: "18:00", interval: 30 },
  { weekday: 4, start: "10:00", end: "18:00", interval: 30 },
  { weekday: 5, start: "09:00", end: "18:00", interval: 30 },
  { weekday: 6, start: "09:00", end: "14:00", interval: 30 },
];
