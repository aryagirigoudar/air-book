"use client";
import React, { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import Login_Asset from "../../../../assets/Login_Asset.svg";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/useToast";
import { PHONE_NUMBER } from "@/lib/constants";
import { requestOTP } from "@/api/auth/auth";
import { useFormik } from "formik";
import * as Yup from "yup";
import { isStringContainOnlyNumbers } from "@/lib/utlis";

export default function PhoneNumber({
  setPhoneNumber,
  setOTPSent,
}: {
  setPhoneNumber: (value: number | undefined) => void;
  phoneNumber: number | undefined;
  setOTPSent: (value: boolean) => void;
}) {
  const { toastWarning, toastSuccess, toastError } = useToast();
  const [phoneNumDigitCount, setPhoneNumDigitCount] = useState<boolean>(false);
  const [resendLimit, setResendLimit] = useState<boolean>(true);
  const inputTagRef: any = useRef(null);

  useEffect(() => {
    const count = sessionStorage.getItem("@resendCount");
    const phoneNumber = localStorage.getItem(PHONE_NUMBER);
    if (count && parseInt(count) >= 3 && phoneNumber && resendLimit) {
      setPhoneNumber(undefined);
      setResendLimit(false);
      setOTPSent(false);
      toastError("Too many login attempts. Please try again later.");
    } else if (phoneNumber && resendLimit) {
      setPhoneNumber(parseInt(phoneNumber));
      formik.setFieldValue("phoneNumber", parseInt(phoneNumber));
      // formik.setFieldTouched("phoneNumber", true)
      setPhoneNumDigitCount(true);
    }
  }, []);

  useEffect(() => {
    if (inputTagRef.current) {
      inputTagRef.current.focus();
    }
  }, []);

  const { isPending: isPendingReqOTP, mutate: reqOTP } = useMutation({
    mutationFn: (phoneNumber: number) => {
      return requestOTP(phoneNumber);
    },
    onSuccess: () => {
      toastSuccess("OTP sent successfully");
      setOTPSent(true);
    },
    onError: (error) => {
      toastError("Error sending OTP, Try again later");
      setOTPSent(false);
    },
  });

  const formik = useFormik({
    initialValues: {
      phoneNumber: undefined,
    },
    onSubmit: function (values) {
      localStorage.setItem(PHONE_NUMBER, `${values.phoneNumber}`);
      if (values.phoneNumber) {
        setPhoneNumber(values.phoneNumber);
        reqOTP(values.phoneNumber);
      } else {
        toastWarning("Enter a valid phone number");
      }
    },
    //Handle Validation
    validationSchema: Yup.object({
      phoneNumber: Yup.string()
        .required("Enter the phone number")
        .matches(/[6-9]\d{9}$/, "Enter a valid phone number")
        .min(10, "Phone number should be 10 digits")
        .max(10, "Phone Number should be 10 digits"),
    }),
  });

  const phoneNumberHandleChange = (e: any) => {
    let { value } = e.target;
    value = value.replace(/[^0-9]/g, "");
    if (
      !(isStringContainOnlyNumbers(value) || value === "") ||
      value.length > 10
    ) {
      return;
    } else {
      if (/^[^6-9]/.test(value)) {
        formik.errors;
        formik.setFieldTouched("phoneNumber", true);
        formik.setFieldError("phoneNumber", "Mobile number is not valid");
      }
      if (/^(\d)\1{6,10}$/.test(value)) {
        formik.setFieldTouched("phoneNumber", true);
        formik.setFieldError("phoneNumber", "Mobile number is not valid");
      } else {
        formik.setFieldValue("phoneNumber", value);
        value.length < 10
          ? setPhoneNumDigitCount(false)
          : setPhoneNumDigitCount(true);
      }
    }
  };

  function getAsset() {
    return (
      // <Image className="mt-4" src={Login_Asset} alt="logo" loading="lazy" />
      <></>
    );
  }

  function getInputAndButton() {
    return (
      <form className="w-full" onSubmit={formik.handleSubmit}>
        <input
          className={`placeholder-Text-secondary focus:border-Border-primary mt-[35px] w-full rounded-[4px] px-5 py-3 text-sm font-semibold selection:border-[1px] ${
            formik.errors.phoneNumber && "border-red-500"
          }`}
          placeholder="Enter Mobile number"
          onFocus={(e) => e.currentTarget.select()}
          ref={inputTagRef}
          autoFocus
          maxLength={10}
          type="text"
          pattern="\d*"
          inputMode="numeric"
          onPaste={phoneNumberHandleChange}
          name="phoneNumber"
          id="phoneNumber"
          onChange={phoneNumberHandleChange}
          onBlur={formik.handleBlur}
          value={formik.values.phoneNumber}
          onKeyDown={(e: any) =>
            ["e", "E", "+", "-", "."].includes(e.key) && e.preventDefault()
          }
        />
        {formik.values.phoneNumber &&
          formik.values.phoneNumber > 1 &&
          formik.touched.phoneNumber &&
          formik.errors.phoneNumber && (
            <span className="mt-1 block px-1 text-start text-sm text-red-500">
              {formik.errors.phoneNumber.toString()}
            </span>
          )}
        <button
          disabled={!phoneNumDigitCount || isPendingReqOTP}
          type="submit"
          className={"mt-[15px] w-full"}
        >
          Get OTP
        </button>
      </form>
    );
  }

  function getSeparatorSection() {
    return (
      <div className="my-[25px] flex w-full items-center justify-evenly align-middle">
        {getSeparator()}
        <span className="mx-6">OR</span>
        {getSeparator()}
      </div>
    );
  }

  function getSeparator() {
    return (
      <span className="border-Border-primary w-full border-[0.5px]"></span>
    );
  }

  return (
    <>
      {getAsset()}
      {getInputAndButton()}
      {/* {getSeparatorSection()} */}
    </>
  );
}
