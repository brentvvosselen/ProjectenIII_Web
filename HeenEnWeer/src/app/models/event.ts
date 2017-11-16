import { Category } from "./category";
import { Child } from "./child";

export class Event {
    _id: number;
    start: Date;
    end: Date;
    title: String;
    categoryid: Category;
    children: Child[];
    constructor(){}
  }
  