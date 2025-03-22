// -------------------------------------------------------- Model -------------------------------------------------------

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
    
    getAllProducts(): ProductItem[];                        // Возвращает весь список продуктов
    getProductById(productId: string): ProductItem | null;  // Возвращает продукт по ID
    saveProducts(products: ProductItem[]): void;            // Сохраняет массив товаров
}

interface Cart {
    items: ProductItem[]; // Список товаров в корзине

    getTotalPrice(): number;          // Рассчитать общую стоимость товаров
    getQuantity(): number;            // Рассчитать общее количество товаров
    isEmpty(): boolean;               // Проверить, пуста ли корзина

    addItem(product: ProductItem): void;    // Добавить товар
    removeItem(productId: string): void;    // Удалить товар по ID
    calculateTotal(): number;               // Пересчитать общую стоимость (доп. метод, если нужно)
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
    
    initializeOrder(total: number, items: string[]):void;               // Инициализация заказа на основе корзины
    setPaymentAddressMethod(payment: string, address: string): void;    // Установить оплату и адрес
    setCustomerDetails(email: string, phone: string): void;             // Установить данные покупателя
    finalizeOrder(): string;                                            // Завершение заказа
    validateInput(field: string, value: any): boolean;                  // Проверка входных данных
}

// -------------------------------------------------------- View -------------------------------------------------------

// Интерфейс для GlobalViewController
interface GlobalViewController {
    closeModal(): void; // Закрывает любое модальное окно
}

// Интерфейс для ProductListView
interface ProductListView {
    renderProductList(products: ProductItem[]): void;   // Отображает каталог продуктов
    showProductDetails(product: ProductItem): void;     // Открывает модальное окно с детальной информацией
}

// Интерфейс для CartView
interface CartView {
    renderCart(cartItems: ProductItem[]): void;         // Отображает содержимое корзины
    showCart(): void;                                   // Открывает модальное окно корзины
    updateCartIcon(cartItems: ProductItem[]): void;     // Обновляет визуальное состояние и иконку корзины
}

// Интерфейс для OrderView
interface OrderView {
    showOrderForm(): void;                              // Показывает интерфейс для оформления заказа
    showErrorMessage(message: string): void;            // Отображает сообщение об ошибке
}

// -------------------------------------------------------- Presenter -------------------------------------------------------
interface Presenter {
    loadProducts(): void;                                                                   // Загружает список продуктов и передает их View
    showProductDetails(productId: string): void;                                            // Показывает детали продукта
    addProductToCart(productId: string): void;                                              // Добавляет продукт в корзину
    removeProductFromCart(productId: string): void;                                         // Удаляет продукт из корзины
    checkout(paymentMethod: string, address: string, email: string, phone: string): void;   // Оформляет заказ
    validateOrderDetails(address: string, email: string, phone: string): boolean;           // Проверяет корректность введённых данных
    updateCartIcon(): void;                                                                 // Обновляет иконку корзины
    handleUserActions(action: string, data: any): void;                                     // Обрабатывает действия пользователя
}
