import Document, { Html, Head, Main, NextScript } from "next/document";
import Script from "next/script";
import { mulish } from "./_app";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
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
        </Head>
        <body className={mulish.className}>
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
