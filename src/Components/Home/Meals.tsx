"use client";
import React, { useEffect, useState } from "react";
import MealsCard from "./MealsCard";
import { IMeals } from "@/api/meals/MealsInterface";

const PAGE_SIZE = 3;

export default function Meals({ dataMeals }: { dataMeals: IMeals[] }) {
  const [currentPage, setCurrentPage] = useState(1);

  const indexOfLastMeal = currentPage * PAGE_SIZE;
  const indexOfFirstMeal = indexOfLastMeal - PAGE_SIZE;
  const currentMeals =
    dataMeals && dataMeals.slice(indexOfFirstMeal, indexOfLastMeal);

  useEffect(() => {
    setCurrentPage(1);
  }, [dataMeals]);

  function getMeals() {
    return (
      <div className="my-3 flex h-full w-full flex-wrap items-center justify-center overflow-y-scroll bg-white align-middle text-black">
        {currentMeals &&
          currentMeals.map((meal: IMeals) => {
            return <MealsCard key={meal.id} meal={meal} />;
          })}
        <div className="mx-3 flex md:py-3 w-full items-center justify-between align-middle">
          {currentPage === 1 ? (
            <div></div>
          ) : (
            <button
              className="rounded-lg bg-gray-500 px-5 py-2 text-sm font-semibold text-white"
              onClick={() => setCurrentPage((prevPage) => prevPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          )}
          {indexOfLastMeal >= dataMeals.length ? (
            <div></div>
          ) : (
            <button
              className="rounded-lg bg-gray-500 px-5 py-2 text-sm font-semibold text-white"
              onClick={() => setCurrentPage((prevPage) => prevPage + 1)}
              disabled={indexOfLastMeal >= dataMeals.length}
            >
              Next
            </button>
          )}
        </div>
      </div>
    );
  }

  return getMeals();
}
