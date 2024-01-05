import { IMeals } from "@/api/meals/MealsInterface";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./useToast";

export interface ICartContext {
  passengerCount: number;
  total: number;
  passengerMeals: IMeals[];
  drinks: string[];
  handleAddPassenger: () => void;
  handleSelectMeal: (meal: IMeals, drink: string) => void;
  handleRemoveItem: (passengerNumber: number) => void;
}

export const CartContext = createContext<ICartContext | null>(null);

export const useCart = (): ICartContext => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
};

export const CartProvider: any = ({ children }: any) => {
  const [passengerCount, setPassengerCount] = useState(1);
  const [passengerMeals, setPassengerMeals] = useState<IMeals[] | []>([]);
  const [drinks, setDrinks] = useState<string[] | []>([]);
  const { toastError } = useToast();
  const [total, setTotal] = useState(0);

  const handleAddPassenger = () => {
    const newPassengerCount = passengerCount + 1;
    setPassengerCount(newPassengerCount);
  };

  const handleSelectMeal = (meal: IMeals, drink: string) => {
    if (passengerMeals.length === passengerCount) {
      toastError("Add more passenger's before selecting meals");
    } else {
      let updateSelectedMeals = [...passengerMeals];
      updateSelectedMeals.push(meal);
      setTotal(total + meal.price);
      setPassengerMeals(updateSelectedMeals);
      let updateSelectedDrinks = [...drinks];
      updateSelectedDrinks.push(drink);
      setDrinks(updateSelectedDrinks);
    }
  };

  const handleRemoveItem = (passengerNumber: number) => {
    let updateSelectedMeals = [...passengerMeals];
    let updateSelectedDrinks = [...drinks];
    if (updateSelectedMeals.length >= passengerNumber) {
      const removedMeal = updateSelectedMeals.splice(passengerNumber - 1, 1)[0];
      updateSelectedDrinks.splice(passengerNumber - 1, 1)[0];
      setPassengerMeals(updateSelectedMeals);
      
      setDrinks(updateSelectedDrinks);

      setTotal(total - removedMeal.price);

      setPassengerCount((prevCount) => prevCount - 1);
    }
  };

  const cartFunctions: ICartContext = {
    passengerCount,
    total,
    passengerMeals,
    handleAddPassenger,
    handleSelectMeal,
    drinks,
    handleRemoveItem,
  };

  return (
    <CartContext.Provider value={cartFunctions}>
      {children}
    </CartContext.Provider>
  );
};
