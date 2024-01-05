"use client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import OtpInput from "../OTPInput/OTPInput";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { requestOTP, verifyOTP } from "@/api/auth/auth";

export default function OTP({ phoneNumber }: { phoneNumber: number }) {
  const { onLoginSuccess } = useAuth();
  const [otp, setOtp] = useState<string>("");
  const resendTime = 30;
  const { toastSuccess, toastError } = useToast();
  const [otpError, setOtpError] = useState(false);
  const [startTimer, setTimer] = useState<boolean>(true);
  const [timerSec, setTimerSec] = useState<number>(resendTime);
  const [resendOtpCount, setResendOtpCount] = useState<number>(1);
  const [verifyCount, setVerifyCount] = useState<number>(0);
  const [resendOtpDisabled, setResendOtpDisabled] = useState(true);
  const [showTimer, setShowTimer] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (startTimer) {
      if (timerSec === 0) {
        setTimer(false);
        setTimerSec(resendTime);
        setResendOtpDisabled(false);
        setShowTimer(false);
      } else {
        setTimeout(() => setTimerSec((timerSec) => timerSec - 1), 1000);
        setShowTimer(true);
      }
    }
  }, [timerSec, startTimer]);

  const { isPending: isPendingVerifyOTP, mutate: verifyOtp } = useMutation({
    mutationFn: ({
      phoneNumber,
      otp,
    }: {
      phoneNumber: number;
      otp: string;
    }) => {
      return verifyOTP({ phone_number: phoneNumber, otp });
    },
    onSuccess: (data) => {
      sessionStorage.removeItem("@resendCount");
      onLoginSuccess({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });
    },
    onError: () => {
      setVerifyCount(verifyCount + 1);
      setOtpError(true);
    },
  });

  const { isPending: isPendingReqOTP, mutate: reqOTP } = useMutation({
    mutationFn: (phoneNumber: number) => {
      return requestOTP(phoneNumber);
    },
    onSuccess: () => {
      toastSuccess("OTP resent successfully");
      setResendOtpCount(resendOtpCount + 1);
      setResendOtpDisabled(true);
      setTimerSec(resendTime);
      setTimer(true);
      sessionStorage.setItem("@resendCount", String(resendOtpCount));
    },
    onError: () => {
      toastError("Error sending OTP, Try again later");
    },
  });

  function getOTPInputWithButton() {
    return (
      <>
        <span className="text-lg font-bold">Enter OTP</span>
        <OtpInput
          value={otp}
          onChange={(value: string) => {
            setOtp(value);
            setOtpError(false);
            if (value && value.length === 4) {
              verifyOtp({ phoneNumber, otp: value });
            }
          }}
          placeholder="----"
          inputType="number"
          shouldAutoFocus={true}
          containerStyle={{
            marginTop: "35px",
            marginBottom: "20px",
            display: "flex",
            justifyContent: "space-around",
            width: "100%",
          }}
          inputStyle={{
            border: otpError ? "2px solid #EA3434" : "0px",
            width: "60px",
            height: "70px",
            borderRadius: "9px",
            color: "black",
            boxShadow: "-2px 3px 2px 2px #c2c1bd",
          }}
          numInputs={4}
          renderInput={(props: any) => <input {...props} />}
        />
        {otpError && otp.length > 3 && (
          <span className="block px-1 pl-6 text-start text-sm text-red-500">
            OTP is incorrect ! Please click on Resend
          </span>
        )}
        <button
          type="button"
          disabled={otp.length < 4 || isPendingVerifyOTP}
          onClick={() => {
            otp && otp.length === 4 && verifyOtp({ phoneNumber, otp });
          }}
          className={"mb-[30px] mt-[10px] w-full"}
        >
          Login
        </button>
      </>
    );
  }

  function getResend() {
    return (
      <button
        onClick={() => {
          if (!resendOtpDisabled && resendOtpCount <= 3 && !isPendingReqOTP) {
            reqOTP(phoneNumber);
          }
        }}
        className={`${
          resendOtpDisabled ? "cursor-wait" : "cursor-pointer"
        } text-lg font-normal underline`}
      >
        RESEND
        {showTimer && (
          <span className="text-Text-tertiary underline">
            {" "}
            0:{timerSec < 10 ? `0${timerSec}` : timerSec}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="mt-[81px] w-full">
      {getOTPInputWithButton()}
      {resendOtpCount <= 3 && getResend()}
    </div>
  );
}
