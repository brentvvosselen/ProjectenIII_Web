import { Group } from './group';
import { Image } from './image';

export class Parent {
    _id: number;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    addressStreet: string;
    addressNumber: string;
    addressCity: string;
    addressPostalcode: string;
    telephoneNumber: string;
    workName: string;
    workNumber: string;
    group: Group;
    doneSetup: boolean;
    type: type;
    picture: Image;
    //constructor(firstname: string, lastname: string, email: string){}
    constructor(){};
}

enum type{
    "M",
    "F"
}
