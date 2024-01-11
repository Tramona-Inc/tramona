import { and, eq } from "drizzle-orm/sql";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "@/server/api/trpc";
import { tasks } from "@/server/db/schema";

import {
  createTaskInput,
  deleteTaskByIdInput,
} from "@/server/api/schema/task.schema";

export const taskRouter = createTRPCRouter({
  createTask: protectedProcedure
    .input(createTaskInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        task: input.task,
        createdById: ctx.session.user.id,
      });
    }),

  deleteTaskById: protectedProcedure
    .input(deleteTaskByIdInput)
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .delete(tasks)
        .where(
          and(
            eq(tasks.id, input.id),
            eq(tasks.createdById, ctx.session.user.id),
          ),
        );
    }),

  getAll: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.tasks.findMany({
      orderBy: (tasks, { desc }) => [desc(tasks.createdAt)],
    });
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
