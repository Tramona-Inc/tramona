import { useState } from "react";

import DesktopSearchBar from "./DesktopSearchBar";
import LinkScrapeSearchBar from "./LinkScrapeSearchBar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

function SearchBarSwitch({
  mode,
  setMode,
}: {
  mode: "default" | "link-scrape";
  setMode: (mode: "default" | "link-scrape") => void;
}) {
  return (
    <div className="flex items-center space-x-2 rounded-full bg-white px-4 py-2">
      <Label htmlFor="mode">{mode === "default" ? "Regular" : "Link"}</Label>
      <Switch
        id="mode"
        checked={mode === "default" ? false : true}
        onCheckedChange={() =>
          setMode(mode === "default" ? "link-scrape" : "default")
        }
      />
    </div>
  );
}

export default function SearchBar() {
  const [mode, setMode] = useState<"default" | "link-scrape">("default");

  return (
    <>
      {mode === "default" && (
        <DesktopSearchBar
          modeSwitch={<SearchBarSwitch mode={mode} setMode={setMode} />}
        />
      )}
      {mode === "link-scrape" && (
        <LinkScrapeSearchBar
          modeSwitch={<SearchBarSwitch mode={mode} setMode={setMode} />}
        />
      )}
    </>
  );
}
