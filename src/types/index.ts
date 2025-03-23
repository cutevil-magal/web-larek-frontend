// Интерфейс для работы с данными товаров
interface ProductItem {
    id: string;             // Уникальный идентификатор
    title: string;          // Название продукта
    category: string;       // Тип или категория продукта
    description: string;    // Дополнительная информация
    price: number|null;     // Стоимость продукта
    image: string;          // Ссылка на изображение
}

// Интерфейс для работы с данными товаров
interface ProductList {          
    items: ProductItem[];       // Массив объектов ProductItem
    preview: string | null; //id карточки, выбранной для просмотра в модальной окне
}

interface Cart {
    items: ProductItem[]; // Список товаров в корзине
}

// Интерфейс для работы с заказами
interface Order {
    payment: string;     // Способ оплаты (наличные, онлайн)
    email: string;       // Email покупателя
    phone: string;       // Телефон покупателя
    address: string;     // Адрес доставки
}

// Данные товара, используемые в модальном окне
type ProductInfo = Pick<ProductItem, 'title' | 'category' | 'description' | 'price' | 'image'>;

// Данные товара, используемые при отображении в списке всех товаров
type ProductListItem = Pick<ProductItem, 'title' | 'category' | 'price' | 'image'>;

// Данные заказа, оплата и адрес
type PaymentAddressMethod = Pick<Order, 'payment' | 'address'>;

// Данные заказа, данные покупателя
type CustomerDetails = Pick<Order, 'email' | 'phone'>;

  
// // -------------------------------------------------------- View -------------------------------------------------------


// // Интерфейс для ProductListView
// interface ProductListView {
//     renderProductList(products: ProductItem[]): void;   // Отображает каталог продуктов
// }

// // Интерфейс для CartView
// interface CartView {
//     renderCart(cartItems: ProductItem[]): void;         // Отображает содержимое корзины
// }

// // Интерфейс для OrderView
// interface OrderView {
//     showOrderForm(): void;                              // Показывает интерфейс для оформления заказа
//     showErrorMessage(message: string): void;            // Отображает сообщение об ошибке
// }

// // -------------------------------------------------------- Presenter -------------------------------------------------------
// interface Presenter {
//     loadProducts(): void;                                                                   // Загружает список продуктов и передает их View
//     showProductDetails(productId: string): void;                                            // Показывает детали продукта
//     addProductToCart(productId: string): void;                                              // Добавляет продукт в корзину
//     removeProductFromCart(productId: string): void;                                         // Удаляет продукт из корзины
//     checkout(paymentMethod: string, address: string, email: string, phone: string): void;   // Оформляет заказ
//     validateOrderDetails(address: string, email: string, phone: string): boolean;           // Проверяет корректность введённых данных
//     updateCartIcon(): void;                                                                 // Обновляет иконку корзины
//     handleUserActions(action: string, data: any): void;                                     // Обрабатывает действия пользователя
//     openModal(modalId: string): void; // Открытие модального окна
//     closeModal(modalId: string): void; // Закрытие модального окна
// }

// // // Интерфейс для работы с данными отдельного товара
// // export interface IProductItem {
// //     getProperty<K extends keyof IProductItem>(key: K): IProductItem[K];
// //     setProperty<K extends keyof IProductItem>(key: K, value: IProductItem[K]): void;
// //   }
  
// //   // Интерфейс для управления списком товаров
// //   export interface IProductList {
// //     getProducts(): IProductItem[];
// //   }