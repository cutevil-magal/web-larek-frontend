import { IOrdersDelivery, PaymentMethod} from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export class OrdersDelivery extends Form<IOrdersDelivery> {
    private paymentButtons: Record<PaymentMethod, HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this.paymentButtons = {
            card: ensureElement<HTMLButtonElement>('[name="card"]', container),
            cash: ensureElement<HTMLButtonElement>('[name="cash"]', container)
        };

        this.paymentButtons.card.addEventListener('click', () => {
            this.events.emit('payment:changed', { method: 'card' });
        });
        
        this.paymentButtons.cash.addEventListener('click', () => {
            this.events.emit('payment:changed', { method: 'cash' });
        });
    };

    set address(value: string) {
        this.setInputValue('address', value);
    };

    set payment(method: PaymentMethod) {
        this.togglePaymentMethod(method);
    }

    togglePaymentMethod(method: PaymentMethod): void {
        Object.entries(this.paymentButtons).forEach(([key, button]) => {
            button.classList.toggle('button_alt-active', key === method);
        });
    }

    private setInputValue(name: string, value: string): void {
        const input = this.container.elements.namedItem(name) as HTMLInputElement;
        if (input) input.value = value;
    }
};
