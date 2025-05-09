import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { UseFormProps } from "react-hook-form";
import { type ZodType } from "zod";

export function useZodForm<TSchema extends ZodType>(
  props: Omit<UseFormProps<TSchema["_input"]>, "resolver"> & {
    schema: TSchema;
  },
) {
  const form = useForm<TSchema["_input"], unknown, TSchema["_output"]>({
    ...props,
    resolver: zodResolver(props.schema, undefined),
    shouldFocusError: true,
  });

  return form;
}
