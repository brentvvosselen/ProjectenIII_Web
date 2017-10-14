import { Child } from './child';

export class Parent {
    _id: number;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    addressStreet: string;
    addressNumber: number;
    addressCity: string;
    addressPostalcode: number;
    telephoneNumber: string;
    workName: string;
    workNumber: string;
    children: Child[];
    constructor(firstname: string, lastname: string, email: string){}
}
