import { Component } from "./base/Component";
import { ensureElement } from '../utils/utils';
import {IEvents} from "./base/events";

// Интерфейс для отображения страницы
export interface IPage {
    counter: number; // Счетчик товаров в корзине
    catalog: HTMLElement[]; // Список элементов каталога
    locked: boolean; // Заблокирована ли прокрутка страницы
}

// Класс Page управляет основными элементами страницы и их состоянием
export class Page extends Component<IPage> {
    protected readonly elements = {
        counter: ensureElement<HTMLElement>('.header__basket-counter'),
        catalog: ensureElement<HTMLElement>('.gallery'),
        wrapper: ensureElement<HTMLElement>('.page__wrapper'),
        basket: ensureElement<HTMLElement>('.header__basket')
    };

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this.elements.basket.addEventListener('click', () => {
            events.emit('basket:open');
        });
    }

    // Устанавливает значение счетчика товаров
    set counter(value: number) {
        this.setText(this.elements.counter, String(value));
    }

    // Обновляет каталог товаров
    set catalog(items: HTMLElement[]) {
        this.elements.catalog.replaceChildren(...items);
    }

    // Управляет блокировкой прокрутки
    set locked(value: boolean) {
        this.toggleClass(this.elements.wrapper, 'page__wrapper_locked', value);
    }
};