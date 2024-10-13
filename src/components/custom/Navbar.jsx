import React from "react";
import Logo from "@/../public/logo-inr.svg.png";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { IoPerson } from "react-icons/io5";

const Navbar = () => {
  const router = useRouter();
  // const session = useSession();

  return (
    <div className="h-24 flex px-36 items-center relative">
      <div className="flex justify-between w-full">
        <div className="w-32 cursor-pointer">
          <Image src={Logo} alt="logo" />
        </div>
        <div>
          {/* TODO: Add signin and signup component with Passpost.js  */}
          <Button
            variant="default"
            onClick={() => router.push("/signin")}
            className="gap-2"
          >
            <IoPerson />
            Sign-in
          </Button>
          {/* {JSON.stringify(session)} */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
