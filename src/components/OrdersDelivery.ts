import { IOrdersDelivery} from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export type PaymentMethod = 'card' | 'cash';

export class OrdersDelivery extends Form<IOrdersDelivery> {
    private paymentButtons: Record<PaymentMethod, HTMLButtonElement>;
    // private activePaymentMethod: PaymentMethod = 'card';

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events)

        this.paymentButtons = {
            card: ensureElement<HTMLButtonElement>('[name="card"]', container),
            cash: ensureElement<HTMLButtonElement>('[name="cash"]', container)
        };

        this.togglePaymentMethod('card');
        this.setupPaymentButtons();
    };

    set address(value: string) {
        this.setInputValue('address', value);
    };

    set payment(method: PaymentMethod) {
        this.togglePaymentMethod(method);
    }
    

    private togglePaymentMethod(method: PaymentMethod): void {
        Object.entries(this.paymentButtons).forEach(([key, button]) => {
            button.classList.toggle('button_alt-active', key === method);
        });
    }

    private setupPaymentButtons(): void {
        Object.entries(this.paymentButtons).forEach(([method, button]) => {
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.togglePaymentMethod(method as PaymentMethod);
                this.events.emit('payment:changed', { method: method as PaymentMethod });
            });
        });
    }

    private setInputValue(name: string, value: string): void {
        const input = this.container.elements.namedItem(name) as HTMLInputElement;
        if (input) input.value = value;
    }
};