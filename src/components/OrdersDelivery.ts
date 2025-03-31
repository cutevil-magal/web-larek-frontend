import { IOrdersDelivery } from "../types";
import { ensureElement } from "../utils/utils";
import { Form } from "./common/Form";
import {IEvents} from "./base/events";

export interface IActions {
    onClick: (event: MouseEvent) => void; // Обработчик события клика
}

export const paymentMethod: { [key: string]: string } = {
    "card": "online",
    "cash": "cash",
}

export class OrdersDelivery extends Form<IOrdersDelivery> {
    protected _card: HTMLButtonElement;
    protected _cash: HTMLButtonElement;

    constructor(container: HTMLFormElement, events: IEvents, actions: IActions) {
        super(container, events)

        this._card = ensureElement<HTMLButtonElement>('[name="card"]', this.container);
        this._cash = ensureElement<HTMLButtonElement>('[name="cash"]', this.container);
        this._card.classList.add('button_alt-active');

        if (actions.onClick) {
            this._card.addEventListener('mouseup', actions.onClick);
            this._cash.addEventListener('mouseup', actions.onClick);
        };
    };

    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    };

    changeButtonsClasses() {
        this._card.classList.toggle('button_alt-active');
        this._cash.classList.toggle('button_alt-active');
    }

};