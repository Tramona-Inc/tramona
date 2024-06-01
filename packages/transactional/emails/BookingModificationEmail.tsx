import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface BookingModificationEmailProps {
  userName: string;
  confirmationNumber: string;
  property: string;
  previousDates: { from: string, to: string };
  changedDates: { from: string, to: string };
}

export default function BookingModificationEmail({
  userName = "User",
  confirmationNumber = "ABC123456",
  property = "Property",
  previousDates = { from: '06-01-2024', to: '06-02-2024' },
  changedDates = { from: '06-03-2024', to: '06-04-2024' },
}: BookingModificationEmailProps) {
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
          Hi, there was a modification made to your booking {confirmationNumber}
        </Text>
        <Text className="text-left mb-4">
          Hi {userName},
        </Text>
        <Text className="text-left mb-4">
          There has been a change to your reservation:
        </Text>
        <Text className="text-left m-0 p-0">
          Reservation:
        </Text>
        <Text className="text-left m-0 p-0">
          {property}
        </Text>
        <Text className="text-left m-0 p-0 mb-4">
          {previousDates.from} to {previousDates.to}
        </Text>
        <Text className="text-left m-0 p-0">
          The change:
        </Text>
        <Text className="text-left m-0 p-0 mb-4">
          {changedDates.from} to {changedDates.to}
        </Text>
        <Text className="text-left mb-8">
          Please let us know if you have any questions or concerns regarding this change.
        </Text>
        <Button
          href="https://www.tramona.com/"
          className="bg-green-900 text-white text-center py-3 px-6 text-lg rounded-md mb-6 w-11/12 mx-auto"
        >
          Contact
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
            <a href="https://www.instagram.com/tramona" style={{ display: 'inline-block', marginLeft: '16px', color: "black" }}>
              <img
                src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
                alt="Instagram"
                style={{ width: '32px' }}
              />
            </a>
            <a href="https://www.facebook.com/tramona" style={{ display: 'inline-block', marginLeft: '16px', color: "black" }}>
              <img
                src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
                alt="Facebook"
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