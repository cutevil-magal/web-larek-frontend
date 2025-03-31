import { IOrdersContacts } from "../types";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export class OrdersContacts extends Form<IOrdersContacts> {

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
    };

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    };

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    };
};