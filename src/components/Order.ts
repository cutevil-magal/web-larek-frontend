import { IOrdersDelivery, IOrdersContacts} from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export type PaymentMethod = 'card' | 'cash';

export const paymentMethodStyle: Record<PaymentMethod, string> = {
    card: "online",
    cash: "cash"
};

export interface IFormActions {
    onClick: (event: MouseEvent) => void;
}

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

export class OrdersDelivery extends Form<IOrdersDelivery> {
    private paymentButtons: Record<PaymentMethod, HTMLButtonElement>;
    private activePaymentMethod: PaymentMethod = 'card';

    constructor(container: HTMLFormElement, events: IEvents, actions: IFormActions) {
        super(container, events)

        this.paymentButtons = {
            card: ensureElement<HTMLButtonElement>('[name="card"]', container),
            cash: ensureElement<HTMLButtonElement>('[name="cash"]', container)
        };

        this.setActivePaymentMethod('card');
        this.setupPaymentButtons(actions);
    };

    set address(value: string) {
        this.setInputValue('address', value);
    };

    setActivePaymentMethod(method: PaymentMethod): void {
        this.activePaymentMethod = method;
        Object.entries(this.paymentButtons).forEach(([key, button]) => {
            button.classList.toggle('button_alt-active', key === method);
        });
    }

    private setupPaymentButtons(actions: IFormActions): void {
        Object.entries(this.paymentButtons).forEach(([method, button]) => {
            button.addEventListener('click', (event) => {
                const paymentMethod = method as PaymentMethod;
                this.setActivePaymentMethod(paymentMethod);
                actions.onClick(event);
            });
        });
    }

    private setInputValue(name: string, value: string): void {
        const input = this.container.elements.namedItem(name) as HTMLInputElement;
        if (input) input.value = value;
    }
};