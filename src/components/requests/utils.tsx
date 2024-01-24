import { type inferRouterOutputs } from "@trpc/server";
import { type AppRouter } from "@/server/api/root";

export type RequestWithDetails =
  inferRouterOutputs<AppRouter>["requests"]["getMyRequests"][
    | "activeRequests"
    | "inactiveRequests"][number];

export function getRequestStatus(request: RequestWithDetails) {
  if (request.numOffers === 0) return "pending";
  if (request.resolvedAt) {
    return request.numOffers === 0 ? "rejected" : "booked";
  }
  return request.numOffers === 0 ? "pending" : "accepted";
}
