import { Search, X } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const ExpandableSearchBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleExpand = () => setIsExpanded(true);
  const handleCollapse = () => {
    setIsExpanded(false);
    setSearchQuery("");
  };

  return (
    <div
      className={`flex items-center transition-all duration-300 ${
        isExpanded ? "w-full max-w-lg" : "w-auto"
      }`}
    >
      <div className="relative w-full">
        {isExpanded ? (
          <Input
            type="text"
            icon={Search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search listings by name or location"
            className="w-full rounded-full px-4 py-2 pl-10 text-black transition-all duration-300 focus:outline-none"
          />
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
