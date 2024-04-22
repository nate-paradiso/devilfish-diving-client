import { lusitana } from "../styles/fonts";

const metadata = {
  title: "Devilfish Diving LLC",
  description: "Devilfish Diving LLC is a scuba diving charter based in Seattle, Washington.",
};
const RootLayout = ({ children }) => {
  return (
    <div className={`${lusitana.className} antialiased`}>
      {/* Header */}
      <head>
        <h1>{metadata.title}</h1>
        <p>{metadata.description}</p>
      </head>

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer>{/* Footer content */}</footer>
    </div>
  );
};

export default RootLayout;
