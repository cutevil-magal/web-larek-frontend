import { ISuccess } from "../types";
import { ensureElement } from "../utils/utils";
import { Component } from "./base/Component";

export interface ISuccessActions {
    onClick: () => void; // Обработчик события клика (например, для закрытия окна)
}

// Класс Success отвечает за отображение информации об успешном выполнении заказа.
export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _total: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order-success__close', this.container);
        this._total = ensureElement<HTMLElement>('.order-success__description', this.container);

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set total(value: string) {
      this._total.textContent = `Списано ${value} синапсов`
    }

}