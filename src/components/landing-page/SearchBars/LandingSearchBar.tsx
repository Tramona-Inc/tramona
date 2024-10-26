import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  MapPinIcon,
  CalendarIcon,
  Users2Icon,
  DollarSignIcon,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RequestSubmittedDialog from "@/components/landing-page/SearchBars/DesktopRequestComponents/RequestSubmittedDialog";
import { api } from "@/utils/api";

const locations = [
  {
    name: "Atlanta",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1575917649705-5b59aaa12e6b?w=300&h=200&fit=crop",
  },
  {
    name: "Austin",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1531218150217-54595bc2b934?w=300&h=200&fit=crop",
  },
  {
    name: "Denver",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1546156929-a4c0ac411f47?w=300&h=200&fit=crop",
  },
  {
    name: "Puerto Rico",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1579687196544-08ae57ab5c11?w=300&h=200&fit=crop",
  },
  {
    name: "Florence",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1541370976299-4d24ebbc9077?w=300&h=200&fit=crop",
  },
  {
    name: "Seattle",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1438401171849-74ac270044ee?w=300&h=200&fit=crop",
  },
  {
    name: "Mykonos",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1601581875309-fafbf2d3ed3a?w=300&h=200&fit=crop",
  },
  {
    name: "Paris",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=300&h=200&fit=crop",
  },
  {
    name: "Porto",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7acaacd8b?w=300&h=200&fit=crop",
  },
  {
    name: "Bangkok",
    country: "Thailand",
    image:
      "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=300&h=200&fit=crop",
  },
  {
    name: "New York",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop",
  },
  {
    name: "Los Angeles",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1534190760961-74e8c1c5c3da?w=300&h=200&fit=crop",
  },
  {
    name: "Nashville",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1545419913-775e3e82c7db?w=300&h=200&fit=crop",
  },
  {
    name: "Orlando",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1575089776834-8be34696ffb9?w=300&h=200&fit=crop",
  },
  {
    name: "Chicago",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?w=300&h=200&fit=crop",
  },
  {
    name: "Venice",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1514890547357-a9ee288728e0?w=300&h=200&fit=crop",
  },
  {
    name: "Miami",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1589083130544-0d6a2926e519?w=300&h=200&fit=crop",
  },
  {
    name: "Barcelona",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1583422409516-2895a77efded?w=300&h=200&fit=crop",
  },
  {
    name: "Milan",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1610016302534-6f67f1c968d8?w=300&h=200&fit=crop",
  },
  {
    name: "Santorini",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop",
  },
  {
    name: "Nice",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1491166617655-0723a0999cfc?w=300&h=200&fit=crop",
  },
  {
    name: "Bali",
    country: "Indonesia",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=300&h=200&fit=crop",
  },
  {
    name: "Mexico City",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1518659526054-190340b32735?w=300&h=200&fit=crop",
  },
  {
    name: "London",
    country: "UK",
    image:
      "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=300&h=200&fit=crop",
  },
  {
    name: "Lisbon",
    country: "Portugal",
    image:
      "https://images.unsplash.com/photo-1580323956656-26bbb1206e34?w=300&h=200&fit=crop",
  },
  {
    name: "Cancún",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1552074284-5e88ef1aef18?w=300&h=200&fit=crop",
  },
  {
    name: "Cannes",
    country: "France",
    image:
      "https://images.unsplash.com/photo-1593014109521-48ea09f22592?w=300&h=200&fit=crop",
  },
  {
    name: "Madrid",
    country: "Spain",
    image:
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=300&h=200&fit=crop",
  },
  {
    name: "Rome",
    country: "Italy",
    image:
      "https://images.unsplash.com/photo-1525874684015-58379d421a52?w=300&h=200&fit=crop",
  },
  {
    name: "Athens",
    country: "Greece",
    image:
      "https://images.unsplash.com/photo-1555993539-1732b0258235?w=300&h=200&fit=crop",
  },
  {
    name: "Cabo San Lucas",
    country: "Mexico",
    image:
      "https://images.unsplash.com/photo-1610641818989-c2051b5e2cfd?w=300&h=200&fit=crop",
  },
  {
    name: "Honolulu",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1507876466758-bc54f384809c?w=300&h=200&fit=crop",
  },
  {
    name: "New Orleans",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1549965738-e1aaf1168943?w=300&h=200&fit=crop",
  },
  {
    name: "San Diego",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1538689621163-f5be0ad13ec7?w=300&h=200&fit=crop",
  },
  {
    name: "Washington DC",
    country: "USA",
    image:
      "https://images.unsplash.com/photo-1617581629397-a72507c3de9e?w=300&h=200&fit=crop",
  },
];

