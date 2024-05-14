import { cn } from "@/utils/utils";
import { type CityRequestForm } from "./useCityRequestForm";
import { PlusIcon, XIcon } from "lucide-react";
import { MAX_REQUEST_GROUP_SIZE } from "@/server/db/schema";
import {
  type CityRequestDefaultVals,
  defaultSearchOrReqValues,
} from "./schemas";

export function RequestTabsSwitcher({
  curTab,
  setCurTab,
  form,
}: {
  curTab: number;
  setCurTab: (val: number) => void;
  form: CityRequestForm;
}) {
  const { data } = form.watch();
  const numTabs = data.length;

  const tabsWithErrors =
    form.formState.errors.data
      ?.map?.((error, index) => (error ? index : null))
      .filter((i): i is number => i !== null) ?? [];

  return (
    <div className="flex flex-wrap gap-1">
      {Array.from({ length: numTabs }).map((_, i) => {
        const isSelected = curTab === i;
        const hasErrors = tabsWithErrors.includes(i);
        const showX = isSelected && numTabs > 1;

        // buttons in buttons arent allowed, so we only show the x button
        // on the tab when the tab is selected, and make the tab a div instead
        // of a button when its selected
        const Comp = showX ? "div" : "button";

        return (
          <Comp
            key={i}
            type="button"
            onClick={showX ? undefined : () => setCurTab(i)}
            className={cn(
              "inline-flex cursor-pointer items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium backdrop-blur-md",
              hasErrors && "pr-3",
              isSelected
                ? "border-teal-800 bg-teal-800/20 text-teal-900"
                : "border-zinc-300 bg-zinc-100 text-zinc-600 hover:bg-zinc-200",
              showX && "pr-2",
            )}
          >
            Trip {i + 1}
            {hasErrors && (
              <div className="rounded-full bg-red-400 px-1 text-xs font-medium text-black">
                Errors
              </div>
            )}
            {showX && (
              <button
                type="button"
                onClick={() => {
                  if (curTab === numTabs - 1) {
                    setCurTab(numTabs - 2);
                  }
                  form.setValue(
                    "data",
                    data.filter((_, j) => j !== i),
                  );
                }}
                className="rounded-full p-1 hover:bg-black/10 active:bg-black/20"
              >
                <XIcon className="size-3" />
              </button>
            )}
          </Comp>
        );
      })}
      {numTabs < MAX_REQUEST_GROUP_SIZE && (
        <button
          key=""
          type="button"
          onClick={() => {
            setCurTab(numTabs);
            form.setValue("data", [
              ...data,
              {
                defaultSearchOrReqValues,
              } as unknown as CityRequestDefaultVals,
            ]);
            // form.setFocus(`data.${data.length - 1}.location`);
          }}
          className={cn(
            "inline-flex cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-zinc-100 py-2 pl-3 pr-4 text-sm font-medium text-zinc-600 backdrop-blur-md hover:bg-zinc-200",
          )}
        >
          <PlusIcon className="size-4" />
          Add another trip
        </button>
      )}
    </div>
  );
}
