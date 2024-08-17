import React from "react";
import Logo from "@/../public/logo-inr.svg.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const Navbar = (props) => {
  return (
    <div className="h-24 flex px-36 items-center relative">
      <div className="flex justify-between w-full">
        <div className="w-32 cursor-pointer">
          <Image src={Logo} alt="logo" />
        </div>
        <div>
          <Button variant="default">Create Account</Button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
