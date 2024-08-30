// import { useState } from "react";
// import type { RouterOutputs } from "@/utils/api";
// import { useMediaQuery } from "@/components/_utils/useMediaQuery";
// import PropertyFinanceList from "@/components/host/finances/properties/PropertyFinanceList";
// import PropertiesEarningsChartOverview from "@/components/host/finances/properties/PropertiesEarningsChartOverview";

// export type HostProperties =
//   RouterOutputs["host"]["getAllHostProperties"][number];

// export default function PropertiesDashboard({
//   hostStripeConnectId,
//   isStripeConnectInstanceReady,
//   becameHostAt,
// }: {
//   hostStripeConnectId: string | null;
//   isStripeConnectInstanceReady: boolean;
//   becameHostAt: Date | undefined;
// }) {
//   const isMedium = useMediaQuery("(max-width: 1023px)");

//   const [selectedProperty, setSelectedProperty] =
//     useState<HostProperties | null>(null);

//   const handleSelectedPropertyChange = (property: HostProperties) => {
//     setSelectedProperty(property);
//     console.log("this is the selected propery ");
//     console.log(selectedProperty);
//   };

//   return (
//     <div className="flex w-full flex-col lg:flex-row-reverse">
//       <PropertyFinanceList
//         selectedProperty={selectedProperty}
//         onSelectProperty={handleSelectedPropertyChange}
//       />
//       {!isMedium && (
//         <div className="w-full">
//           <PropertiesEarningsChartOverview
//             selectedProperty={selectedProperty}
//           />
//         </div>
//       )}
//     </div>
//   );
// }
