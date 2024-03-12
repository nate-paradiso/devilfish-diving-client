import { lusitana } from "../styles/fonts";

import "./globals.css";

export const metadata = {
  title: "Devilfish Diving and Charter LLC",
  description:
    "Devilfish Diving and Charter is a scuba diving charter based in Seattle, Washington.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${lusitana.className} antialiased`}>{children}</body>
    </html>
  );
}
