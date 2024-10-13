import Image from "next/image";
import React from "react";
import eKYCImage from "@/../public/Online_test.png";
import { Button } from "@mantine/core";
import Link from "next/link";

// TODO: Change the whole home page

const HomePage = () => {
  return (
    <div className="relative flex h-screen px-24">
      {/* Text Content */}
      <div className="p-12 relative z-10 flex flex-col w-full lg:w-[60%] justify-center">
        <div className="text-5xl font-bold mb-4 flex gap-3 items-end">
          <p className="text-2xl font-light ">Welcome</p>
          <p className="font-medium">Ayush!!!</p>
        </div>
        <div className="text-base mb-6">
          We're excited to have you here. To get started, let's complete your
          KYC (Know Your Customer) process. It's quick and easy, and it ensures
          your account stays secure. If you need any help, our support team is
          always ready to assist. Let's get you set up!
        </div>
        <div>
          <Link href="/e-kyc">
            <Button variant="gradient" size="lg">
              Get Started --&gt;{" "}
            </Button>
          </Link>
        </div>
      </div>

      {/* Image */}
      <div className="absolute lg:top-[10%] lg:right-20 lg:w-[50%] lg:h-[75%] z-0">
        <Image
          src={eKYCImage}
          alt="eKYC"
          layout="fill"
          style={{ objectFit: "cover" }}
          className="opacity-80"
        />
      </div>
    </div>
  );
};

export default HomePage;
