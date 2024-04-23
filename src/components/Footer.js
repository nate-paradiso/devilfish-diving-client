import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <div
      className="flex justify-between items-center text-white text-sm 
      bg-lightBlue
      h-32
      w-full
      border-none p-4 "
    >
      <div>
        <p>
          <a
            className="transition-colors duration-200 hover:text-darkBlue"
            href="mailto:devilfishdiving@gmail.com"
          >
            devilfishdiving@gmail.com
          </a>
        </p>

        <p>Copyright Devilfish Diving LLC</p>
      </div>
      <div>
        <a href="https://www.instagram.com/" target="blank">
          <img className="w-8" src="/images/icons8-instagram.svg" alt="Instagram Icon" />
        </a>
      </div>
    </div>
  );
};

export default Footer;
