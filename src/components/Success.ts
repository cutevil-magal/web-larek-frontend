import { ensureElement, formatNumber } from "../utils/utils";
import { Component } from "./base/Component";

export interface ISuccess {
    total: number | null; // Общая сумма
}

export interface ISuccessActions {
    onClick: () => void;
}

// Класс Success отвечает за отображение информации об успешном выполнении заказа.
export class Success extends Component<ISuccess> {
    protected readonly elements: {
        closeButton: HTMLButtonElement;
        description: HTMLElement;
    };

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this.elements = {
            closeButton: ensureElement<HTMLButtonElement>('.order-success__close', container),
            description: ensureElement<HTMLElement>('.order-success__description', container)
        };

        if (actions?.onClick) {
            this.elements.closeButton.addEventListener('click', actions.onClick);
        }
    }

    set total(value: number | null) {
        this.setText(this.elements.description, `Списано ${formatNumber(value)}`);
    }

}