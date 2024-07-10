// import { Dialog } from "@/components/ui/dialog";
// import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import { PlusIcon } from "lucide-react";
// import AdminOfferForm from "../admin/AdminOfferForm";
// import { useState } from "react";

// export default function AddUnclaimedOffer() {
//   const [isOpen, setIsOpen] = useState(false);

//   return (
//     <Dialog open={isOpen} onOpenChange={setIsOpen}>
//       <DialogTrigger className="flex flex-row gap-x-1">
//         <p>Add new offer</p>
//         <PlusIcon />
//       </DialogTrigger>
//       <DialogContent>
//         <AdminOfferForm afterSubmit={() => setIsOpen(false)} />
//       </DialogContent>
//     </Dialog>
//   );
// }

import { Dialog } from "@/components/ui/dialog";
import { DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import AdminOfferForm from "../admin/AdminOfferForm";
import { useState } from "react";
import { type Request } from "@/server/db/schema";
import { type OfferWithProperty } from "../requests/[id]/OfferCard";

export default function AddUnclaimedOffer() {
  const [isOpen, setIsOpen] = useState(false);

  // Hardcoded request
  const hardcodedRequest: Request = {
    id: 310,
    madeByGroupId: 14,
    checkIn: new Date("2024-07-10"),
    checkOut: new Date("2024-07-12"),
    location: "123",
    numGuests: 1,
    maxTotalPrice: 1223,
    createdAt: new Date("2024-07-10 00:33:16.985992+00"),
    resolvedAt: null,
    minNumBedrooms: 1,
    minNumBeds: 1,
    note: "Test request",
    propertyType: "Apartment",
    requestGroupId: 14,
    minNumBathrooms: 1,
    airbnbLink: null,
    lat: null,
    lng: null,
    radius: null,
    latLngPoint: null
  };

  // Hardcoded offer
  const hardcodedOffer: OfferWithProperty = {
    id: 310,
    totalPrice: 1223,
    createdAt: new Date(),
    acceptedAt: null,
    tramonaFee: 50,
    property: {
      id: 777,
      name: "Test Property",
      hostId: "123",
      hostName: "Test Host",
      address: "123 Test St, New York, NY",
      propertyType: "Apartment",
      maxNumGuests: 2,
      numBedrooms: 1,
      numBeds: 1,
      numBathrooms: 1,
      avgRating: 4.5,
      numRatings: 10,
      amenities: ["WiFi"],
      about: "A cozy apartment in the heart of New York",
      originalNightlyPrice: 200,
      imageUrls: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      createdAt: new Date(),
      latLngPoint: null,
      hostTeamId: null,
      roomType: "Other",
      latitude: 0,
      longitude: 0,
      city: "",
      originalListingUrl: null,
      checkInInfo: null,
      checkInTime: null,
      checkOutTime: null,
      otherAmenities: [],
      petsAllowed: null,
      smokingAllowed: null,
      otherHouseRules: null,
      airbnbUrl: null,
      airbnbMessageUrl: null,
      areaDescription: null,
      mapScreenshot: null,
      cancellationPolicy: null,
      isPrivate: false,
      propertyStatus: null,
      airbnbBookUrl: null,
      hostImageUrl: null,
      pricingScreenUrl: null,
      hostProfilePic: null,
      hostawayListingId: null,
      host: null
    },
    checkIn: new Date(),
    checkOut: new Date(),
    request: null
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="flex flex-row gap-x-1">
        <p>Add new offer</p>
        <PlusIcon />
      </DialogTrigger>
      <DialogContent>
        <AdminOfferForm 
          afterSubmit={() => setIsOpen(false)} 
          request={hardcodedRequest}
          offer={hardcodedOffer}
        />
      </DialogContent>
    </Dialog>
  );
}