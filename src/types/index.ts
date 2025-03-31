// Интерфейс состояния приложения
export interface IAppStatus {
    catalog: ICard[]; // Список товаров
    basket: ICard[]; // Корзина
    preview: string | null; // Товар в режиме предпросмотра
    delivery: IOrdersDelivery | null; // Данные доставки
    contact: IOrdersContacts | null; // Контактные данные
    order: IOrder | null; // Текущий заказ
}

// Интерфейс для отображения страницы
export interface IPage {
    counter: number; // Счетчик товаров в корзине
    catalog: HTMLElement[]; // Список элементов каталога
    locked: boolean; // Заблокирована ли прокрутка страницы
}

// Интерфейс для описания карточки товара
export interface ICard {
    id: string; // Уникальный идентификатор товара
    description: string; // Описание товара
    image: string; // Ссылка на изображение товара
    title: string; // Название товара
    category: string; // Категория товара
    price: number | null; // Цена товара
    count?: string; // Индекс или количество товара
    buttonText?: string; // Текст кнопки (например, "Добавить в корзину")
}

// Интерфейс для данных доставки
export interface IOrdersDelivery {
    payment: string; // Способ оплаты
    address: string; // Адрес доставки
}

// Интерфейс для контактных данных
export interface IOrdersContacts {
    email: string; // Адрес электронной почты
    phone: string; // Номер телефона
}

// Интерфейс для заказа, объединяющий доставку и контакты
export interface IOrder extends IOrdersDelivery, IOrdersContacts {
    total: number | null; // Общая сумма заказа
    items: string[]; // Список ID товаров в заказе
}

// Интерфейс для успешного оформления заказа
export interface IOrderSuccess {
    id: string; // Уникальный идентификатор заказа
    total: number | null; // Итоговая сумма
}

// Интерфейс для отображения успешного оформления заказа
export interface ISuccess {
    image: string; // Изображение успеха
    title: string; // Заголовок сообщения
    description: string; // Описание или текст сообщения
    total: number | null; // Общая сумма
}

// Интерфейс для корзины
export interface IBasket {
    items: HTMLElement[]; // Список элементов корзины
    total: number; // Общая стоимость товаров в корзине
}

// Тип ошибок для форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;