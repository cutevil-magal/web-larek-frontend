import { FormErrors, IApplicationState, IProduct, IOrder, IOrderForm, IOrdersContacts, IOrdersDelivery } from '../types/index';
import { Model } from './base/Model';
import { IEvents } from './base/events';

export type ProductListUpdateEvent = {
    products: IProduct[];
};

export class ApplicationState extends Model<IApplicationState> {
    productList: IProduct[] = [];
    shoppingCart: IProduct[] = [];
    currentOrder: IOrderForm = {
        payment: 'online',
        email: '',
        phone: '',
        address: ''
    };
    previewItemId: string | null = null;
    validationErrors: FormErrors = {};
    protected events!: IEvents;

    // Обновление списка товаров
    updateProductList(items: IProduct[]): void {
        this.productList = items;
        this.emitChanges('productList:updated', { products: this.productList });
    }

    // Установка товара для предпросмотра
    setProductPreview(item: IProduct): void {
        this.previewItemId = item.id;
        this.emitChanges('productPreview:updated', {item});
    }

    manageCartItem(product: IProduct, action: 'add' | 'remove'): void {
        if (action === 'add') {
            if (!this.shoppingCart.some(p => p.id === product.id)) {
                this.shoppingCart.push(product);
            }
        } else {
            this.shoppingCart = this.shoppingCart.filter(item => item.id !== product.id);
        }
        this.emitChanges('shoppingCart:updated', { 
            cart: this.shoppingCart,
            count: this.shoppingCart.length 
        });
    }

    // Обновление данных доставки
    updateDeliveryInfo(field: keyof IOrdersDelivery, value: string): void {
        (this.currentOrder as any)[field] = value;
        if (this.validateDelivery()) {
            this.emitChanges('deliveryInfo:updated', { order: this.currentOrder });
        }
    }

    // Обновление контактных данных
    updateContactInfo(field: keyof IOrdersContacts, value: string): void {
        (this.currentOrder as any)[field] = value;
        if (this.validateContacts()) {
            this.emitChanges('contactInfo:updated', { order: this.currentOrder });
        }
    }

    // Очистка корзины
    clearCart(): void {
        this.shoppingCart = [];
        this.emitChanges('shoppingCart:updated', { 
            cart: this.shoppingCart,
            count: 0
        });
    }

    // Получение данных для заказа
    getOrderData(): IOrder {
        return {
            ...this.currentOrder,
            items: this.shoppingCart.map(item => item.id),
            total: this.getTotal()
        };
    }
    
    // Подсчет общей суммы 
    getTotal(): number {
        return this.shoppingCart.reduce((total, item) => total + (item.price || 0), 0);
    }

    // Валидация доставки
    validateDelivery(): boolean {
        const errors: typeof this.validationErrors = {};
        if (!this.currentOrder.address) {
            errors.address = 'Укажите адрес доставки';
        }
        this.validationErrors = errors;
        this.events.emit('validationDelivery:errors', this.validationErrors);
        return Object.keys(errors).length === 0;
    }

    // Валидация контактов
    validateContacts(): boolean {
        const errors: typeof this.validationErrors = {};
        if (!this.currentOrder.email) {
            errors.email = 'Укажите email';
        }
        if (!this.currentOrder.phone) {
            errors.phone = 'Укажите телефон';
        }
        this.validationErrors = errors;
        this.events.emit('validationContacts:errors', this.validationErrors);
        return Object.keys(errors).length === 0;
    }
}