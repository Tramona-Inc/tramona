import { env } from "@/env";
import Document, { Head, Html, Main, NextScript } from "next/document";
import Script from "next/script";
import { mulish } from "./_app";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <Script
            src={`https://maps.googleapis.com/maps/api/js?key=${env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places&callback=PlacesAutocomplete`}
            strategy="beforeInteractive"
          />
          <Script id="clarity-tag" strategy="afterInteractive">
            {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "lmawv9751s");
          `}
          </Script>

          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-WBTN40GDLM"
            strategy="beforeInteractive"
            async
          />
          <Script id="google-tag-config" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-WBTN40GDLM');
            `}
          </Script>

          <meta
            http-equiv="Content-Security-Policy"
            content="default-src * self blob: data: gap:; style-src * self 'unsafe-inline' blob: data: gap:; script-src * 'self' 'unsafe-eval' 'unsafe-inline' blob: data: gap:; object-src * 'self' blob: data: gap:; img-src * self 'unsafe-inline' blob: data: gap:; connect-src self * 'unsafe-inline' blob: data: gap:; frame-src * self blob: data: gap:;"
          />
        </Head>
        <body className={mulish.className}>
          <Main />
          <NextScript />
          {/* <Script
            defer
            async
            id="googlemaps"
            type="text/javascript"
            strategy="afterInteractive"
            src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY}&libraries=places&callback=PlacesAutocomplete&loading=async`}
          /> */}
        </body>
      </Html>
    );
  }
}

export default MyDocument;
