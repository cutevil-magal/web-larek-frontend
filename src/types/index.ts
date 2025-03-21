// Интерфейс для работы с данными товаров
interface ProductItem {
    id: string;          // Уникальный идентификатор
    title: string;       // Название продукта
    category: string;    // Тип или категория продукта
    description: string; // Дополнительная информация
    price: number;       // Стоимость продукта
    image: string;       // Ссылка на изображение
}

// Интерфейс для работы с данными товаров
interface ProductList {
    total: number;              // Общее количество продуктов
    items: ProductItem[];       // Массив объектов ProductItem
    
    getAllProducts(): ProductItem[]; // Возвращает весь список продуктов
    getProductById(productId: string): ProductItem | null; // Возвращает продукт по ID
}

// Интерфейс для корзины
interface Cart {
    items: ProductItem[]; // Список товаров в корзине
    totalPrice: number;   // Общая стоимость товаров
    quantity: number;     // Общее количество товаров
    isEmpty: boolean;     // Проверка, пуста ли корзина
    
    addItem(product: ProductItem): void;     // Добавить товар
    removeItem(productId: string): void;    // Удалить товар по ID
    calculateTotal(): number;               // Пересчитать общую стоимость
    clearCart(): void;                      // Очистить корзину
    getItems(): ProductItem[];              // Получить список товаров
    isInCart(productId: string): boolean;   // Проверить наличие товара в корзине
}

// Интерфейс для работы с заказами
interface Order {
    payment: string;     // Способ оплаты (наличные, онлайн)
    email: string;       // Email покупателя
    phone: string;       // Телефон покупателя
    address: string;     // Адрес доставки
    total: number;       // Общая стоимость заказа
    items: string[];     // Массив ID товаров
    
    startOrder(cart: Cart): void;             // Инициализация заказа
    setPaymentAddressMethod(payment: string, address: string): void; // Установить оплату и адрес
    setCustomerDetails(email: string, phone: string): void;          // Установить данные покупателя
    finalizeOrder(): string;                // Завершение заказа
    validateInput(field: string, value: any): boolean; // Проверка входных данных
}



