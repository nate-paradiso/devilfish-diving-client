import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className=" bg-sky-700 border-none ">
      <div className="flex justify-between items-center text-white text-sm md:p-6 p-4 lg:ml-32 lg:mr-32">
        <div className="">
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
            <Link className="hover:text-hoverColor" href="/CancelPolicy">
              Cancellation Policy
            </Link>
          </p>
          <p>
            <Link className="hover:text-hoverColor" href="/PrivacyPolicy">
              Privacy Policy
            </Link>
          </p>
          <p>Copyright Devilfish Diving LLC 2024</p>
        </div>
        <div>
          <a href="https://www.instagram.com/" target="blank">
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
