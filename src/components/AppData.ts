import { FormErrors, IAppStatus, ICard, IOrder, IOrdersContacts, IOrdersDelivery } from '../types/index';
import { Model } from './base/Model';
import _ from "lodash";

export type CatalogChangeEvent = {
    catalog: ICard[]
};

// Класс AppStatus отвечает за управление состоянием приложения, включая каталог товаров, корзину, заказ и ошибки форм.
export class AppStatus extends Model<IAppStatus> {
    catalog: ICard[];
    basket: ICard[] = [];
    order: IOrder = {
        payment: 'online',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
    }
    preview: string | null;
    formErrors: FormErrors = {}
    
    // Устанавливает каталог товаров и вызывает событие изменения каталога
    setCards(items: ICard[]) {
        this.catalog = items;
        this.emitChanges('items:changed', {cards: this.catalog})
    }

    // Устанавливает ID выбранного товара для предпросмотра и вызывает событие изменения предпросмотра
    setPreview(item: ICard) {
        this.preview = item.id;
        this.emitChanges('preview:changed', item)
    }

    // Добавляет товар в корзину, если его там нет, и вызывает события изменения корзины и счетчика товаров
    addItemToBasket(item: ICard) {
        this.basket.indexOf(item) < 1 ?
        this.basket.push(item) : 
        false;
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('count:changed', this.basket);
    }

    // Удаляет товар из корзины и вызывает события изменения корзины и счетчика товаров
    deleteItemFromBasket(item: ICard) {
        this.basket = this.basket.filter(elem => elem != item);
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('count:changed', this.basket);
    }

    // Устанавливает данные доставки в заказ, проверяет их валидность и вызывает событие изменения доставки
    setOrdersDelivery(field: keyof IOrdersDelivery, value: string) {
        this.order[field] = value;
        this.checkDeliveryValidation() ?  
        this.events.emit('ordersDelivery:changed', this.order) : 
        false;
    }

    // Устанавливает контактные данные в заказ, проверяет их валидность и вызывает событие изменения контактов
    setOrdersContacts(field: keyof IOrdersContacts, value: string) {
        this.order[field] = value;
        this.checkContactsValidation() ?  
        this.events.emit('ordersContacts:changed', this.order) : 
        false;
    }

    // Проверяет валидность адреса доставки и вызывает событие изменения формы доставки
    checkDeliveryValidation() {
        const error: typeof this.formErrors = {};
        const addresRegexp = /^[а-яА-ЯёЁ0-9,./\-/\s]+$/i;
        if (!addresRegexp.test(this.order.address) || !this.order.address) {
            error.address = 'Введите адрес в допустимом формате: буквенно-цифровой, с пробелами, запятыми, точками и тире'
        };

        this.formErrors = error;
        this.events.emit('deliveryForm:changed', this.formErrors)
        return Object.keys(error).length === 0;
    }

    // Проверяет валидность контактных данных
    checkContactsValidation() {
        const error: typeof this.formErrors = {};
        const emailRegepx = /^[a-zA-Z0-9._]+@[a-z]+.[a-z]{2,5}$/;
        const phoneRegexp = /^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/;
        if (!emailRegepx.test(this.order.email) || !this.order.email) {
            error.email = 'Введите свой адрес электронной почты в следующем формате: email@email.com'
        }
        if (!phoneRegexp.test(this.order.phone) || !this.order.phone) {
            error.phone = 'Введите свой номер телефона в формате +7 (XXX) XXX-XX-XX'
        }
        this.formErrors = error;
        this.events.emit('contactsForm:changed', this.formErrors)
        return Object.keys(error).length === 0;
    }

    // Очищает корзину и вызывает события изменения корзины и счетчика товаров
    clearBasket() {
        this.basket = [];
        this.emitChanges('basket:changed', this.basket);
        this.emitChanges('count:changed', this.basket)
    }
}