import Link from "next/link";

export const Nav = () => {
  return (
    <nav
      className="flex justify-between items-center text-white font 
      bg-lightBlue
      h-6
      w-full
      border-none p-4 "
    >
      {/* Specify the correct path ("/divesites") as the href prop */}
      <Link href="/DiveSites">Dive Sites</Link>

      <Link href="/Vessel">Vessel</Link>
      <Link href="/About">About</Link>
      <Link href="/Book">Book</Link>
    </nav>
  );
};
