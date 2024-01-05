import React from "react";
import Bug_Icon from "../../assets/Bug_Icon.svg";
import Image from "next/image";

const Error = () => {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-[4px] py-10">
      <Image loading="lazy" src={Bug_Icon} alt="Error icon" />
      <h2 className="text-Text-primary my-2 text-xl font-bold">
        Something Went Wrong
      </h2>
      <p className="text-Text-primary text-center">
        We apologize for the inconvenience. We are working on it.
      </p>
    </div>
  );
};

export default Error;
