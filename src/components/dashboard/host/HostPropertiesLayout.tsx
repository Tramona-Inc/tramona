import HostPropertyForm from "@/components/host/HostPropertyForm";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pencil, PlusIcon } from "lucide-react";
import { useState } from "react";
import HostProperties from "./HostProperties";

export default function HostPropertiesLayout({
  children,
}: React.PropsWithChildren) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex">
      <div className="sticky top-20 h-screen-minus-header-n-footer w-96 border-r px-4 py-8">
        <ScrollArea>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">24% currently vacant</p>
          <div className="my-4">
            <NewPropertyBtn open={open} setOpen={setOpen} />
            {/* <Link href="/host-onboarding">
            <Button variant="secondaryLight" className="font-semi bg-white">
              <PlusIcon />
              New Listing
            </Button>
          </Link> */}
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="listed">
              <AccordionTrigger>Listed</AccordionTrigger>
              <AccordionContent>
                <HostProperties />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="drafts">
              <AccordionTrigger>Drafts</AccordionTrigger>
              <AccordionContent>
                <p>Drafts stuff</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="archive">
              <AccordionTrigger>Archives</AccordionTrigger>
              <AccordionContent>
                <p>Archives stuff</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </ScrollArea>
      </div>
      <div className="flex-1">
        {children ? (
          <div className="mx-auto my-8 min-h-screen-minus-header-n-footer max-w-4xl rounded-2xl border">
            <div className="grid grid-cols-1">{children}</div>
          </div>
        ) : (
          <div className="hidden sm:block">
            <div className="flex min-h-screen-minus-header-n-footer items-center justify-center">
              <p className="font-medium text-muted-foreground">
                Select a property to view more details
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function NewPropertyBtn({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="bg-white pl-3 font-semibold"
          variant="secondaryLight"
        >
          <PlusIcon />
          New Listing
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add your Property</DialogTitle>
          <DialogDescription>
            Please input all the information necessary for travelers to start
            booking with your property.
          </DialogDescription>
        </DialogHeader>
        <HostPropertyForm setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

export function HostPropertyEditBtn() {
  return (
    <Button variant="darkOutline" className="border-zinc-300 font-bold">
      <Pencil />
      Enter edit mode
    </Button>
  );
}
