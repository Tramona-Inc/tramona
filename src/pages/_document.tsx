import { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
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
        <Script id="PlacesAutocomplete" strategy="afterInteractive">
          {`
    window.PlacesAutocomplete = function() {
    }
  `}
        </Script>
      </body>
    </Html>
  );
}
