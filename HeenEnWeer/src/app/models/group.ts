import { Child } from './child';
import { CalendarEvent } from 'angular-calendar';
import { Parent } from './parent';

export class Group {
    children: Child[];
    events: CalendarEvent[];
    finance: Fintype;
}

class Fintype {
    fintype: string;
    accepted: Parent[];
    kindrekening: Kindrekening;
    onderhoudsBijdrage: Onderhoudsbijdrage;
}

class Kindrekening {
    maxBedrag: number;
}

class Onderhoudsbijdrage {
    onderhoudsgerechtigde: string;
    onderhoudsplichtige: string;
    percentage: number;
}
