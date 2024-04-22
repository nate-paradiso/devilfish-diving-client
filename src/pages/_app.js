import React from "react";
import RootLayout from "../components/layout";
import "../styles/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <RootLayout>
      <Component {...pageProps} />
    </RootLayout>
  );
}

export default MyApp;
