export class Child {
  _id: number;
  firstname: String;
  lastname: String;
  gender: String;
  birthdate: Date;
  categories: [{
    name: String;
    info: [{
      name: String;
      value: String;
    }];
  }];
  constructor(){}
}
