import { Category } from "./category";

export class Event {
    _id: number;
    start: Date;
    end: Date;
    title: String;
    categoryid: Category;
    constructor(){}
  }
  