import React from "react";
import Head from "next/head";
import { Header } from "../components/Header";
import Footer from "../components/Footer";
import { Roboto } from "next/font/google";
import "../styles/tailwind.css";

require("dotenv").config();

const metadata = {
  title: "Devilfish Diving LLC",
  description: "Devilfish Diving LLC is a scuba diving charter based in Seattle, Washington.",
};

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: "400",
});

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/octocon.ico" sizes="any" />
      </Head>
      <main className={`${roboto.variable} font-sans`}>
        <Header />
        <Component {...pageProps} />
        <Footer />
      </main>
    </>
  );
}

export default MyApp;
