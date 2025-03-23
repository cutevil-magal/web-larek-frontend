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
