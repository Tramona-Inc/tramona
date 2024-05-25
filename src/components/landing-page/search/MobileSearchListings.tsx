import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import SearchPropertiesMap from "./SearchPropertiesMap";
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
    <div className="absolute bottom-6 left-32 z-20 ">
      <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen} modal={false}>
        <DrawerTrigger>
          <Button
            variant="default"
            onClick={() => {
              setIsDrawerOpen(true);
            }}
          >
            See Properties List
          </Button>
        </DrawerTrigger>
        <DrawerClose />
        <DrawerContent className=" ">
          <DrawerHeader>
            {!isFilterUndefined && (
              <DrawerDescription>Places within the map area</DrawerDescription>
            )}
          </DrawerHeader>
          <div className={isFilterUndefined ? `h-[750px]` : `h-[480px]`}>
            <SearchListings isFilterUndefined={isFilterUndefined} />
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
