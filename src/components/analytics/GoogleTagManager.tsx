import Script from "next/script";

const GoogleTagManager = () => (
  <>
    {/* eslint-disable-next-line @next/next/no-before-interactive-script-outside-document */}
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-WBTN40GDLM"
      strategy="beforeInteractive"
      async
    />
    <Script id="google-tag-config">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-WBTN40GDLM');
      `}
    </Script>
  </>
);

export default GoogleTagManager;
