export interface IMeals {
     id: string;
     title: string;
     starter: string;
     desert: string;
     name: string;
     price: number;
     labels: string[];
     img: string;
     drinks: IDrink[];
  }
  
export  interface IDrink {
     id: string;
     title: string;
     price: number;
  }