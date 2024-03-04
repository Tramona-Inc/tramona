import { BookingAddedNotificationEmail } from "@/components/email-templates/BookingAddedNotificationEmail";
import { BookingConfirmationEmail } from "@/components/email-templates/BookingConfirmationEmail";
import { RequestCashback } from "@/components/email-templates/RequestCashback";
import { VerifyEmailLink } from "@/components/email-templates/VerifyEmail";
import { TramonaWelcomeEmail } from "@/components/email-templates/WelcomeEmail";

export default function Page() {
  return (
    <div className="space-y-4 p-4">
      <BookingAddedNotificationEmail
        checkIn="Mar 20"
        checkOut="Mar 22"
        description="This is the description"
        originalPrice={200}
        propertyImageLink="https://a0.muscache.com/im/pictures/01ad1e74-eb62-4224-8847-48c53b1e3571.jpg?im_w=720"
        tramonaPrice={180}
        tripDetailLink="https://tramona.com"
        userName="Ben"
      />

      <BookingConfirmationEmail />

      <VerifyEmailLink />

      <RequestCashback
        email="ben@bne.ben"
        name="Ben"
        phoneNumber="5103625617"
        transactions={[
          {
            cashbackEarned: 125,
            createdAt: new Date(),
            earningStatus: "cancelled",
            id: 1,
            offer: { totalPrice: 123 },
            referralCode: "41h234l",
            referee: { name: "God" },
          },
        ]}
      />

      <TramonaWelcomeEmail />
    </div>
  );
}
