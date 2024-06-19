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
import HostProperties from "./HostProperties";
import Link from "next/link";
import { useHostOnboarding } from "@/utils/store/host-onboarding";
import { api } from "@/utils/api";

export default function HostPropertiesLayout({
  children,
}: React.PropsWithChildren) {
  // const [open, setOpen] = useState(false);

  const setProgress = useHostOnboarding((state) => state.setProgress);

  const setPropertyType = useHostOnboarding((state) => state.setPropertyType);
  const setMaxGuests = useHostOnboarding((state) => state.setMaxGuests);
  const setBedrooms = useHostOnboarding((state) => state.setBedrooms);
  const setBeds = useHostOnboarding((state) => state.setBeds);
  const setBathrooms = useHostOnboarding((state) => state.setBathrooms);
  const setSpaceType = useHostOnboarding((state) => state.setSpaceType);
  const setLocation = useHostOnboarding((state) => state.setLocation);
  const setCheckInType = useHostOnboarding((state) => state.setCheckInType);
  const setOtherCheckInType = useHostOnboarding(
    (state) => state.setOtherCheckInType,
  );
  const setCheckIn = useHostOnboarding((state) => state.setCheckIn);
  const setCheckOut = useHostOnboarding((state) => state.setCheckOut);
  const setAmenities = useHostOnboarding((state) => state.setAmenities);
  const setOtherAmenities = useHostOnboarding(
    (state) => state.setOtherAmenities,
  );
  const setImageUrls = useHostOnboarding((state) => state.setImageUrls);
  const setTitle = useHostOnboarding((state) => state.setTitle);
  const setDescription = useHostOnboarding((state) => state.setDescription);
  const setPetsAllowed = useHostOnboarding((state) => state.setPetsAllowed);
  const setSmokingAllowed = useHostOnboarding(
    (state) => state.setSmokingAllowed,
  );
  const setOtherHouseRules = useHostOnboarding(
    (state) => state.setOtherHouseRules,
  );

  function setStatesDefault() {
    setPropertyType("Apartment"),
      setMaxGuests(1),
      setBedrooms(1),
      setBeds(1),
      setBathrooms(1),
      setSpaceType("Entire place"),
      setLocation({
        street: "",
        apt: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
      }),
      setCheckInType("self"),
      setOtherCheckInType(false),
      setCheckIn("00:00"),
      setCheckOut("00:00"),
      setAmenities([]),
      setOtherAmenities([]),
      setImageUrls([]),
      setTitle(""),
      setDescription(""),
      setPetsAllowed(false),
      setSmokingAllowed(false),
      setOtherHouseRules("");
  }

  const { data: properties } = api.properties.getHostProperties.useQuery();

  const listedProperties = properties?.filter(
    (property) => property.propertyStatus === "Listed",
  );
  const archivedProperties = properties?.filter(
    (property) => property.propertyStatus === "Archived",
  );
  const draftedProperties = properties?.filter(
    (property) => property.propertyStatus === "Drafted",
  );

  return (
    <div className="flex">
      <div className="sticky top-20 h-screen-minus-header-n-footer w-96 overflow-auto border-r px-4 py-8">
        <ScrollArea>
          <h1 className="text-3xl font-bold">Properties</h1>
          <p className="text-muted-foreground">24% currently vacant</p>
          <div className="my-4">
            {/* <NewPropertyBtn open={open} setOpen={setOpen} /> */}
            <Link href="/host-onboarding">
              <Button
                variant="secondaryLight"
                className="font-semi bg-white"
                onClick={() => {
                  setStatesDefault();
                  setProgress(0);
                }}
              >
                <PlusIcon />
                New Listing
              </Button>
            </Link>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="listed">
              <AccordionTrigger>
                Listed {listedProperties?.length}
              </AccordionTrigger>
              <AccordionContent>
                <HostProperties properties={listedProperties ?? null} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="drafts">
              <AccordionTrigger>
                Drafts {draftedProperties?.length}
              </AccordionTrigger>
              <AccordionContent>
                <HostProperties properties={draftedProperties ?? null} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="archive">
              <AccordionTrigger>
                Archives {archivedProperties?.length}
              </AccordionTrigger>
              <AccordionContent>
                <HostProperties properties={archivedProperties ?? null} />
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

export function HostPropertyEditBtn({
  editing,
  setEditing,
  onSubmit,
}: {
  editing: boolean;
  setEditing: (editing: boolean) => void;
  onSubmit?: () => void;
}) {
  return (
    <div className="fixed bottom-20 right-4 z-50 sm:static">
      {editing ? (
        <div className="space-x-2">
          <Button variant="secondary" onClick={() => setEditing(!editing)}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            className="rounded-full bg-white font-bold shadow-md sm:rounded-lg sm:border-2 sm:shadow-none"
            onClick={() => {
              setEditing(!editing);
              onSubmit?.();
            }}
            type="button"
          >
            Done
          </Button>
        </div>
      ) : (
        <Button
          variant="secondary"
          className="rounded-full bg-white font-bold shadow-md sm:rounded-lg sm:border-2 sm:shadow-none"
          onClick={() => setEditing(!editing)}
          type="button"
        >
          <Pencil size={20} />
          Enter edit mode
        </Button>
      )}
    </div>
  );
}
