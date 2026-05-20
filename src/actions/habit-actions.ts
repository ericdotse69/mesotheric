"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

const DEMO_USER_EMAIL = "demo@mesotheric.app";

const HABIT_TYPES = ["SHADOW", "LIGHT"] as const;
const HABIT_INTENTIONS = ["OBSERVE", "REDUCE", "TRANSMUTE", "RELEASE"] as const;

type HabitType = (typeof HABIT_TYPES)[number];
type HabitIntention = (typeof HABIT_INTENTIONS)[number];

export type HabitView = {
  id: string;
  title: string;
  type: HabitType;
  intention: HabitIntention;
  linkedLightHabit?: string;
};

type CreateHabitInput = {
  title: string;
  type: HabitType;
  intention: HabitIntention;
  linkedLightHabit?: string;
};

async function getDemoUser() {
  const user = await prisma.user.upsert({
    where: {
      email: DEMO_USER_EMAIL,
    },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
    },
  });

  return user;
}

function isHabitType(value: string): value is HabitType {
  return HABIT_TYPES.includes(value as HabitType);
}

function isHabitIntention(value: string): value is HabitIntention {
  return HABIT_INTENTIONS.includes(value as HabitIntention);
}

function mapHabitToViewModel(habit: {
  id: string;
  title: string;
  type: string;
  intention: string;
  linkedHabit?: {
    title: string;
  } | null;
}): HabitView {
  return {
    id: habit.id,
    title: habit.title,
    type: habit.type as HabitType,
    intention: habit.intention as HabitIntention,
    linkedLightHabit: habit.linkedHabit?.title,
  };
}

export async function getHabits() {
  const user = await getDemoUser();

  const habits = await prisma.habit.findMany({
    where: {
      userId: user.id,
      isArchived: false,
    },
    include: {
      linkedHabit: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return habits.map(mapHabitToViewModel);
}

export async function createHabitAction(input: CreateHabitInput) {
  const title = input.title.trim();
  const linkedLightHabit = input.linkedLightHabit?.trim();

  if (!title) {
    throw new Error("Habit title is required.");
  }

  if (!isHabitType(input.type)) {
    throw new Error("Invalid habit type.");
  }

  if (!isHabitIntention(input.intention)) {
    throw new Error("Invalid habit intention.");
  }

  const user = await getDemoUser();

  if (input.type === "SHADOW" && linkedLightHabit) {
    await prisma.$transaction(async (tx) => {
      const lightHabit = await tx.habit.create({
        data: {
          title: linkedLightHabit,
          type: "LIGHT",
          intention: "OBSERVE",
          userId: user.id,
        },
      });

      await tx.habit.create({
        data: {
          title,
          type: "SHADOW",
          intention: input.intention,
          linkedHabitId: lightHabit.id,
          userId: user.id,
        },
      });
    });
  } else {
    await prisma.habit.create({
      data: {
        title,
        type: input.type,
        intention: input.intention,
        userId: user.id,
      },
    });
  }

  revalidatePath("/");

  return getHabits();
}

const MOODS = [
  "CALM",
  "FOCUSED",
  "TIRED",
  "ANXIOUS",
  "MOTIVATED",
  "FRUSTRATED",
  "NEUTRAL",
] as const;

type Mood = (typeof MOODS)[number];

export type HabitLogView = {
  id: string;
  habitTitle: string;
  habitType: HabitType;
  completed: boolean;
  notes?: string | null;
  trigger?: string | null;
  mood?: string | null;
  date: Date;
};

type CreateHabitLogInput = {
  habitId: string;
  completed: boolean;
  notes?: string;
  trigger?: string;
  mood?: Mood | "";
};

function isMood(value: string): value is Mood {
  return MOODS.includes(value as Mood);
}

export async function getTodayHabitLogs() {
  const user = await getDemoUser();

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  const logs = await prisma.habitLog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    include: {
      habit: {
        select: {
          title: true,
          type: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return logs.map((log) => ({
    id: log.id,
    habitTitle: log.habit.title,
    habitType: log.habit.type as HabitType,
    completed: log.completed,
    notes: log.notes,
    trigger: log.trigger,
    mood: log.mood,
    date: log.date,
  }));
}

export async function createHabitLogAction(input: CreateHabitLogInput) {
  const user = await getDemoUser();

  const habit = await prisma.habit.findFirst({
    where: {
      id: input.habitId,
      userId: user.id,
      isArchived: false,
    },
  });

  if (!habit) {
    throw new Error("Habit not found.");
  }

  const mood = input.mood && isMood(input.mood) ? input.mood : null;

  await prisma.habitLog.create({
    data: {
      habitId: habit.id,
      userId: user.id,
      completed: input.completed,
      notes: input.notes?.trim() || null,
      trigger: input.trigger?.trim() || null,
      mood,
      date: new Date(),
    },
  });

  revalidatePath("/");

  return getTodayHabitLogs();
}

type UpdateHabitPathInput = {
  habitId: string;
  intention: HabitIntention;
  releaseTargetDate?: string;
};

export async function updateHabitPathAction(input: UpdateHabitPathInput) {
  if (!input.habitId) {
    throw new Error("Habit ID is required.");
  }

  if (!isHabitIntention(input.intention)) {
    throw new Error("Invalid habit intention.");
  }

  const user = await getDemoUser();

  const habit = await prisma.habit.findFirst({
    where: {
      id: input.habitId,
      userId: user.id,
      isArchived: false,
      type: "SHADOW",
    },
  });

  if (!habit) {
    throw new Error("Shadow Habit not found.");
  }

  await prisma.habit.update({
    where: {
      id: habit.id,
    },
    data: {
      intention: input.intention,
      releaseTargetDate: input.releaseTargetDate
        ? new Date(input.releaseTargetDate)
        : null,
    },
  });

  revalidatePath("/");

  return getHabits();
}