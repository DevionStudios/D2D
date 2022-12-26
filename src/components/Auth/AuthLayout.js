import React from "react";
import { Card } from "~/components/ui/Card";
import { Heading } from "~/components/ui/Heading";
import { Footer } from "../Common/Footer";
import { GradientBar } from "../ui/GradientBar";
import Logo from "../../assets/D2D Logo Trans.png";
import Image from "next/image";
export function AuthLayout({ title, subtitle, children }) {
  return (
    <main className="flex flex-col justify-center mx-auto w-full max-w-xl min-h-screen py-10">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center mb-1 space-x-3">
          <Image src={Logo} alt="D2D Logo" width={110} height={110} />
          <Heading size="h2">{title}</Heading>
        </div>
        <p className="mt-3 text-gray-500">{subtitle}</p>
      </div>
      <Card
        rounded="md"
        className="overflow-hidden sm:mx-auto sm:w-full sm:max-w-md"
      >
        <GradientBar color="indigo" />
        <Card.Body className="py-5">
          <div>{children}</div>
        </Card.Body>
      </Card>
      <div className="mx-auto">
        <Footer />
      </div>
    </main>
  );
}
