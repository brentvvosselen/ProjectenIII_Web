import { CostCategory } from "./costCategory";
import { Image } from "./image";

export class Cost {
    _id: number;
    title: string;
    description: string;
    amount: number;
    date: Date;
    costCategory: CostCategory;
    picture: Image;
    constructor(){}
  }
