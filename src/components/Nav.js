import Link from "next/link";

export const Nav = () => {
  return (
    <nav
      className="flex justify-start items-center text-white text-sm 
      bg-lightBlue
      h-6
      w-full
      border-none p-4 "
    >
      <Link className="mr-2 transition-colors duration-200 hover:text-gray-300" href="/">
        Home
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-gray-300" href="/DiveSites">
        Dive Sites
      </Link>

      <Link className="mr-2 transition-colors duration-200 hover:text-gray-300" href="/Vessel">
        Vessel
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-gray-300" href="/About">
        About
      </Link>
      <Link className="mr-2 transition-colors duration-200 hover:text-gray-300" href="/Calendar">
        Calendar
      </Link>
      {/* <Link className="mr-2 transition-colors duration-200 hover:text-darkBlue" href="/Book">
        Contact
      </Link> */}
    </nav>
  );
};
