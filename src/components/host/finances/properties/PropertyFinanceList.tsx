import Image from "next/image";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/utils/api";
import type { RouterOutputs } from "@/utils/api";

export type HostProperties =
  RouterOutputs["host"]["getAllHostProperties"][number];

function City({ lat, lng }: { lat: number; lng: number }) {
  const { data: city } = api.offers.getCity.useQuery({ lat, lng });
  return <span>{city ?? "Loading..."}</span>;
}

export default function PropertyFinanceList({
  selectedProperty,
  onSelectProperty,
}: {
  selectedProperty: HostProperties | null;
  onSelectProperty: (property: HostProperties) => void;
}) {
  const { data: properties } = api.host.getAllHostProperties.useQuery();

  useEffect(() => {
    if (properties && properties.length > 0 && !selectedProperty) {
      onSelectProperty(properties[0]!);
    }
  }, [properties, selectedProperty, onSelectProperty]);

  return (
    <div className="w-1/3">
      <Card>
        <CardHeader>
          <CardTitle>Properties ({properties?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 space-y-1 overflow-y-auto overflow-x-hidden">
            {properties ? (
              properties.map((property) => (
                <div
                  key={property.id}
                  className={`flex transform cursor-pointer items-center space-x-4 rounded p-2 transition-transform hover:bg-gray-50 ${
                    selectedProperty?.id === property.id
                      ? "translate-x-2 bg-primaryGreen-hover hover:bg-primaryGreen-hover"
                      : ""
                  }`}
                  onClick={() => onSelectProperty(property)}
                >
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg">
                    <Image
                      src={property.imageUrls[0]!}
                      alt="Property image"
                      fill
                      objectFit="cover"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{property.name}</p>
                    <p className="text-xs text-gray-500">
                      <City lat={property.latLngPoint.y} lng={property.latLngPoint.x} />
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div>No properties yet...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
