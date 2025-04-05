import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { ApplicationState, ProductListUpdateEvent } from './components/AppData';
import { ShoppingCart } from './components/Basket';
import { ProductCard } from './components/Card';
import { LarekApi } from './components/LarekApi';
import { OrdersDelivery, PaymentMethod, paymentMethodStyle, OrdersContacts} from './components/Order';
import { Page } from './components/Page';
import { Success } from './components/Success';

import { IProduct, IOrdersContacts, IOrdersDelivery } from './types';

const events = new EventEmitter();
const api = new LarekApi(CDN_URL, API_URL);

events.onAll(({ eventName, data }) => {
    console.log(eventName, data);
})

// Шаблоны карточек товаров
const productCardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const productDetailsTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
// Шаблоны корзины
const basketContainerTemplate = ensureElement<HTMLTemplateElement>('#basket');
const basketItemTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
// Шаблоны оформления заказа
const deliveryFormTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsFormTemplate = ensureElement<HTMLTemplateElement>('#contacts');
// Шаблон успешного заказа
const successOrderTemplate = ensureElement<HTMLTemplateElement>('#success');

// Инициализация состояния приложения
const appState = new ApplicationState({}, events);

// Создание основных компонентов
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new ShoppingCart(cloneTemplate(basketContainerTemplate), events);
const deliveryForm = new OrdersDelivery(cloneTemplate(deliveryFormTemplate), events, {
    onClick: (event: Event) => events.emit('payment:changed', event.target)
});
const contactsForm = new OrdersContacts(cloneTemplate(contactsFormTemplate), events);

/* Основные обработчики событий */

// Обновление каталога товаров
events.on<ProductListUpdateEvent>('productList:updated', () => {
    page.catalog = appState.productList.map(item => {
        const card = new ProductCard(cloneTemplate(productCardTemplate), {
            onClick: () => events.emit('card:select', item)
        });
        card.initCard(item);
        return card.render();
    });
});

// Просмотр деталей товара
events.on('productPreview:updated', ({ item }: { item: IProduct }) => {
    const isInCart = appState.shoppingCart.includes(item);
    const card = new ProductCard(cloneTemplate(productDetailsTemplate), {
        onClick: () => {
            events.emit('item:check', item);
            card.updateCartButtonState(!isInCart);
        }
    });
    card.initCard(item, true).updateCartButtonState(isInCart);
    modal.render({
        content: card.render()
    });
});

// Выбор товара
events.on('card:select', (item: IProduct) => {
    appState.setProductPreview(item);
});

// Проверка наличия товара в корзине
events.on('item:check', (item: IProduct) => {
    if (!appState.shoppingCart.includes(item)) {
        events.emit('item:add', item);
    } else {
        events.emit('item:remove', item);
    }
});

// Добавление товара в корзину
events.on('item:add', (item: IProduct) => {
    appState.manageCartItem(item, 'add');
});

// Удаление товара из корзины
events.on('item:remove', (item: IProduct) => {
    appState.manageCartItem(item, 'remove');
});

// Работа с корзиной
events.on('shoppingCart:updated', ({ cart }: { cart: IProduct[] }) => {
    basket.items = cart.map(item => {
        const card = new ProductCard(cloneTemplate(basketItemTemplate), {
            onClick: () => events.emit('item:remove', item)
        });
        return card.render({
            title: item.title,
            price: item.price
        });
    });

    const total = basket.calculateTotal(cart);
    basket.sum = total;
    appState.currentOrder.total = total;
    basket.selected = cart.map(item => item.id);
});

// Обновление счетчика товаров
events.on('cartItemCount:changed', ({ count }: { count: number }) => {
    page.counter = count;
});

// Управление корзиной
events.on('item:add', (item: IProduct) => {
    appState.manageCartItem(item, 'add');
});

events.on('item:remove', (item: IProduct) => {
    appState.manageCartItem(item, 'remove');
});

events.on('shoppingCart:updated', ({ cart }: { cart: IProduct[] }) => {
    // Преобразуем товары в HTMLElement для корзины
    const basketItems = cart.map((item, index) => {
        const card = new ProductCard(cloneTemplate(basketItemTemplate), {
            onClick: () => events.emit('item:remove', item)
        });
        
        const element = card.render({
            title: item.title,
            price: item.price
        });
        
        return element;
    });

    // Устанавливаем элементы в корзину
    basket.items = basketItems;
    
    // Обновляем общую сумму
    const total = cart.reduce((sum, item) => sum + (item.price || 0), 0);
    basket.sum = total;
    appState.currentOrder.total = total;
    
    // Управляем состоянием кнопки
    basket.selected = cart.map(item => item.id);
});

events.on('basket:open', () => {
    modal.render({
        content: basket.render()
    });
});

// Оформление заказа
events.on('checkout:initiate', () => { 
    modal.render({
        content: deliveryForm.render({
        payment: '',
        address: '',
        valid: false,
        errors: []
        })
    });
    appState.currentOrder.items = appState.shoppingCart.map(item => item.id);
});

events.on('payment:changed', (target: HTMLElement) => {
    const buttonName = target.getAttribute('name');
    
    // Проверяем что это действительно платежная кнопка
    if (buttonName && (buttonName in paymentMethodStyle)) {
        const paymentType = buttonName as PaymentMethod;
        deliveryForm.setActivePaymentMethod(paymentType);
        appState.currentOrder.payment = paymentMethodStyle[paymentType];
    }
});

events.on(/^order\..*:change/, (data: { field: keyof IOrdersDelivery, value: string }) => {
    appState.updateDeliveryInfo(data.field, data.value);
});

events.on('validationDelivery:errors', (errors: Partial<IOrdersDelivery>) => {
    const { address, payment } = errors;
    deliveryForm.valid = !address && !payment;
    deliveryForm.errors = Object.values({address, payment}).filter(Boolean).join('; ');
});

events.on('deliveryInfo:updated', () => {
    deliveryForm.valid = true;
});

events.on('order:submit', () => {
    modal.render({
        content: contactsForm.render({
        email: '',
        phone: '',
        valid: false,
        errors: []
        })
    });
});

events.on(/^contacts\..*:change/, (data: { field: keyof IOrdersContacts, value: string }) => {
    appState.updateContactInfo(data.field, data.value);
});

events.on('validationContacts:errors', (errors: Partial<IOrdersContacts>) => {
    const { email, phone } = errors;
    contactsForm.valid = !email && !phone;
    contactsForm.errors = Object.values({email, phone}).filter(Boolean).join('; ');
});

events.on('contactInfo:updated', () => {
    contactsForm.valid = true;
});

// Отправка заказа
events.on('contacts:submit', () => {
    api.submitOrder(appState.currentOrder)
    .then(result => {
        appState.clearCart();
        const success = new Success(cloneTemplate(successOrderTemplate), {
            onClick: () => modal.close()
        });
        modal.render({
            content: success.render({
                total: result.total
            })
        });
    })
    .catch(console.error);
});

// Управление модальным окном
events.on('modal:open', () => {
    page.locked = true;
});

events.on('modal:close', () => {
    page.locked = false;
});

// Загрузка данных
api.fetchProductList()
    .then(appState.updateProductList.bind(appState))
    .catch(console.error);