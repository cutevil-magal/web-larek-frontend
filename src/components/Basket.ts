import { IBasket } from '../types';
import { ensureElement, createElement, formatNumber } from '../utils/utils';
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";

// Класс Basket отвечает за управление функционалом корзины в приложении
export class Basket extends Component<IBasket> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('mouseup', () => {
                events.emit('order:open')
            });
        };
        this.items =[];
    };

    // Сеттер для установки товаров в корзине
    set items(items: HTMLElement[]) {
        if (items.length) {
            items.forEach((item, index) => {
                const indexElement = item.querySelector('.basket__item-index');
                if (indexElement) {
                    indexElement.textContent = (index + 1).toString(); // Индекс начинается с 1
                }
            });
            this._list.replaceChildren(...items);
            this._button.disabled = false;
        } else {
            this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
                textContent: 'Корзина пуста'
            }));
            this._button.disabled = true;
        };
    };

    // Сеттер для обновления общей стоимости корзины
    set total(total: number) {
        this.setText(this._total, `${formatNumber(total)} синапсов`);
    };
};