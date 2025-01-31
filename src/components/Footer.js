import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" bg-sky-700 border-none ">
      <div className="flex justify-between items-center text-white text-sm md:p-6 p-4 lg:ml-32 lg:mr-32">
        <div className="">
          <a className="hover:text-hoverColor" href="https://www.devilfishdive.com/">
            Devilfishdive.com
          </a>
          <p>
            <Link className="hover:text-hoverColor" href="/cancel-policy">
              Cancellation Policy
            </Link>
          </p>
          <p>
            <Link className="hover:text-hoverColor" href="/privacy-policy">
              Privacy Policy
            </Link>
          </p>
          <p>Copyright Devilfish Diving LLC 2024</p>
        </div>
        <div>
          <a href="https://www.instagram.com/devilfish__diving/" target="blank">
            <Image
              className="w-8 mr-2 md:mr-6"
              src="/images/icons8-instagram.svg"
              alt="Instagram Icon"
              width={32}
              height={32}
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
