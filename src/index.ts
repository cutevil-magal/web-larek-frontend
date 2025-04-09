import './scss/styles.scss';

import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { ApplicationState, ProductListUpdateEvent } from './components/ApplicationState';
import { ShoppingCart } from './components/ShoppingCart';
import { ProductCard } from './components/ProductCard';
import { LarekApi } from './components/LarekApi';
import { OrdersContacts} from './components/OrdersContacts';
import { OrdersDelivery} from './components/OrdersDelivery';
import { Page } from './components/Page';
import { Success } from './components/Success';

import { IProduct, IOrdersContacts, IOrdersDelivery, PaymentMethod } from './types';

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
const shoppingCart = new ShoppingCart(cloneTemplate(basketContainerTemplate), events);
const deliveryForm = new OrdersDelivery(cloneTemplate(deliveryFormTemplate), events);
const contactsForm = new OrdersContacts(cloneTemplate(contactsFormTemplate), events);
const success = new Success(cloneTemplate(successOrderTemplate), {
    onClick: () => modal.close()
});

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

events.on('productPreview:updated', ({ item }: { item: IProduct }) => {
    const isInCart = appState.shoppingCart.some(p => p.id === item.id);
    const card = new ProductCard(cloneTemplate(productDetailsTemplate), {
        onClick: () => {
            events.emit('item:check', item);
            const currentState = appState.shoppingCart.indexOf(item) >= 0;
            card.updateCartButtonState(currentState);
        }
    });

    // блокировка кнопки для товара "бесценно"
    if (item.price === null) {
        card.initCard(item, true).updateCartButtonState(isInCart, true);
    } 
    else {
        card.initCard(item, true).updateCartButtonState(isInCart);
    }

    modal.render({
        content: card.render()
    });

});



// Выбор товара
events.on('card:select', (item: IProduct) => {
    appState.setProductPreview(item);
});


events.on('item:check', (item: IProduct) => {
    const isInCart = appState.shoppingCart.some(p => p.id === item.id);
    appState.manageCartItem(item, isInCart ? 'remove' : 'add');

});


events.on('shoppingCart:updated', ({ cart, count }: { cart: IProduct[], count: number }) => {
    const basketItems = cart.map((item) => {
        const card = new ProductCard(cloneTemplate(basketItemTemplate), {
            onClick: () => appState.manageCartItem(item, 'remove')
        });
        return card.render({
            title: item.title,
            price: item.price
        });
    });

    shoppingCart.items = basketItems;
    shoppingCart.sum = appState.getTotal();
    shoppingCart.selected = cart.map(item => item.id);
    
    page.counter = count;
});

events.on('basket:open', () => {
    modal.render({
        content: shoppingCart.render()
    });
});

// Оформление заказа
events.on('checkout:initiate', () => { 
    // Сбрасываем данные заказа
    appState.currentOrder = {
        payment: '',
        email: '',
        phone: '',
        address: ''
    };
    modal.render({
        content: deliveryForm.render({
        payment: '',
        address: '',
        valid: false,
        errors: []
        })
    });

});

events.on('payment:changed', (event: { method: PaymentMethod }) => {
    appState.setPaymentMethod(event.method);
});

events.on('delivery:updated', (order: IOrdersDelivery) => {
    deliveryForm.payment = order.payment as PaymentMethod;
});

events.on(/^order\..*:change/, (data: { field: keyof IOrdersDelivery, value: string }) => {
    appState.updateDeliveryInfo(data.field, data.value);
});

events.on('validationDelivery:errors', (errors: Partial<IOrdersDelivery>) => {
    const { address, payment } = errors;
    deliveryForm.valid = !address && !payment;
    deliveryForm.errors = Object.values({address, payment}).filter(Boolean).join('; ');
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

// Отправка заказа
events.on('contacts:submit', () => {
    const orderData = appState.getOrderData();
    api.submitOrder(orderData)
        .then(result => {
            appState.clearCart();
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