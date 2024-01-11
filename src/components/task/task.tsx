import { useState } from "react";
import TaskDisplay from "./task-display";
import { api } from "@/utils/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Task() {
  const [input, setInput] = useState("");

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  // Mutation to create a task
  const { mutate: mutateCreateTask, isLoading } =
    api.task.createTask.useMutation({
      onSuccess: () => {
        setInput("");
        void utils.task.getAll.invalidate();
      },
      onError: () => {
        // Toast UI displaying error
      },
    });

  return (
    <div className="flex flex-col space-y-10">
      {/* Input for adding a task */}
      <div className="flex flex-row gap-5">
        <Input
          onChange={(e) => {
            setInput(e.target.value);
          }}
          value={input}
          placeholder="Input a task ..."
        />
        <Button
          onClick={() => mutateCreateTask({ task: input })}
          disabled={isLoading}
        >
          Add task
        </Button>
      </div>

      {/* Display current user task */}
      <TaskDisplay />
    </div>
  );
}
