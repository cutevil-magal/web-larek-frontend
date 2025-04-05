import { ensureElement, createElement, formatNumber } from '../utils/utils';
import { Component } from "./base/Component";
import { EventEmitter } from "./base/events";
import { IProduct } from "../types/index";

// Интерфейс для корзины
interface CartData { 
    items: HTMLElement[]; // Список элементов корзины
    total: number; // Общая стоимость товаров в корзине
    selected: string[];
}

// Класс Basket отвечает за управление функционалом корзины в приложении
export class ShoppingCart extends Component<CartData> {
    protected itemsContainer: HTMLElement;
    protected sumElement: HTMLElement;
    protected checkoutButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this.itemsContainer = ensureElement<HTMLElement>('.basket__list', this.container);
        this.sumElement = this.container.querySelector('.basket__price');
        this.checkoutButton = this.container.querySelector('.basket__button');

        if (this.checkoutButton) {
            this.checkoutButton.addEventListener('click', () => {
                events.emit('checkout:initiate')
            });
        };
        this.items =[];
    };

    // Сеттер для установки товаров в корзине
    set items(products: HTMLElement[]) {
        if (products.length) {
            products.forEach((product, idx) => {
                const positionElement = product.querySelector('.basket__item-index');
                if (positionElement) {
                    positionElement.textContent = `${idx + 1}`;
                }
            });
            this.itemsContainer.replaceChildren(...products);
        } else {
            this.itemsContainer.replaceChildren(
                createElement<HTMLParagraphElement>('p', {
                    textContent: 'В корзине нет товаров'
                })
            );
        }
    }

    // управляет состоянием кнопки
    set selected(items: string[]) {
        this.setDisabled(this.checkoutButton, !items.length);
    }

    // Обновление общей суммы
    set sum(amount: number) {
        this.setText(this.sumElement, formatNumber(amount));
    }

    calculateTotal(items: IProduct[]): number {
        return items.reduce((sum, item) => sum + (item.price || 0), 0);
    }
};