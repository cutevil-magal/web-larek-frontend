// Интерфейс состояния приложения
export interface IApplicationState {
    catalog: IProduct[];                    // Список товаров
    basket: IProduct[];                     // Корзина
    preview: string | null;                 // Товар в режиме предпросмотра
    delivery: IOrdersDelivery | null;       // Данные доставки
    contact: IOrdersContacts | null;        // Контактные данные
    order: IOrder | null;                   // Текущий заказ
}

// Интерфейс для описания карточки товара
export interface IProduct {
    id: string;                 // Уникальный идентификатор товара
    description?: string;       // Описание 
    image: string;              // Ссылка на изображение 
    title: string;              // Название 
    category: string;           // Категория 
    price: number | null;       // Цена 
    buttonText?: string;        // Текст кнопки
}

// Интерфейс для данных доставки
export interface IOrdersDelivery {
    payment: string;    // Способ оплаты
    address: string;    // Адрес доставки
}

// Интерфейс для контактных данных
export interface IOrdersContacts {
    email: string;      // Адрес электронной почты
    phone: string;      // Номер телефона
}

// Базовый интерфейс для заказа 
export interface IOrderForm extends IOrdersDelivery, IOrdersContacts {}

// Интерфейс для полного заказа (для отправки на сервер)
export interface IOrder extends IOrderForm {
    items: string[];              // Список ID товаров
    total: number;                // Общая сумма
}

// Интерфейс для успешного оформления заказа
export interface IOrderSuccess {
    id: string;                 // Уникальный идентификатор заказа
    total: number | null;       // Итоговая сумма
}

// Тип ошибок для форм
export type FormErrors = Partial<Record<keyof IOrder, string>>;