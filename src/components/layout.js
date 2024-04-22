import React from "react";
import Head from "next/head"; // Import Head component from Next.js

const metadata = {
  title: "Devilfish Diving LLC",
  description: "Devilfish Diving LLC is a scuba diving charter based in Seattle, Washington.",
};

const RootLayout = ({ children }) => {
  return (
    <>
      <Head>
        {" "}
        {/* Use Head component to manage metadata */}
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>

      {/* Main content */}
      <>{children}</>
    </>
  );
};

export default RootLayout;
