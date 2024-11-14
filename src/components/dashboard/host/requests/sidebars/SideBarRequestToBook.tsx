import React, { useState } from "react";
import { api } from "@/utils/api";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import EmptyRequestState from "./EmptyRequestState";
import Link from "next/link";
import { useRouter } from "next/router";

function SidebarRequestToBook({
  selectedOption,
}: {
  selectedOption: "normal" | "outsidePriceRestriction";
}) {
  const router = useRouter();

  const { data: properties, isLoading } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery();

  const [selectedPropertyId, setSelectedPropertyId] = useState<null | number>();

  const handlePropertyClick = (propertyId: number) => {
    setSelectedPropertyId(propertyId);
    void router.push(
      `/host/requests?tabs=request-to-book&propertyId=${propertyId}`,
    );
  };

  return (
    <div>
      {!isLoading ? (
        properties && properties.length > 0 ? (
          <div className="flex flex-col gap-y-2">
            {properties.map(
              (property) =>
                property.requestsToBook.length > 0 && (
                  <div
                    key={property.id}
                    onClick={() => handlePropertyClick(property.id)}
                    className={`${selectedPropertyId === property.id ? "bg-primaryGreen text-white" : ""} pointer flex flex-row justify-between gap-x-3 rounded-xl border p-3 py-5`}
                  >
                    <div className="text-wrap cursor-pointer">
                      {property.name}
                    </div>
                    <p className="text-nowrap flex flex-row text-xs">
                      {property.requestsToBook.length} Requests
                    </p>
                  </div>
                ),
            )}
          </div>
        ) : (
          <EmptyRequestState />
        )
      ) : (
        <SidebarPropertySkeleton />
      )}
    </div>
  );
}

export default SidebarRequestToBook;

// function SidebarProperty({
//   propertyData,
//   selectedProperty,
//   setSelectedProperty,
// }: {
//   propertyData: {
//     property: Property;
//     requestToBook: RequestsToBook[];
//   };
//   selectedProperty: number | null;
//   setSelectedProperty: (property: number) => void;
// }) {
//   const href = `/host/requests-to-book/${propertyData.property.id}`;

//   const isSelected = selectedProperty === propertyData.property.id;
//   return (
//     <Link href={href} className="mb-4 block">
//       <div
//         className={`flex items-center gap-2 rounded-lg p-4 hover:bg-muted ${
//           isSelected ? "bg-muted" : ""
//         }`}
//         onClick={() => setSelectedProperty(propertyData.property.id)}
//       >
//         <Home className="h-8 w-8 text-gray-600" />
//         <div className="flex-1">
//           <h3 className="font-semibold">{propertyData.property.name}</h3>
//           <Badge size="md">
//             {plural(propertyData.requestToBook.length, "request")}
//           </Badge>
//         </div>
//       </div>
//     </Link>
//   );
// }
