"use client";
import { getAllFilters } from "@/api/filters/filters";
import { useQuery } from "@tanstack/react-query";
import Loader from "../Loader/Loader";
import Error from "../Error/Error";
import { useState } from "react";
import { IFilters } from "@/api/filters/FiltersInterface";

export default function Filters({
  selectedFilter,
  setSelectedFilter,
  dataFilters,
}: {
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  dataFilters: IFilters[];
}) {
  function getFilters() {
    return (
      <div className="mx-auto mt-2 flex w-full flex-wrap items-center justify-center gap-3 bg-white align-middle text-black">
        {dataFilters &&
          dataFilters.map((filter: any) => {
            return (
              <button
                key={filter.id}
                className={`duration-50000 rounded-2xl border border-gray-300 px-3 py-1 text-sm font-medium text-black transition-all hover:border-gray-500 ${
                  selectedFilter === filter.id && "bg-gray-500 text-white"
                }`}
                onClick={() => {
                  setSelectedFilter(filter.id);
                }}
              >
                {filter.label}
              </button>
            );
          })}
      </div>
    );
  }

  return getFilters();
}
