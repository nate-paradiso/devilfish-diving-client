import Link from "next/link";

export const Nav = () => {
  return (
    <nav
      className="flex justify-center items-center text-white  md:text-[1rem] text-[.73rem] md:p-6
      bg-nav
      opacity-95
      h-6
      w-full
      border-none pt-4 pb-4 pl-1 pr-1 shadow-md "
    >
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/">
        Home
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/DiveMap">
        Dive Map
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/Services">
        Services
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/Photos">
        Photos
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/About">
        About
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/Faq">
        FAQ
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/Calendar">
        Calendar
      </Link>
      {/* <Link className="mr-2 transition-colors duration-200 hover:text-darkBlue" href="/Book">
        Contact
      </Link> */}
    </nav>
  );
};
