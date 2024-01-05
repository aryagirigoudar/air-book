"use client";
import Error from "@/Components/Error/Error";
import Filters from "@/Components/Home/Filters";
import Meals from "@/Components/Home/Meals";
import Selected from "@/Components/Home/Selected";
import Loader from "@/Components/Loader/Loader";
import { getAllFilters } from "@/api/filters/filters";
import { IMeals } from "@/api/meals/MealsInterface";
import { getAllMeals } from "@/api/meals/meals";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [mealsData, setMealsData] = useState<IMeals[]>();

  useEffect(() => {
    if (selectedFilter != "all") {
      let FilterArr: IMeals[] = [];
      dataMeals &&
        dataMeals.map((meal: IMeals) => {
          meal.labels.map((label: string) => {
            if (selectedFilter === label) {
              FilterArr.push(meal);
            }
          });
        });
      setMealsData(FilterArr);
    } else {
      setMealsData(dataMeals);
    }
  }, [selectedFilter]);

  useEffect(() => {
    setMealsData(dataMeals);
  }, []);

  const {
    isLoading: isLoadingMeals,
    error: errorMeals,
    data: dataMeals,
  } = useQuery({
    // enabled: authStateLoaded,
    queryKey: ["AllMeals"],
    queryFn: () => getAllMeals(),
    staleTime: 3000,
  });

  const {
    isLoading: isLoadingFilters,
    error: errorFilters,
    data: dataFilters,
  } = useQuery({
    // enabled: authStateLoaded,
    queryKey: ["ActiveFilters"],
    queryFn: () => getAllFilters(),
    staleTime: 3000,
  });

  if (!dataMeals && isLoadingMeals) {
    return <Loader />;
  } else if (errorMeals && !isLoadingMeals) {
    return <Error />;
  } else {
    return (
      <div className="mx-auto flex h-full w-screen flex-col-reverse items-center justify-center text-center align-middle md:h-screen md:flex-row md:items-start md:justify-center md:gap-5">
        <div className="flex h-full w-full md:max-w-2xl flex-col items-start justify-start px-2 align-middle md:w-[65%]">
          <Filters
            dataFilters={dataFilters}
            setSelectedFilter={setSelectedFilter}
            selectedFilter={selectedFilter}
          />
          <Meals dataMeals={mealsData || dataMeals} />
        </div>
        <div className="flex h-full w-full flex-col items-start justify-start px-5 pt-2 align-middle md:mt-0 md:w-[35%]">
          <Selected />
        </div>
      </div>
    );
  }
}
