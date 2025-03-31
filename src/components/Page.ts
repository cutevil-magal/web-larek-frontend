import { IPage } from "../types";
import { Component } from "./base/Component";
import { ensureElement } from '../utils/utils';
import {IEvents} from "./base/events";

// Класс Page управляет основными элементами страницы и их состоянием
export class Page extends Component<IPage> {
    protected _counter: HTMLElement;
    protected _catalog: HTMLElement;
    protected _wrapper: HTMLElement;
    protected _basket: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container)

        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket = ensureElement<HTMLElement>('.header__basket');

        this._basket.addEventListener('click', () => {
            this.events.emit('basket:open');
        });
    };
    
    // Устанавливает значение счетчика товаров
    set counter(value: number) {
        this.setText(this._counter, String(value));
    };

    // Устанавливает список товаров в галерее
    set catalog(items: HTMLElement[]) {
        this._catalog.replaceChildren(...items);
    }

    // Блокирует или разблокирует прокрутку страницы
    set locked(value: boolean) {
        value ? this._wrapper.classList.add('page__wrapper_locked') : this._wrapper.classList.remove('page__wrapper_locked');
    }
};