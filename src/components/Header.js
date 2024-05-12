import Link from "next/link";
import { Nav } from "./Nav";
import Image from "next/image";

export const Header = () => {
  return (
    <>
      <header className="flex flex-col  ">
        <Nav />

        <div className="md:m-6 m-4 mr-6 ml-6 flex justify-center ">
          <Link href="/">
            <Image
              className=" bg-white shadow-lg rounded-md p-4 border-[1px]"
              src="/images/devilfish-logo2.png"
              alt="Devilfish Logo"
              width={500}
              height={64}
            />{" "}
          </Link>
        </div>
      </header>
    </>
  );
};
