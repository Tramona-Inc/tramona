import React from "react";
import { api } from "~/utils/api";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

function DisplayTaskList() {
  const { data: taskList } = api.task.getAll.useQuery();

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  const { mutate, isLoading } = api.task.deleteById.useMutation({
    onSuccess: () => {
      void utils.task.getAll.invalidate();
    },
  });

  function handleDelete(id: number) {
    mutate({ id: id });
  }

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
              <Button onClick={() => handleDelete(task.id)} variant={"destructive"}>
                Delete
              </Button>
            </div>
          );
        })}
    </ul>
  );
}

export default function Task() {
  const [input, setInput] = React.useState<string>("");

  const utils = api.useUtils(); // To allow to invalidate the data useContext depracated

  const { mutate, isLoading } = api.task.create.useMutation({
    onSuccess: () => {
      setInput("");
      void utils.task.getAll.invalidate();
    },
  });

  function handleInput(e: { target: { value: React.SetStateAction<string> } }) {
    setInput(e.target.value);
  }

  function handleAddTask() {
    mutate({ task: input });
  }

  return (
    <div className="flex flex-col space-y-10">
      <div className="flex flex-row gap-5">
        <Input
          onChange={handleInput}
          value={input}
          placeholder="Input a task ..."
        />
        <Button onClick={handleAddTask} disabled={isLoading}>
          Add task
        </Button>
      </div>
      <DisplayTaskList />
    </div>
  );
}
