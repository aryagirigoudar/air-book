import { IDrink, IMeals } from "@/api/meals/MealsInterface";
import { createContext, useContext, useEffect, useState } from "react";
import { useToast } from "./useToast";

export interface ICartContext {
  passengerCount: number;
  total: number;
  passengerMeals: IMeals[];
  handleAddPassenger: () => void;
  handleSelectMeal: (meal: IMeals, drink: IDrink) => void;
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
  const [drinks, setDrinks] = useState<IDrink[] | []>([]);
  const { toastError } = useToast();
  const [total, setTotal] = useState(0);

  const handleAddPassenger = () => {
    const newPassengerCount = passengerCount + 1;
    setPassengerCount(newPassengerCount);
  };

  const handleSelectMeal = (meal: IMeals, drink: IDrink) => {
    if (passengerMeals.length === passengerCount) {
      toastError("Add more passenger's before selecting meals");
    } else {
      let updateSelectedMeals = [...passengerMeals];
      let updateSelectedDrinks = [...drinks];
      updateSelectedMeals.push(meal);
      updateSelectedDrinks.push(drink);
      setTotal(total + meal.price + drink.price);
      setPassengerMeals(updateSelectedMeals);
      setDrinks(updateSelectedDrinks);
    }
  };

  const handleRemoveItem = (passengerNumber: number) => {
    let updateSelectedMeals = [...passengerMeals];
    let updateSelectedDrinks = [...drinks];

    if (updateSelectedMeals.length >= passengerNumber) {
      const removedMeal = updateSelectedMeals.splice(passengerNumber - 1, 1)[0];
      const removedDrink = updateSelectedDrinks.splice(
        passengerNumber - 1,
        1,
      )[0];
      setPassengerMeals(updateSelectedMeals);
      setDrinks(updateSelectedDrinks);
      setTotal(total - removedMeal.price - removedDrink.price);
      setPassengerCount((prevCount) => prevCount - 1);
    }
  };

  const cartFunctions: ICartContext = {
    passengerCount,
    total,
    passengerMeals,
    handleAddPassenger,
    handleSelectMeal,
    handleRemoveItem,
  };

  return (
    <CartContext.Provider value={cartFunctions}>
      {children}
    </CartContext.Provider>
  );
};
