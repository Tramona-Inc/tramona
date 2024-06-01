import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface BookingCancellationEmailProps {
  userName: string;
  confirmationNumber: string;
  dates: { from: string, to: string };
  property: string;
  reason: string;
  refund: number;
}

export default function BookingCancellationEmail({ 
  userName = "User", 
  confirmationNumber = "ABC123456", 
  dates = {from: '06-01-2024', to: '06-02-2024'},
  property = "Property",
  reason = "Reason",
  refund = 0,
}: BookingCancellationEmailProps) {
  return (
    <Layout title_preview="Booking Modification">
      <div className="p-6 bg-white border-b border-gray-300">
        <div className="mb-4" style={{ display: 'inline-block' }}>
          <img
            src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
            alt="Tramona Logo"
            style={{ width: '24px', verticalAlign: 'middle' }}
          />
          <span className="ml-2 text-green-800 font-bold text-lg" style={{ verticalAlign: 'middle' }}>Tramona</span>
        </div>
        <div className="my-4 mx-auto w-full" style={{ borderBottom: '2px solid #e0e0e0' }}></div>
        <Text className="text-3xl text-left mb-8">
          Your booking at {property} for {dates.from} to {dates.to} has been canceled
        </Text>
        <Text className="text-left mb-4">
          Hi {userName},
        </Text>
        <Text className="text-left mb-4">
          Your booking for {property} for the dates of {dates.from} to {dates.to} has been canceled for {reason}.
        </Text>
        <Text className="text-left mb-4">
          (info if there will be a refund or not, depending on cancellation policy, 
        display refund amount if there is) 
        </Text>
        <Text className="text-left mb-4">
          If you believe this is an error please immediately contact our support team and we will assist you. 
        </Text>
        <Text className="text-left m-0 p-0">
          Best,
        </Text>
        <Text className="text-left m-0 p-0 mb-8">
          The Tramona Team
        </Text>
        <Button
          href="https://www.tramona.com/help-center"
          className="bg-green-900 text-white text-center py-3 px-6 text-lg rounded-md mb-6 w-11/12 mx-auto"
        >
          Contact Us
        </Button>
        <div className="my-4 mx-auto w-full" style={{ borderBottom: '2px solid #e0e0e0' }}></div>
        <div style={{ paddingTop: '16px', overflow: 'hidden' }}>
        <div style={{ float: 'left' }}>
          <img
            src="https://www.tramona.com/assets/images/email-images/tramona_wbg.png"
            alt="Tramona Logo"
            style={{ width: '32px' }}
          />
        </div>
        <div style={{ float: 'right' }}>
          <a href="https://www.instagram.com/shoptramona/" style={{ display: 'inline-block', marginLeft: '16px', color: "black" }}>
            <img
            src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
            alt="Tramona Logo"
            style={{ width: '32px' }}
            />
          </a>
          <a href="https://www.facebook.com/ShopTramona" style={{ display: 'inline-block', marginLeft: '16px', color: "black" }}>
            <img
            src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
            alt="Tramona Logo"
            style={{ width: '32px' }}
            />
          </a>
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
      </div>
    </Layout>
  );
}