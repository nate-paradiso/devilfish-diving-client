import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className=" lg:pr-[75px] lg:pl-[75px]">
      <div className="flex justify-between items-center p-4">
        <Link href="/">
          <Image
            className=""
            src="/images/devilfish-logo2.png"
            alt="Devilfish Logo"
            width={300}
            height={64}
          />{" "}
        </Link>

        <button className="text-white md:hidden ml-2" onClick={toggleMenu} aria-label="Toggle menu">
          <svg
            className="w-6 h-6 hover:text-hoverColor"
            fill="none"
            stroke="black"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
        <div className="hidden md:flex space-x-4 text-[1rem]  text-black  bg-white shadow-lg border-gray rounded-md p-1.5 border-[1px] ml-[20px] pl-[15px] pr-[15px] ">
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/">
            Home
          </Link>
          <Link
            className=" w-[67px] transition-colors duration-200 hover:text-hoverColor"
            href="/DiveMap"
          >
            Dive Map
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Services">
            Services
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Photos">
            Photos
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/About">
            About
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Faq">
            FAQ
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Calendar">
            Calendar
          </Link>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden flex flex-col text-center  space-y-1 p-2 text-black text-[.89rem] ">
          <Link
            className="transition-colors duration-200 hover:text-hoverColor"
            href="/"
            // onClick={closeMenu}
          >
            Home
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/DiveMap">
            Dive Map
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Services">
            Services
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Photos">
            Photos
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/About">
            About
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Faq">
            FAQ
          </Link>
          <Link className="transition-colors duration-200 hover:text-hoverColor" href="/Calendar">
            Calendar
          </Link>
        </div>
      )}
    </nav>
  );
};
