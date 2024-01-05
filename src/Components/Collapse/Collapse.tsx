import React, { useEffect, useState } from "react";
import Down_Arrow_Icon from "../../assets/Down_Arrow_Icon.svg";
import Image from "next/image";

const Collapse = ({ title, subtitle, children }: any) => {
  const storageKey = `isActive_${title}`;

  const storedIsActive = sessionStorage.getItem(storageKey);
  const initialIsActive =
    storedIsActive !== null ? JSON.parse(storedIsActive) : true;

  const [isActive, setIsActive] = useState<boolean>(initialIsActive);

  useEffect(() => {
    sessionStorage.setItem(storageKey, JSON.stringify(isActive));
  }, [isActive, storageKey]);

  const toggleAccordion = () => {
    setIsActive(!isActive);
  };

  function getHead() {
    {
      /* closed style ${ !isActive && 'bg-Background-secondary rounded-md' }*/
    }
    return (
      <button
        onClick={toggleAccordion}
        className={`flex w-full cursor-pointer items-center justify-between rounded-t-md border p-2 text-left align-middle focus:outline-none`}
      >
        <div className="flex flex-col items-start justify-center align-middle">
          <span className="font-bold text-black">{title}</span>
          <span className="text-sm text-gray-500">{subtitle}</span>
        </div>
        <Image
          loading="lazy"
          src={Down_Arrow_Icon}
          alt={Down_Arrow_Icon}
          className={`${isActive && "rotate-180"}`}
        />
      </button>
    );
  }

  function getBody() {
    return (
      <div
        className={`transition-max-height w-full overflow-hidden border duration-300
      ${isActive ? "h-full" : "max-h-0"}`}
      >
        <div className="flex flex-col">{children}</div>
      </div>
    );
  }

  return (
    <div className="mb-1 flex w-full flex-col items-center justify-center rounded-md text-center align-middle">
      {getHead()}
      {getBody()}
    </div>
  );
};

export default Collapse;
