import { useZodForm } from "@/utils/useZodForm";
import { searchSchema, defaultSearchOrReqValues } from "./schemas";

export function useSearchBarForm() {
  return useZodForm({
    schema: searchSchema,
    defaultValues: defaultSearchOrReqValues,
  });
}
