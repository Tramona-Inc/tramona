import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useZodForm } from "@/utils/useZodForm";
import { z } from "zod";
import { api } from "@/utils/api";
import { Property } from "@/server/db/schema";

const ExpandableSearchBar = ({
  currentHostTeamId,
  className,
  onSearchResultsUpdate,
  onExpandChange,
}: {
  currentHostTeamId: number | null | undefined;
  onSearchResultsUpdate: (results: Property[]) => void;
  onExpandChange: (isExpanded: boolean) => void;
  className?: string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleExpand = () => {
    setIsExpanded(true);
    onExpandChange(true);
  };
  const handleCollapse = () => {
    setIsExpanded(false);
    onExpandChange(false);
    setSearchQuery("");
  };

  const formSchema = z.object({
    searchQuery: z.string(),
  });

  const form = useZodForm({
    schema: formSchema,
  });

  api.properties.getSearchResults.useQuery(
    {
      currentHostTeamId: currentHostTeamId!,
      searchQuery,
    },
    {
      enabled: !!currentHostTeamId,
      onSuccess: (data) => {
        onSearchResultsUpdate(data ?? []);
      },
    },
  );

  const onSubmit = form.handleSubmit(async (formValues) => {
    setSearchQuery(formValues.searchQuery);
    form.reset();
  });

  return (
    <div
      className={`${className} flex items-center transition-all duration-300 ${
        isExpanded ? "w-full max-w-lg" : "w-auto"
      }`}
    >
      <div className="relative w-full">
        {isExpanded ? (
          <Form {...form}>
            <form onSubmit={onSubmit}>
              <FormField
                control={form.control}
                name="searchQuery"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        icon={Search}
                        placeholder="Search listings by name or location"
                        className="w-full rounded-full px-4 py-2 pl-10 text-black transition-all duration-300 focus:outline-none"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </form>
          </Form>
        ) : (
          <Button
            size="icon"
            className="rounded-full bg-white font-bold text-black shadow-xl"
            onClick={handleExpand}
          >
            <Search strokeWidth={2} />
          </Button>
        )}

        {isExpanded && (
          <Button
            size="icon"
            onClick={handleCollapse}
            variant="ghost"
            className="absolute right-4 top-1/2 -translate-y-1/2 transform hover:bg-transparent"
          >
            <X size={20} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExpandableSearchBar;
