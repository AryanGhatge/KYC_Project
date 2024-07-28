import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="h-screen relative flex items-center justify-center flex-col">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient opacity-100 -z-10"></div>
      {/* Content */}
      <div className="relative z-10">
        <h1 className="text-4xl font-bold mb-4">
          Welcome to the KYC Application
        </h1>
        <Link href="/kyc-form">
          <Button variant="default" className="m-2">
            Fill KYC Application Form
          </Button>
        </Link>
      </div>
    </main>
  );
}
