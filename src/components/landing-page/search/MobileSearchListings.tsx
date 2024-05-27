import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import SearchListings from "./SearchListings";
import { useState } from "react";

export default function MobileSearchListings({
  isFilterUndefined,
}: {
  isFilterUndefined: boolean;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger>
        <Button
          size="lg"
          className="absolute inset-x-0 bottom-32 z-20 mx-auto rounded-full"
          onClick={() => {
            setIsDrawerOpen(true);
          }}
        >
          See Properties List
        </Button>
      </DrawerTrigger>
      <DrawerClose />
      <DrawerContent
      // className={isFilterUndefined ? `h-[740px]` : `h-[670px]`}
      >
        <DrawerHeader>
          {!isFilterUndefined && (
            <DrawerDescription>Places within the map area</DrawerDescription>
          )}
        </DrawerHeader>
        <SearchListings isFilterUndefined={isFilterUndefined} />
      </DrawerContent>
    </Drawer>
  );
}
