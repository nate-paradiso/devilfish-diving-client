import React from "react";
import Head from "next/head"; // Import Head component from Next.js
import { Header } from "./Header";
import Footer from "./Footer";

const metadata = {
  title: "Devilfish Diving LLC",
  description: "Devilfish Diving LLC is a scuba diving charter based in Seattle, Washington.",
};

const RootLayout = ({ children }) => {
  return (
    <>
      <Head>
        {/* Use Head component to manage metadata */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <link rel="icon" href="/octocon.ico" sizes="any" />
      </Head>

      {/* Main content */}
      <Header />
      <>{children}</>
      <Footer />
    </>
  );
};

export default RootLayout;
