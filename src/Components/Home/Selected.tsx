import React from "react";
import AirPlane_Icon from "../../assets/Airplane_Icon.svg";
import Image from "next/image";
import Collapse from "@/Components/Collapse/Collapse";
import Remove_Icon from "../../assets/Remove_Icon.svg";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";

export default function Selected() {
  const {
    handleAddPassenger,
    handleRemoveItem,
    total,
    drinks,
    passengerMeals,
    passengerCount,
  } = useCart();

  const { clearStateOnLogout } = useAuth();
  return (
    <>
      <div className="flex w-full my-2 items-center justify-between align-middle">
        <div className="flex items-center justify-start align-middle">
          <span className="my-2 flex items-center justify-center align-middle text-base font-semibold">
            <Image
              src={AirPlane_Icon}
              className="mx-2 rotate-90"
              alt="airplane icon"
            />
            Select Meal
          </span>
        </div>
        <button
          className="px-2 rounded-md bg-gray-500 py-2 text-sm font-semibold text-white"
          onClick={() => {
            clearStateOnLogout();
          }}
        >
          Logout
        </button>
      </div>
      <Collapse title="BNR  -- LA" subtitle="Flight Duration 18h 35mins">
        <div className="flex w-full flex-col items-center justify-center rounded-b-md align-middle">
          {Array.from({ length: passengerCount }, (_, index) => index + 1).map(
            (passengerNumber) => (
              <div
                key={passengerNumber}
                className="flex w-full items-center justify-between border px-2 py-5 align-middle text-sm"
              >
                <span>P.{passengerNumber}</span>
                {passengerMeals && passengerMeals[passengerNumber - 1] ? (
                  <>{passengerMeals[passengerNumber - 1].title} + {drinks[passengerNumber - 1]}</>
                ) : (
                  <>Select a Meal</>
                )}
                <button
                  onClick={() => {
                    handleRemoveItem(passengerNumber);
                  }}
                >
                  <Image src={Remove_Icon} alt="remove" />
                </button>
              </div>
            ),
          )}
          <button
            className="w-full rounded-md bg-gray-500 py-2 text-sm font-semibold text-white"
            onClick={handleAddPassenger}
          >
            Add Passenger
          </button>
        </div>
      </Collapse>
      <span className="flex w-full items-center justify-center align-middle text-lg font-bold my-2">
        {total != 0 && (
          <span className="flex items-center justify-center align-middle">
            Total : ${total.toFixed(2).split(".")[0]}
            <sup className="font-normal">
              {total.toFixed(2).split(".")[1]}
            </sup>{" "}
            €
          </span>
        )}
      </span>
    </>
  );
}
