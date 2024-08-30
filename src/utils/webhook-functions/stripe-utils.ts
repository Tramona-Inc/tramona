import { stripeWithSecretKey } from "@/server/api/routers/stripeRouter";

export async function createSetupIntent({
  customerId,
  paymentMethodId,
  userId,
}: {
  customerId: string;
  paymentMethodId: string;
  userId: string;
}) {
  //first we need to create the setup Inten using information from the booking

  const setupIntent = await stripeWithSecretKey.setupIntents.create({
    customer: customerId,
    payment_method: paymentMethodId,
  });
}
