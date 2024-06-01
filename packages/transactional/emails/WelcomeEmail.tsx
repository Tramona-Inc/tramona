import { Text, Button } from "@react-email/components";
import { Layout } from "./EmailComponents";

export default function WelcomeEmail({ name }: { name: string }) {
  return (
    <Layout title_preview="Welcome to Tramona">
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
        <Text className="text-3xl text-center font-bold mb-4">
          Welcome to Tramona, {name}!
        </Text>
        <Text className="text-left mb-4">
          Hello, my name is Blake Singleton, Co-founder and CEO of Tramona.
          Thank you for helping us make traveling easier than ever before.
        </Text>
        <Text className="text-left mb-4">
          Tramona was started with one goal in mind—allowing people to travel
          more for less, while cutting out fees in the process. (Did you know
          some of the bigger platforms charge around 20% per booking?) Every
          platform claims to give discounts, but after the fees, is it really a
          discount?
        </Text>
        <Text className="text-xl font-bold text-left mb-2">What is Tramona?</Text>
        <Text className="text-left mb-4">
          Tramona is a one-of-a-kind booking platform. Every time you book it
          will be a truly unique booking deal you can’t find anywhere else, on
          the same properties, you see everywhere else.
        </Text>
        <Text className="text-left mb-4">
          We have already allowed travelers to save <b>$250,000+</b> booking the same
          properties they find on other sites, on our site. Let's keep growing
          this number.
        </Text>
        <Text className="text-xl font-bold text-left mb-2">How does it work?</Text>
        <Text className="text-left mb-8">
          One of the biggest problems hosts face is vacancies due to market
          saturation, and as more people become hosts every day, the problem is
          worsening. This is where Tramona comes in. We allow travelers to
          submit an offer or a request. The host gets to match it, maximizing
          the dates booked hosts receive, while allowing travelers the chance to
          travel at lower prices. This makes Tramona the best place to book the
          best properties around the world.
        </Text>
        <table className="w-full border-collapse text-center mx-auto mb-8">
          <tbody>
            <tr>
              <td className="w-1/2 p-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  {/* <span style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 'xx-large' }}>
                    <MapPin />
                  </span> */}
                  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                    Send a request
                  </span>
                </div>
              </td>
              <td className="w-1/2 p-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  {/* <span style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 'xx-large' }}>
                    <CircleDollarSign />
                  </span> */}
                  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                    Submit an offer
                  </span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="w-1/2 p-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  {/* <span style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 'xx-large' }}>
                    <Users />
                  </span> */}
                  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                    Referral program
                  </span>
                </div>
              </td>
              <td className="w-1/2 p-2">
                <div className="bg-gray-100 p-3 rounded-lg">
                  {/* <span style={{ display: 'inline-block', verticalAlign: 'middle', fontSize: 'xx-large' }}>
                    <SquarePlay />
                  </span> */}
                  <span style={{ display: 'inline-block', verticalAlign: 'middle', marginLeft: '8px' }}>
                    Video tutorial
                  </span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <Button
          href="https://www.tramona.com/"
          className="bg-green-900 text-white text-center py-3 px-6 text-lg rounded-md mb-6 w-11/12 mx-auto"
        >
          Start Traveling
        </Button>
        <Text className="text-left m-0">Thanks,</Text>
        <Text className="text-left m-0">Blake Singleton, CEO</Text>
        <Text className="text-left mt-0 mb-6">
          Questions? Send them to us directly at <a href="mailto:info@tramona.com" className="text-black no-underline">info@tramona.com</a>
        </Text>
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
