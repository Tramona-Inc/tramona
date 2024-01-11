import React from "react";
import { api } from "@/utils/api";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";

export default function TaskDisplay() {
  const { data: taskList } = api.task.getAllTask.useQuery();

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  const { mutate: mutateDeleteTaskById, isLoading } =
    api.task.deleteTaskById.useMutation({
      onSuccess: () => {
        void utils.task.getAllTask.invalidate(); // will revalidate the tasks array to see if there are any changes
      },
    });

  return (
    <ul className="space-y-5">
      {taskList &&
        taskList.length > 0 &&
        taskList.map((task) => {
          return (
            <div
              className="flex flex-row items-center justify-between "
              key={task.id}
            >
              <div className="flex items-center gap-5">
                <Checkbox value={task.isCompleted ? "true" : "false"} />
                <li className={"text-primary"}>{task.task}</li>
              </div>
              <Button
                onClick={() => mutateDeleteTaskById({ id: task.id })}
                variant={"destructive"}
                disabled={isLoading}
              >
                Delete
              </Button>
            </div>
          );
        })}
    </ul>
  );
}
