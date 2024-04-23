import Link from "next/link";
import { Nav } from "./Nav";
import Image from "next/image";

export const Header = () => {
  return (
    <>
      <header className="flex flex-col  ">
        <Nav />

        <div className="m-4 flex justify-center ">
          <Link href="/">
            <Image
              className="w-64"
              src="/images/devilfish-logo2.png"
              alt="Devilfish Logo"
              width={256}
              height={64}
            />{" "}
          </Link>
        </div>
      </header>
    </>
  );
};
