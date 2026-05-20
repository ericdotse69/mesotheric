import {
  GOAL_TIMEFRAMES,
  HABIT_INTENTIONS,
  HABIT_TYPES,
  MOODS,
} from "../constants/app";

export type HabitType = (typeof HABIT_TYPES)[number];

export type HabitIntention = (typeof HABIT_INTENTIONS)[number];

export type Mood = (typeof MOODS)[number];

export type GoalTimeframe = (typeof GOAL_TIMEFRAMES)[number];