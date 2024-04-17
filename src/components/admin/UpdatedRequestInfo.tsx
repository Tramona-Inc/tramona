import { useEffect, useState } from "react";
import { api } from "@/utils/api";
import { type Request } from "@/server/db/schema";
import { formatCurrency, formatDateRange } from "@/utils/utils";

export default function RequestRefreshForm({
  afterSubmit,
  request,
}: {
  afterSubmit?: () => void;
  request: Request;
}) {
  const [updatedRequestInfo, setUpdatedRequestInfo] = useState<{
    preferences?: string;
    updatedPriceNightlyUSD?: number;
    propertyLinks?: string[];
  }>({});

  const { data, isLoading, isError } =
    api.requests.getUpdatedRequestInfo.useQuery(
      {
        requestId: request.id,
      },
      {
        enabled: !!request.id,
      },
    );

  useEffect(() => {
    if (data) {
      setUpdatedRequestInfo({
        preferences: data.preferences ?? undefined,
        updatedPriceNightlyUSD: data.updatedPriceNightlyUSD ?? undefined,
        propertyLinks: data.propertyLinks ?? [],
      });
    }
  }, [data]);

  if (isLoading) {
    return <div>Loading updated information...</div>;
  }

  if (isError) {
    return <div>Failed to load updated information.</div>;
  }

  return (
    <section className="mx-auto max-w-2xl rounded-lg bg-white px-4 py-6 shadow sm:p-6">
      <h1 className="mb-4 text-center text-xl font-bold text-gray-800">
        Updated Request Details
      </h1>

      {updatedRequestInfo.updatedPriceNightlyUSD && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Price Preference:
          </h2>
          <p className="text-gray-600">
            {formatCurrency(updatedRequestInfo.updatedPriceNightlyUSD+request.maxTotalPrice)} per
            night
          </p>
        </div>
      )}

      {updatedRequestInfo.preferences && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            Additional Preferences:
          </h2>
          <p className="text-gray-600">{updatedRequestInfo.preferences}</p>
        </div>
      )}

      {updatedRequestInfo.propertyLinks &&
        updatedRequestInfo.propertyLinks.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700">
              Property Links:
            </h2>
            <ul className="list-disc pl-5 text-gray-600">
              {updatedRequestInfo.propertyLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link}
                    className="text-blue-500 hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Link {index + 1}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

      <hr className="my-6 border-t border-gray-200" />
      <div>
        <h2 className="mb-4 text-center text-xl font-semibold text-gray-800">
          Original Request Information
        </h2>
        <ul className="space-y-2 list-disc pl-5 text-gray-600">
          <li>
            <strong>Max total price:</strong>{" "}
            {formatCurrency(request.maxTotalPrice)}
          </li>
          <li>
            <strong>Location:</strong> {request.location}
          </li>
          <li>
            <strong>Dates:</strong>{" "}
            {formatDateRange(request.checkIn, request.checkOut)}
          </li>
          <li>
            <strong>Number of guests:</strong> {request.numGuests}
          </li>
          <li>
            <strong>Minimum number of bedrooms:</strong>{" "}
            {request.minNumBedrooms}
          </li>
          <li>
            <strong>Minimum number of beds:</strong> {request.minNumBeds}
          </li>
          <li>
            <strong>Preferred property type:</strong> {request.propertyType}
          </li>
          <li>
            <strong>Notes:</strong> {request.note}
          </li>
        </ul>
      </div>
    </section>
  );
}
