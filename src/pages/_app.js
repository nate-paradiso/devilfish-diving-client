import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { Roboto } from "next/font/google";
import "../styles/tailwind.css";

const metadata = {
  title: "Devilfish Diving LLC",
  description: "Devilfish Diving LLC is a scuba diving charter based in Seattle, Washington.",
};

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});

// Google Analytics Tracking ID
const GA_TRACKING_ID = "G-STGQ8Z7JK3";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Initialize Google Analytics
    const handleRouteChange = url => {
      if (typeof window.gtag !== "undefined") {
        window.gtag("config", GA_TRACKING_ID, {
          page_path: url,
        });
      }
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/octocon.ico" sizes="any" />
        {/* Google Analytics Script */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_TRACKING_ID}');
            `,
          }}
        />
      </Head>
      <main className={`${roboto.variable} font-sans font-normal  m-auto`}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}

export default MyApp;
