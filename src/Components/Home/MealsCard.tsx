import React, { useState } from "react";
import { IDrink, IMeals } from "@/api/meals/MealsInterface";
import Image from "next/image";
import Beer from "../../assets/Drinks/Beer.jpg";
import Vine from "../../assets/Drinks/Vine.jpg";
import Juice from "../../assets/Drinks/Juice.jpg";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/useToast";

export default function MealsCard({ meal }: { meal: IMeals }) {
  const [selectedDrink, setSelectedDrink] =
    useState<string>("Select From Below");
  const [selectedDrinkId, setSelectedDrinkId] = useState<IDrink>();
  const { handleSelectMeal } = useCart();
  const { toastInfo } = useToast();
  function getImage(title: string) {
    if (title == "Beer") {
      return Beer;
    } else if (title == "Vine") {
      return Vine;
    } else {
      return Juice;
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-start border-[1px] border-x-0 border-b-0 border-t-gray-300 px-5 py-3 align-middle md:flex-row md:px-0">
      <div className="flex items-center justify-start align-middle md:w-[30%]">
        <Image
          className="rounded-lg object-cover transition-all duration-300 hover:scale-105 md:max-h-[120px] md:min-h-[120px]"
          src={meal.img}
          alt="Meal image"
          priority
          width="450"
          height="120"
        />
      </div>
      <div className="my-2 flex w-full flex-col items-start justify-start align-middle md:mx-5 md:w-[70%]">
        <div className="flex flex-col items-start justify-start align-middle">
          <span className="text-xs">{meal.title} + drinks</span>
          <span className="py-1 text-base font-semibold">{meal.name}</span>
          <span className="text-sm font-medium">
            Starter : <span className="font-normal">{meal.starter}</span>
          </span>
          <span className="text-sm font-medium">
            Desert : <span className="font-normal">{meal.desert}</span>
          </span>
          <span className="text-sm font-medium">
            Selected drink :{" "}
            <span className="font-normal">{selectedDrink}</span>
          </span>
        </div>
        <div className="flex w-full items-start justify-between align-middle md:flex-row">
          <div className="my-2 flex items-center justify-center gap-5 align-middle">
            {meal.drinks.map((drink: IDrink) => {
              return (
                <button
                  key={drink.id}
                  disabled={selectedDrinkId ? true : false}
                  onClick={() => {
                    setSelectedDrinkId(drink);
                    setSelectedDrink(drink.title);
                  }}
                >
                  <Image
                    className={`rounded-lg object-cover py-2 transition-all duration-300 hover:scale-105 md:max-h-[50px] md:min-h-[50px] ${
                      drink.title === selectedDrink && "border border-gray-950"
                    }`}
                    src={getImage(drink.title)}
                    alt="Drink image"
                    priority
                    width="50"
                    height="50"
                  />
                </button>
              );
            })}
          </div>
          <div className="flex flex-col items-start justify-start align-middle">
            <span className="text-lg font-semibold">
              {/* {meal.price} */}
              {meal.price.toFixed(2).split(".")[0]}
              <sup>{meal.price.toFixed(2).split(".")[1]}</sup> €
            </span>
            <button
              onClick={() => {
                if (!selectedDrinkId) {
                    toastInfo("Please select a drink for the meal");
                } else {
                  handleSelectMeal(meal,selectedDrinkId);
                }
              }}
              className="rounded-md border border-gray-500 px-5 py-2 text-black hover:bg-gray-500 hover:text-white"
            >
              Select
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
