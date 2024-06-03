import { Nav } from "./Nav";
import Image from "next/image";
export const Header = () => {
  return (
    <>
      <header className="flex flex-col lg:ml-32 lg:mr-32 ">
        <Nav />
      </header>
    </>
  );
};
