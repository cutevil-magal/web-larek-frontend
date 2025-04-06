import { IOrdersContacts} from "../types";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export class OrdersContacts extends Form<IOrdersContacts> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)
    };

    set phone(value: string) {
        this.setInputValue('phone', value);
    };

    set email(value: string) {
        this.setInputValue('email', value);
    };

    private setInputValue(name: string, value: string): void {
        const input = this.container.elements.namedItem(name) as HTMLInputElement;
        if (input) input.value = value;
    }
};
