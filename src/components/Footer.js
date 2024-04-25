import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer
      className="flex justify-between items-center text-white text-sm 
      bg-lightBlue
      h-32
      w-full
      border-none p-4 "
    >
      <div>
        <p>
          <a
            className="transition-colors duration-200 hover:text-hoverColor"
            href="mailto:devilfishdiving@gmail.com"
          >
            devilfishdiving@gmail.com
          </a>
        </p>
        <a className="hover:text-hoverColor" href="https://www.devilfishdive.com/">
          devilfishdive.com
        </a>
        <p>
          <Link className="hover:text-hoverColor" href="/">
            Refund Policy
          </Link>
        </p>
        <p>Copyright Devilfish Diving LLC</p>
      </div>
      <div>
        {/* Replace <img> with <Image> */}
        <a href="https://www.instagram.com/" target="blank">
          <Image
            className="w-8"
            src="/images/icons8-instagram.svg"
            alt="Instagram Icon"
            width={32}
            height={32}
          />
        </a>
      </div>
    </footer>
  );
};

export default Footer;
