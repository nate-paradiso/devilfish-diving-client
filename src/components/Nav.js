import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";

export const Nav = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Track the state of the submenu
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

  // Handle opening and closing of the submenu
  const toggleSubMenu = () => {
    setIsSubMenuOpen(!isSubMenuOpen);
  };
  const router = useRouter();

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

        <div className="relative z-20">
          <button
            className="text-white md:hidden ml-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-slate-950 hover:text-hoverColor"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          <div
            className="hidden md:flex space-x-4 text-[1.25rem] text-slate-950 bg-white  
          shadow-lg border-gray rounded-md p-1.5 border-[1px] ml-[20px] pl-[15px] pr-[15px]"
          >
            <Link
              href="/"
              className={`${
                router.pathname === "/" ? "underline underline-offset-4" : ""
              } transition-colors duration-200 hover:text-hoverColor`}
            >
              Home
            </Link>
            <Link
              href="/DiveMap"
              className={`${
                router.pathname === "/DiveMap" ? "underline underline-offset-4" : ""
              } w-[83px] transition-colors duration-200 hover:text-hoverColor`}
            >
              Dive Map
            </Link>
            <Link
              href="/Services"
              className={`${
                router.pathname === "/Services" ? "underline underline-offset-4" : ""
              } transition-colors duration-200 hover:text-hoverColor`}
            >
              Services
            </Link>
            <div
              className="relative cursor-pointer"
              onClick={toggleSubMenu}
              onClick={toggleSubMenu}
            >
              Photos
              {isSubMenuOpen && (
                <div className="absolute top-full left-0 bg-white  shadow-lg rounded-md p-2 flex flex-col">
                  <Link
                    href="/BoatPhotos"
                    className={`${
                      router.pathname === "/Photos" ? "underline underline-offset-4" : ""
                    } transition-colors duration-200 hover:text-hoverColor`}
                  >
                    Boat
                  </Link>
                  <Link
                    href="/DivingPhotos"
                    className={`${
                      router.pathname === "/Photos" ? "underline underline-offset-4" : ""
                    } transition-colors duration-200 hover:text-hoverColor`}
                  >
                    Diving
                  </Link>
                  <Link
                    href="/SightsPhotos"
                    className={`${
                      router.pathname === "/Photos" ? "underline underline-offset-4" : ""
                    } transition-colors duration-200 hover:text-hoverColor`}
                  >
                    Sights
                  </Link>
                </div>
              )}
            </div>{" "}
            <Link
              href="/About"
              className={`${
                router.pathname === "/About" ? "underline underline-offset-4" : ""
              } transition-colors duration-200 hover:text-hoverColor`}
            >
              About
            </Link>
            <Link
              href="/Faq"
              className={`${
                router.pathname === "/Faq" ? "underline underline-offset-4" : ""
              } transition-colors duration-200 hover:text-hoverColor`}
            >
              FAQ
            </Link>
            <Link
              href="/Calendar"
              className={`${
                router.pathname === "/Calendar" ? "underline underline-offset-4" : ""
              } transition-colors duration-200 hover:text-hoverColor`}
            >
              Calendar
            </Link>
          </div>
        </div>
      </div>
      <div className="fixed z-20 top-[65px] right-0">
        {isMenuOpen && (
          <div
            className="md:hidden flex top-0 sticky z-30  text-right flex-col space-y-1 p-4 text-black text-[1rem]
         bg-white  shadow-lg  rounded-bl-md rounded-tl-md  mb-4 w-[100px]"
          >
            <div>
              <Link
                href="/"
                className={`${
                  router.pathname === "/" ? "underline underline-offset-4" : ""
                } transition-colors duration-200 hover:text-hoverColor`}
              >
                Home
              </Link>
            </div>
            <div>
              <Link
                href="/DiveMap"
                className={`${
                  router.pathname === "/DiveMap" ? "underline underline-offset-4" : ""
                } transition-colors duration-200 hover:text-hoverColor`}
              >
                Dive Map
              </Link>
            </div>
            <div>
              <Link
                href="/Services"
                className={`${
                  router.pathname === "/Services" ? "underline underline-offset-4" : ""
                } transition-colors duration-200 hover:text-hoverColor`}
              >
                Services
              </Link>
            </div>
            <div className="flex justify-end">
              <div
                className="relative cursor-pointer "
                onClick={toggleSubMenu}
                onClick={toggleSubMenu}
              >
                Photos
                {isSubMenuOpen && (
                  <div className="flex flex-col mr-2 mb-2">
                    <div className="mr-4"> ↓</div>
                    <div>
                      <Link
                        href="/BoatPhotos"
                        className={`${
                          router.pathname === "/BoatPhotos"
                            ? "underline m-2 underline-offset-4 "
                            : ""
                        } transition-colors m-1 duration-200 hover:text-hoverColor`}
                      >
                        Boat
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/DivingPhotos"
                        className={` ${
                          router.pathname === "/DivingPhotos" ? "underline underline-offset-4" : ""
                        } transition-colors m-1 duration-200 hover:text-hoverColor`}
                      >
                        Diving
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/SightsPhotos"
                        className={` ${
                          router.pathname === "/SightsPhotos" ? "underline underline-offset-4" : ""
                        } transition-colors m-1  duration-200 hover:text-hoverColor`}
                      >
                        Sights
                      </Link>
                    </div>
                  </div>
                )}
              </div>{" "}
            </div>
            <div>
              <Link
                href="/About"
                className={`${
                  router.pathname === "/About" ? "underline underline-offset-4" : ""
                } transition-colors duration-200 hover:text-hoverColor`}
              >
                About
              </Link>
            </div>
            <div>
              <Link
                href="/Faq"
                className={`${
                  router.pathname === "/Faq" ? "underline underline-offset-4" : ""
                } transition-colors duration-200 hover:text-hoverColor`}
              >
                FAQ
              </Link>
            </div>
            <div>
              <Link
                href="/Calendar"
                className={`${
                  router.pathname === "/Calendar" ? "underline underline-offset-4" : ""
                } transition-colors duration-200 hover:text-hoverColor`}
              >
                Calendar
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