export default function LandingSearchBar() {
  const [activeTab, setActiveTab] = useState("search");
  const [requestSubmittedDialogOpen, setRequestSubmittedDialogOpen] =
    useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [madeByGroupId, setMadeByGroupId] = useState();
  const [_inviteLink, setInviteLink] = useState(null);

  const form = useForm({
    defaultValues: {
      destination: "",
      dates: "",
      price: "",
      guests: "",
    },
  });

  const inviteLinkQuery = api.groups.generateInviteLink.useQuery(
    { groupId: madeByGroupId },
    { enabled: madeByGroupId !== undefined },
  );

  useEffect(() => {
    if (inviteLinkQuery.data) {
      setInviteLink(inviteLinkQuery.data.link);
    }
  }, [inviteLinkQuery.data]);

  async function onSubmit(data) {
    if (activeTab === "name") {
      setRequestSubmittedDialogOpen(true);
      setShowConfetti(true);
    } else {
      console.log("Regular search submission:", data);
    }
  }

  return (
    <div className="mx-auto min-w-[815px] max-w-5xl rounded-2xl border-2 border-gray-300 bg-white p-4 shadow-lg sm:p-6">
      <div className="mb-4 flex">
        <button
          className={`flex-1 py-2 text-sm sm:text-base ${
            activeTab === "search"
              ? "border-b-2 border-primaryGreen font-semibold text-primaryGreen"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("search")}
        >
          Search Deals
        </button>
        <button
          className={`flex-1 py-2 text-sm sm:text-base ${
            activeTab === "name"
              ? "border-b-2 border-primaryGreen font-semibold text-primaryGreen"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("name")}
        >
          Name Your Own Price
        </button>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="mb-6">
            <div className="flex flex-col space-y-4 rounded-lg border border-black bg-white p-2 sm:flex-row sm:items-center sm:space-y-0 sm:rounded-full">
              <div className="flex w-full items-center sm:w-64 sm:px-2">
                <MapPinIcon className="mr-2 h-4 w-4 text-primaryGreen sm:h-5 sm:w-5" />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-0 bg-transparent text-sm focus:ring-0">
                            <SelectValue placeholder="Enter your destination" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-[300px]">
                          {locations.map((location) => (
                            <SelectItem
                              key={location.name}
                              value={location.name}
                            >
                              {location.name}, {location.country}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              <div className="hidden sm:block sm:h-8 sm:w-px sm:bg-gray-300" />

              <div className="flex w-full items-center sm:w-56 sm:px-4">
                <CalendarIcon className="mr-2 h-4 w-4 text-primaryGreen sm:h-5 sm:w-5" />
                <FormField
                  control={form.control}
                  name="dates"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-0 bg-transparent text-sm focus:ring-0">
                            <SelectValue placeholder="Select dates" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">Next 7 days</SelectItem>
                          <SelectItem value="2">Next 14 days</SelectItem>
                          <SelectItem value="3">Next 30 days</SelectItem>
                          <SelectItem value="4">Next 60 days</SelectItem>
                          <SelectItem value="5">Custom dates</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {activeTab === "name" && (
                <>
                  <div className="hidden sm:block sm:h-8 sm:w-px sm:bg-gray-300" />
                  <div className="flex w-full items-center sm:w-48 sm:px-4">
                    <DollarSignIcon className="mr-2 h-4 w-4 text-primaryGreen sm:h-5 sm:w-5" />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Price"
                              className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </>
              )}

              <div className="hidden sm:block sm:h-8 sm:w-px sm:bg-gray-300" />

              <div className="flex w-full items-center sm:w-48 sm:px-4">
                <Users2Icon className="mr-2 h-4 w-4 text-primaryGreen sm:h-5 sm:w-5" />
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Add guests"
                          className="border-0 bg-transparent text-sm focus:outline-none focus:ring-0"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Button
                type="submit"
                className="w-full rounded-full px-8 py-2 text-white sm:w-auto"
              >
                Find Deals
              </Button>
            </div>
          </div>
        </form>
      </Form>

      <div className="mb-4 flex flex-col items-center space-y-2 text-xs text-gray-600 sm:flex-row sm:justify-center sm:space-x-8 sm:space-y-0 sm:text-sm">
        <div className="flex items-center gap-2 font-bold">
          <Check size={24} className="h-4 w-4 text-primaryGreen" />
          Flexible Cancelation Policies
        </div>
        <div className="flex items-center gap-2 font-bold">
          <Check size={24} className="h-4 w-4 text-primaryGreen" />
          Same properties you see on Airbnb for less
        </div>
        <div className="flex items-center gap-2 font-bold">
          <Check size={24} className="h-4 w-4 text-primaryGreen" />
          Best Prices Anywhere
        </div>
      </div>

      <div className="my-4 h-[1px] w-full bg-black" />

      <div className="text-center text-xs text-gray-600 sm:text-sm">
        Search the best deals available{" "}
        <span className="text-primaryGreen underline">anywhere</span> on short
        term rentals right now
      </div>

      <RequestSubmittedDialog
        open={requestSubmittedDialogOpen}
        setOpen={setRequestSubmittedDialogOpen}
        showConfetti={showConfetti}
        madeByGroupId={madeByGroupId}
        location={form.getValues("destination")}
        isRequestsPage={false}
      />
    </div>
  );
}
