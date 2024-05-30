import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Listings from "../_sections/Listings";
import SearchListings from "./SearchListings";

export default function MobileSearchListings({
  isFilterUndefined,
  callSiblingFunction,
}: {
  isFilterUndefined: boolean;
  callSiblingFunction: () => void;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger>
        <Button
          size="lg"
          variant="white"
          className="fixed inset-x-0 bottom-32 z-20 mx-auto w-max rounded-full px-4 shadow-[2px_2px_15px_#000a]"
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
        <SearchListings
          isFilterUndefined={isFilterUndefined}
          callSiblingFunction={callSiblingFunction}
        />
      </DrawerContent>
    </Drawer>
  );
}
