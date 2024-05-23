import { Nav } from "./Nav";
import Image from "next/image";
export const Header = () => {
  return (
    <>
      <header className="flex flex-col  ">
        <Nav />
      </header>
    </>
  );
};
