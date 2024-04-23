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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Karla:ital,wght@0,200..800;1,200..800&display=swap"
          rel="stylesheet"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&display=swap"
          rel="stylesheet"
        />
      </Head>

      {/* Main content */}
      <Header />
      <>{children}</>
      <Footer />
    </>
  );
};

export default RootLayout;
