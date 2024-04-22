import Link from "next/link";
import { Nav } from "./Nav";

export const Header = () => {
  return (
    <>
      <header className="flex flex-col">
        <Nav />

        <div className="m-4">
          <Link href="/">
            <img className="w-25 h-auto" src="/images/devilfish-logo2.png" alt="Devilfish Logo" />
          </Link>
        </div>
      </header>
    </>
  );
};
