
import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import GoogleTagManager from "../components/analytics/GoogleTagManager";
import MicrosoftClarityTag from "@/components/analytics/MicrosoftClarityTag";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <MicrosoftClarityTag/>
          <GoogleTagManager />
        </Head>
        <body>
          <Main />
          <NextScript />
          <Script
            defer
            async
            id="googlemaps"
            type="text/javascript"
            strategy="afterInteractive"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places&callback=PlacesAutocomplete&loading=async`}
          />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
