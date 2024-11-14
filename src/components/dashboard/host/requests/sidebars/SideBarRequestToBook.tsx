import React from "react";
import { api } from "@/utils/api";
import SidebarPropertySkeleton from "./SidebarPropertySkeleton";
import EmptyRequestState from "./EmptyRequestState";
import Link from "next/link";

function SidebarRequestToBook({
  selectedOption,
}: {
  selectedOption: "normal" | "outsidePriceRestriction";
}) {
  const { data: properties, isLoading } =
    api.requestsToBook.getAllRequestToBookProperties.useQuery();

  return (
    <div>
      {!isLoading ? (
        properties && properties.length > 0 ? (
          <div className="flex flex-col">
            {properties.map((property) => (
              <Link key={property.id} href={`${property.id}`}>
                <div className="flex flex-row gap-x-3 rounded-xl border p-3">
                  <div className="text-wrap">{property.name}</div>
                  <p className="text-nowrap flex flex-row text-xs">
                    {property.requestsToBook.length} Requests
                  </p>
                </div>
              </Link>
            ))}
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
