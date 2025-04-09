import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { Roboto } from "next/font/google";
import "../styles/tailwind.css";

const metadata = {
  title: "Seattle Scuba Diving Boat Charters & Tours | Devilfish Diving",
  description:
    "Scuba diving boat charters in Seattle, Washington with Devilfish Diving. Small groups, expert guides, custom boat, and unforgettable dives in Puget Sound & Lake Washington",
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
    // Load Google Analytics script dynamically
    const loadGAScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
      document.head.appendChild(script);

      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag("js", new Date());
        gtag("config", GA_TRACKING_ID);
      };
    };

    // Initialize Google Analytics if not already loaded
    if (!window.gtag) {
      loadGAScript();
    }

    // Track route changes
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </Head>
      <main className={`${roboto.variable} font-sans font-normal m-auto`}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}

export default MyApp;
