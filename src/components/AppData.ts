import { FormErrors, IAppState, IProduct, IOrder, IOrdersContacts, IOrdersDelivery } from '../types/index';
import { Model } from './base/Model';
import { IEvents } from './base/events';

export type ProductListUpdateEvent = {
    products: IProduct[];
};

export class ApplicationState extends Model<IAppState> {
    productList: IProduct[] = [];
    shoppingCart: IProduct[] = [];
    currentOrder: IOrder = {
        payment: 'online',
        email: '',
        phone: '',
        address: '',
        total: 0,
        items: [],
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

    // Управление корзиной
    manageCartItem(product: IProduct, action: 'add' | 'remove'): void {
        if (action === 'add') {
            if (!this.shoppingCart.includes(product)) {
                this.shoppingCart.push(product);
            }
        } else {
            this.shoppingCart = this.shoppingCart.filter(item => item !== product);
        }
        this.emitCartUpdates();
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
        this.emitCartUpdates();
    }

    // Валидация доставки
    private validateDelivery(): boolean {
        const errors: typeof this.validationErrors = {};
        if (!this.currentOrder.address) {
            errors.address = 'Укажите адрес доставки';
        }
        this.validationErrors = errors;
        this.events.emit('validationDelivery:errors', this.validationErrors);
        return Object.keys(errors).length === 0;
    }

    // Валидация контактов
    private validateContacts(): boolean {
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

    // Уведомления об изменении корзины
    private emitCartUpdates(): void {
        this.emitChanges('shoppingCart:updated', { cart: this.shoppingCart });
        this.emitChanges('cartItemCount:changed', { count: this.shoppingCart.length });
    }
}