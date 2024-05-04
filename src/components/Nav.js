import Link from "next/link";

export const Nav = () => {
  return (
    <nav
      className="flex justify-start items-center text-white  md:text-[1rem] text-sm md:p-6
      bg-nav
      opacity-95
      h-6
      w-full
      border-none p-4 "
    >
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/">
        Home
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/DiveSites">
        Dive Sites
      </Link>

      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/Vessel">
        Vessel
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-hoverColor" href="/About">
        About
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
