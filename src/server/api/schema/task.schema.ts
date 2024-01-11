import z from "zod";

export const createTaskInput = z.object({ task: z.string().min(1) });

export type CreateTaskInput = z.TypeOf<typeof createTaskInput>;

export const deleteTaskByIdInput = z.object({ id: z.number().min(1) });

export type DeleteTaskById = z.TypeOf<typeof deleteTaskByIdInput>;
