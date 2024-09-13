import {
  fetchConversationWithOffer,
  createConversationWithOfferHelper,
} from "@/server/api/routers/messagesRouter";
import { env } from "@/env";

const ADMIN_ID = env.TRAMONA_ADMIN_USER_ID;

export async function createConversationWithOfferAfterBooking({
  offerId,
  offerHostId,
  offerPropertyName,
  travelerId,
}: {
  offerId: string;
  offerHostId: string | null;
  offerPropertyName: string;
  travelerId: string;
}) {
  //check to see if the conversation already exist
  const conversationExistId = await fetchConversationWithOffer(
    travelerId,
    offerId,
  );
  console.log(conversationExistId, "converation exist");

  //determine if the conversation will be with the host or the admin
  const offerHostOrAllAdmins = offerHostId ? offerHostId : ADMIN_ID;

  // Create conversation with host if it doesn't exist
  if (!conversationExistId) {
    return await createConversationWithOfferHelper(
      travelerId,
      offerHostOrAllAdmins,
      offerPropertyName,
      offerId,
    );
  }
  return conversationExistId;
}
