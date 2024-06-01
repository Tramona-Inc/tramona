import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

interface PostStayEmailProps {
  userName: string;
  property: string;
  house: string;
}

export default function PostStayEmail({ 
  userName = "User", 
  property = "Property", 
  house = "House",
}: PostStayEmailProps) {
  return (
    <Layout title_preview="Post stay feedback">
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
          How was you recent stay at {property}?
        </Text>
        <Text className="text-left mb-4">
          Hi {userName},
        </Text>
        <Text className="text-left mb-4">
          We hope you had a great time at {house} and hope that you make it home safely. 
        </Text>
        <Text className="text-left mb-4">
            How was your stay with us? It would help us out a lot if you left a review. 
            I put the link at the bottom of this email so it’s easy to get to. Any feedback you have is greatly appreciated.
        </Text>
        <Text className="text-left mb-4">
            We wanted to thank you again for letting us be part of your vacation experience. 
            Safe travels and hope to hear from you soon!
        </Text>
        <Text className="text-left m-0 p-0">
            Best,
        </Text>
        <Text className="text-left m-0 p-0 mb-8">
            Tramona Team
        </Text>
        <Button
          href="https://www.tramona.com/"
          className="bg-green-900 text-white text-center py-3 px-6 text-lg rounded-md mb-6 w-11/12 mx-auto"
        >
          Leave a Review
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
            {/* <Instagram /> */}
            <img
            src="https://www.tramona.com/assets/images/email-images/instagram_wbg.png"
            alt="Tramona Logo"
            style={{ width: '32px' }}
            />
          </a>
          <a href="https://www.facebook.com/tramona" style={{ display: 'inline-block', marginLeft: '16px', color: "black" }}>
            {/* <Facebook /> */}
            <img
            src="https://www.tramona.com/assets/images/email-images/facebook_wbg.png"
            alt="Tramona Logo"
            style={{ width: '32px' }}
            />
          </a>
          {/* <a href="https://www.linkedin.com/company/tramona" style={{ display: 'inline-block', marginLeft: '16px', color: "black" }}>
            <Linkedin />
          </a> */}
        </div>
        <div style={{ clear: 'both' }}></div>
      </div>
      </div>
    </Layout>
  );
}
