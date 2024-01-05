"use client";
import React, { useEffect, useState } from "react";
// import PT_Logo from "../assets/PT_Logo.svg";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import OTP from "@/Components/LoginComponents/OTP/OTP";
import PhoneNumberComponent from "@/Components/LoginComponents/PhoneNumber/PhoneNumber";

export default function Login() {
  const [phoneNumber, setPhoneNumber] = useState<number | undefined>();
  const [OTPSent, setOTPSent] = useState<boolean>(false);
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/home");
    }
  }, []);

  return (
    <div className="bg-Background-primary mx-auto flex h-full min-h-screen max-w-md flex-col items-center justify-center px-[22px] py-10 text-center align-middle lg:mx-auto">
      {/* <Image src={PT_Logo} alt="logo" loading="lazy" /> */}
      {OTPSent && phoneNumber ? (
        <OTP phoneNumber={phoneNumber} />
      ) : (
        <PhoneNumberComponent
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          setOTPSent={setOTPSent}
        />
      )}
    </div>
  );
}
