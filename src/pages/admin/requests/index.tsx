import { api } from "@/utils/api";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPrice } from "@/utils/format";
import DashboardLayout from "@/components/_common/Layout/DashboardLayout";

// Helper function to adjust date for timezone
const adjustDate = (date: Date) => {
  const adjusted = new Date(date);
  adjusted.setDate(adjusted.getDate() + 1);
  return adjusted;
};

export default function RequestToBookPage() {
  const { data, isLoading, error } = api.requestsToBook.getAdminRequestsToBook.useQuery();

  const content = (
    <div className="max-w-7xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Booking Requests</CardTitle>
        </CardHeader>
      </Card>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4">Active Requests</h2>
          <div className="grid gap-4">
            {data?.activeRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.propertyName}</h3>
                    <p className="text-sm text-gray-600">
                      Location: {request.propertyCity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Guest: {request.guestName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dates: {adjustDate(request.checkIn).toLocaleDateString()} - 
                      {adjustDate(request.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Guests: {request.numGuests}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: {formatPrice(request.calculatedTravelerPrice)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {request.isDirectListing ? 'Direct Listing' : 'Platform Listing'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {data?.activeRequests.length === 0 && (
              <p className="text-gray-500 text-center">No active requests</p>
            )}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">Past Requests</h2>
          <div className="grid gap-4">
            {data?.pastRequests.map((request) => (
              <Card key={request.id} className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{request.propertyName}</h3>
                    <p className="text-sm text-gray-600">
                      Location: {request.propertyCity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Guest: {request.guestName}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dates: {adjustDate(request.checkIn).toLocaleDateString()} - 
                      {adjustDate(request.checkOut).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Guests: {request.numGuests}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: {formatPrice(request.calculatedTravelerPrice)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      request.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {request.status}
                    </span>
                    <span className="text-sm text-gray-500">
                      {request.isDirectListing ? 'Direct Listing' : 'Platform Listing'}
                    </span>
                  </div>
                </div>
              </Card>
            ))}
            {data?.pastRequests.length === 0 && (
              <p className="text-gray-500 text-center">No past requests</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="text-center p-4">Loading...</div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="text-center text-red-500 p-4">Error: {error.message}</div>
      </DashboardLayout>
    );
  }

  return <DashboardLayout>{content}</DashboardLayout>;
}