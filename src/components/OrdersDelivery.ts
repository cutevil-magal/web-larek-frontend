import { IOrdersDelivery} from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export type PaymentMethod = 'card' | 'cash';

export interface IOrdersActions {
    onClick: (event: MouseEvent) => void;
}

export class OrdersDelivery extends Form<IOrdersDelivery> {
    private paymentButtons: Record<PaymentMethod, HTMLButtonElement>;

    constructor(container: HTMLFormElement, events: IEvents, actions: IOrdersActions) {
        super(container, events)

        this.paymentButtons = {
            card: ensureElement<HTMLButtonElement>('[name="card"]', container),
            cash: ensureElement<HTMLButtonElement>('[name="cash"]', container)
        };

        if (actions.onClick) {
            this.paymentButtons.card.addEventListener('mouseup', actions.onClick);
            this.paymentButtons.cash.addEventListener('mouseup', actions.onClick);
        };

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