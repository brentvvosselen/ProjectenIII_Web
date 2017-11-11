import { CostCategory } from "./costCategory";

export class Cost {
    _id: number;
    title: string;
    description: string;
    amount: number;
    date: Date;
    costCategory: CostCategory;
    constructor(){}
  }
  