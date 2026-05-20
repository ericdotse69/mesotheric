"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../lib/prisma";

const DEMO_USER_EMAIL = "demo@mesotheric.app";

export type DailyPlanView = {
  id: string;
  date: Date;
  target: string;
  milestones: string[];
  notes?: string | null;
};

type UpsertDailyPlanInput = {
  target: string;
  milestones: string[];
  notes?: string;
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

function getTodayRange() {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  return {
    startOfToday,
    endOfToday,
  };
}

function parseMilestones(value: string | null): string[] {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed.filter((item) => typeof item === "string");
    }

    return [];
  } catch {
    return [];
  }
}

function mapDailyPlanToViewModel(plan: {
  id: string;
  date: Date;
  target: string;
  milestones: string | null;
  notes: string | null;
}): DailyPlanView {
  return {
    id: plan.id,
    date: plan.date,
    target: plan.target,
    milestones: parseMilestones(plan.milestones),
    notes: plan.notes,
  };
}

export async function getTodayDailyPlan() {
  const user = await getDemoUser();

  const { startOfToday, endOfToday } = getTodayRange();

  const plan = await prisma.dailyPlan.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!plan) {
    return null;
  }

  return mapDailyPlanToViewModel(plan);
}

export async function upsertTodayDailyPlanAction(input: UpsertDailyPlanInput) {
  const user = await getDemoUser();

  const target = input.target.trim();

  if (!target) {
    throw new Error("Daily target is required.");
  }

  const milestones = input.milestones
    .map((milestone) => milestone.trim())
    .filter(Boolean);

  const notes = input.notes?.trim() || null;

  const { startOfToday, endOfToday } = getTodayRange();

  const existingPlan = await prisma.dailyPlan.findFirst({
    where: {
      userId: user.id,
      date: {
        gte: startOfToday,
        lte: endOfToday,
      },
    },
  });

  let plan;

  if (existingPlan) {
    plan = await prisma.dailyPlan.update({
      where: {
        id: existingPlan.id,
      },
      data: {
        target,
        milestones: JSON.stringify(milestones),
        notes,
      },
    });
  } else {
    plan = await prisma.dailyPlan.create({
      data: {
        date: new Date(),
        target,
        milestones: JSON.stringify(milestones),
        notes,
        userId: user.id,
      },
    });
  }

  revalidatePath("/");

  return mapDailyPlanToViewModel(plan);
}