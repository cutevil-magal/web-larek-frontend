# Проектная работа "Веб-ларек"
Интернет-магазин с товарами для веб-разработчиков — "Web-ларёк".

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

Интерфейс состояния приложения
```
export interface IApplicationState {
    catalog: IProduct[];                    // Список товаров
    basket: IProduct[];                     // Корзина
    preview: string | null;                 // Товар в режиме предпросмотра
    delivery: IOrdersDelivery | null;       // Данные доставки
    contact: IOrdersContacts | null;        // Контактные данные
    order: IOrder | null;                   // Текущий заказ
}
```

Интерфейс для описания карточки товара
```
export interface IProduct {
    id: string;                 // Уникальный идентификатор товара
    description?: string;       // Описание 
    image: string;              // Ссылка на изображение 
    title: string;              // Название 
    category: string;           // Категория 
    price: number | null;       // Цена 
    buttonText?: string;        // Текст кнопки
}
```

Интерфейс для данных доставки
```
export interface IOrdersDelivery {
    payment: string;    // Способ оплаты
    address: string;    // Адрес доставки
}
```

Интерфейс для контактных данных
```
export interface IOrdersContacts {
    email: string;      // Адрес электронной почты
    phone: string;      // Номер телефона
}
```

Базовый интерфейс для заказа
```
export interface IOrderForm extends IOrdersDelivery, IOrdersContacts {}
```

Интерфейс для полного заказа (для отправки на сервер)
```
export interface IOrder extends IOrderForm {
    items: string[];              // Список ID товаров
    total: number;                // Общая сумма
}
```

Интерфейс для успешного оформления заказа
```
export interface IOrderSuccess {
    id: string;                 // Уникальный идентификатор заказа
    total: number | null;       // Итоговая сумма
}
```

Тип ошибок для форм
```
export type FormErrors = Partial<Record<keyof IOrder, string>>;
```

## Архитектура приложения (MVP)

Model:
- Управляют данными и предоставляют их презентеру.

View:
- View отображает интерфейс (например, каталог товаров и корзину). 
- Реагирует на действия пользователя, такие как нажатие кнопки.

Presenter:
- Обрабатывает события от View (например, добавление товара в корзину).
- Передаёт данные из Model в View для отображения.

## Базовый код

### Класс Api
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы: 
- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.
- `handleRespons` — для обработки ответа сервера, его парсинга и обработки ошибок.

### Класс EventEmitter
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  

Методы:
- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие 
- `onAll` и `offAll` — для подписки на все события и сброса всех подписчиков.

### Класс Component
Базовый класс, от которого наследуются все классы, отвечающие за рендеринг интерфейса на экране. Предоставляет дочерним классам методы для работы с разметкой.

Методы:
- `toggleClass` — переключает класс определенного DOM-элемента,
- `setText` — устанавливает текст в свойство textContent определенного DOM-элемента,
- `setDisabled` — отключает переданный DOM-элемент,
- `setHidden` — скрывает определенный DOM-элемент,
- `setVisible` — отображает определенный DOM-элемент,
- `setImage` — устанавливает изображение (src) и альтернативный текст (alt) для определенного DOM-элемента,
- `render` — возвращает контейнер, из которого элементы разметки создаются с помощью метода replaceChildren.

### Класс Model
Базовый класс, предназначенный для создания данных модели, которые используются для управления данными приложения. Напрямую взаимодействует с EventEmitter, принимая данные модели и аргумент events в конструкторе.

Метод:
- `emitChanges` — уведомляет всех подписчиков о том, что модель была изменена.

## Слой данных

### Класс ApplicationState
Класс для хранения текущего состояния приложения: данных о товарах, корзине, предпросмотре, заказе и ошибках валидации. Наследуется от Model (Model<IApplicationState>).

Класс использует базовый конструктор из родительского класса Model, принимающий объект состояния приложения типа IApplicationState. Также класс инициализирует поля, связанные с состоянием (например, список товаров и корзина).

**Поля**
- `productList: IProduct[]` — хранит список доступных товаров. Обновляется при изменении каталога.
- `shoppingCart: IProduct[]` — хранит товары, добавленные в корзину. Обновляется при добавлении или удалении товаров.
- `currentOrder: IOrderForm` — содержит данные текущего заказа (тип оплаты, контактные данные, адрес доставки).
- `previewItemId: string | null` — идентификатор товара для предпросмотра.
- `validationErrors: FormErrors` — хранит ошибки валидации данных контактной информации и доставки.
- `events: IEvents` — объект для управления событиями приложения.


**Методы**
- Управление товарами:
    - `updateProductList` — обновляет каталог товаров и уведомляет об изменениях,
    - `setProductPreview` — устанавливает товар для предпросмотра.
- Работа с корзиной:
    - `manageCartItem` — добавляет или удаляет товар из корзины,
    - `clearCart` — полностью очищает корзину.
    - `getTotal(): number` - Считает общую сумму товаров в корзине.
- Оформление заказа:
    - `updateDeliveryInfo` — обновляет данные доставки,
    - `updateContactInfo` — обновляет контактные данные.
    - `getOrderData(): IOrder` - Возвращает объект заказа с данными о товарах, общей суммой и информацией доставки.
- Валидация:
    - `validateDelivery` — проверяет корректность данных доставки,
    - `validateContacts` — проверяет корректность контактных данных.


## Классы представления
Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

### Класс ShoppingCart
Класс `ShoppingCart` отвечает за управление функционалом корзины в приложении. Он включает отображение списка товаров, подсчет общей стоимости корзины и обработку событий, связанных с корзиной.  
Класс наследуется от базового класса `Component<IShoppingCartData>`.

**Конструктор класса**

`constructor(container: HTMLElement, events: EventEmitter)` 
Создает экземпляр класса и инициализирует основные элементы корзины.

- `container: HTMLElement` — контейнер, содержащий разметку корзины.
- `events: EventEmitter` — объект для обработки событий приложения.

**Поля класса**
- `itemsContainer: HTMLElement` - контейнер списка товаров
- `sumElement: HTMLElement` - элемент отображения общей суммы
- `checkoutButton: HTMLButtonElement` - кнопка оформления заказа

**Методы**
- `set items(products: HTMLElement[])` - Обновляет список товаров в корзине. Если корзина пуста, отображает сообщение "В корзине нет товаров". Автоматически нумерует позиции товаров.
- `set selected(items: string[])` - Управляет состоянием кнопки оформления заказа (активна/неактивна) в зависимости от наличия товаров.
- `set sum(amount: number)` - Устанавливает и форматирует отображение общей суммы корзины.

---

### Класс ProductCard
Класс `ProductCard` отвечает за управление отображением карточек товаров в приложении, включая отображение информации о товаре (название, категория, цена, изображение) и взаимодействие с карточкой (например, добавление в корзину).  
Класс наследуется от базового класса `Component<IProduct>`.

**Конструктор класса**

`constructor(container: HTMLElement, actions?: ICardActions)`  
Создает экземпляр класса и инициализирует основные элементы карточки товара.

- `container: HTMLElement` — контейнер, содержащий разметку карточки товара.
- `actions?: ICardActions` — объект с обработчиком события клика (опционально).  

**Поля класса**
- `_category: HTMLElement` — отображает категорию товара.
- `_image?: HTMLImageElement` — содержит изображение товара.
- `_title: HTMLElement `— отображает название товара.
- `_description?: HTMLElement` — отображает описание товара.
- `_price?: HTMLElement` — отображает цену товара.
- `_button?: HTMLButtonElement` — кнопка взаимодействия с карточкой (например, «Добавить в корзину»).

**Методы**

- `set id(value: string)` — устанавливает уникальный идентификатор товара в атрибут data-id.
- `set title(value: string)` — устанавливает текст названия товара.
- `set image(value: string)` — устанавливает URL изображения товара и alt-текст.
- `set description(value: string | string[])` — устанавливает описание товара, поддерживает как строку, так и массив строк.
- `set button(value: string)` — устанавливает текст кнопки (например, «Добавить в корзину»).
- `set price(value: number | null)` — устанавливает цену товара. Если цена отсутствует (null), отображается «Бесценно».
- `set category(value: string)` — устанавливает категорию товара и добавляет соответствующий класс для стилизации.
 - `set buttonText(value: string)` - Устанавливает текст кнопки (например, "В корзину" или "Убрать из корзины"), если кнопка существует.
- `toggleCategoryClass(category: string): void` - Переключает классы категории товара в зависимости от указанной категории. Использует классы из объекта categories.
- `initCard(item: IProduct, isDetailedView: boolean = false): this` — метод для полной инициализации карточки. Устанавливает данные для всех полей карточки.
- `updateCartButtonState(isInCart: boolean): void` — метод для обновления состояния кнопки (например, переключение текста на «Убрать из корзины» или «В корзину»).

---

### Класс OrdersDelivery
Класс `OrdersDelivery` отвечает за отображение и управление формой ввода данных для доставки. Поддерживает выбор способа оплаты и обработку событий формы.  
Класс наследуется от базового класса `Form<IOrdersDelivery>`.

**Конструктор класса**

`constructor(container: HTMLFormElement, events: IEvents)`  
Создает экземпляр класса и инициализирует основные элементы формы доставки.

- `container: HTMLFormElement` — контейнер, содержащий разметку формы.
- `events: IEvents` — объект для обработки событий приложения.

**Поля класса**
- `paymentButtons: Record<PaymentMethod, HTMLButtonElement>` — кнопки для выбора способа оплаты (карта или наличные).

**Методы**
- `set address(value: string)` — задает значение адреса доставки в соответствующее поле формы.
- `set payment(method: PaymentMethod)` - Устанавливает выбранный метод оплаты, вызывая приватный метод togglePaymentMethod.
- `togglePaymentMethod(method: PaymentMethod): void` - Переключает активный класс кнопки оплаты в зависимости от указанного метода.
- `setupPaymentButtons(): void` - Устанавливает обработчики событий для кнопок оплаты, которые переключают метод оплаты и отправляют событие payment:changed.
- `setInputValue(name: string, value: string): void` - Находит элемент с заданным именем внутри контейнера и устанавливает его значение.
---

### Класс OrdersContacts
Класс `OrdersContacts` отвечает за отображение и управление формой ввода контактных данных.  
Класс наследуется от базового класса `Form<IOrdersContacts>`.

**Конструктор класса**
`constructor(container: HTMLFormElement, events: IEvents)`  
Создает экземпляр класса и инициализирует основные элементы формы.
- `container: HTMLFormElement` — контейнер, содержащий разметку формы.
- `events: IEvents` — объект для обработки событий приложения.

**Методы**
- `set phone(value: string)` — задает значение телефонного номера в соответствующее поле формы.
- `set email(value: string)` — задает значение электронной почты в соответствующее поле формы.
- `private setInputValue(name: string, value: string): void` - Метод для установки значения поля ввода формы по имени.
---

### Класс Modal
Класс `Modal` отвечает за управление модальным окном в приложении, включая отображение контента, обработку событий открытия и закрытия окна.  
Класс наследуется от базового класса `Component<IModalData>`.

**Конструктор класса**

`constructor(container: HTMLElement, events: IEvents)`  
Создает экземпляр класса и инициализирует основные элементы модального окна.

- `container: HTMLElement` — контейнер, содержащий разметку модального окна.
- `events: IEvents` — объект для обработки событий приложения.

**Поля класса**
- `_closeButton: HTMLButtonElement`  - Кнопка закрытия модального окна (`.modal__close`).
- `_content: HTMLElement`  - Контейнер для отображения контента внутри модального окна (`.modal__content`).


**Методы**

- `set content(value: HTMLElement)`  - Устанавливает новый контент в модальном окне.
- `open()`  -  Открывает модальное окно.  
- `close()`  - Закрывает модальное окно.  
- `render(data: IModalData): HTMLElement`  - Рендерит модальное окно с указанным контентом.

---

### Класс Success
Класс `Success` отвечает за отображение информации об успешном выполнении заказа, включая отображение итоговой суммы и обработку события закрытия модального окна. Класс наследуется от базового класса `Component<ISuccess>`.

**Конструктор класса**

`constructor(container: HTMLElement, actions: ISuccessActions)`  
Создает экземпляр класса и инициализирует основные элементы модального окна с информацией об успешной покупке.

- `container: HTMLElement` — контейнер, содержащий разметку сообщения об успехе.
- `actions: ISuccessActions` — объект с обработчиком события клика на кнопку закрытия.

**Поля класса**
- `elements.closeButton: HTMLButtonElement` — кнопка для закрытия окна успешного выполнения заказа.
- `elements.description: HTMLElement` — элемент для отображения текста с информацией о списанной сумме.

**Методы**
- `set total(value: number | null)` Устанавливает текст в элементе description, отображая общую сумму, которая была списана. Если сумма отсутствует (null), текст будет пустым или может быть обработан другим образом.

---

### Класс Page
Класс `Page` управляет основными элементами интерфейса страницы, включая список товаров, счетчик корзины и прокрутку.  
Класс наследуется от базового класса `Component<IPage>`.

**Конструктор класса**

`constructor(container: HTMLElement, events: IEvents)`  
Создает экземпляр класса и инициализирует основные элементы страницы.

- `container: HTMLElement` — контейнер, содержащий разметку страницы.
- `events: IEvents` — объект для обработки событий приложения.

**Поля класса**
- `elements.counter: HTMLElement` — элемент, отображающий счетчик товаров в корзине.
- `elements.catalog: HTMLElement` — элемент, содержащий список товаров (каталог).
- `elements.wrapper: HTMLElement` — обертка страницы, используется для управления прокруткой.
- `elements.basket: HTMLElement` — элемент корзины для добавления обработчика открытия.

**Методы**
- `set counter(value: number)` Устанавливает значение счетчика товаров в корзине. Отображает это значение в элементе elements.counter.
- `set catalog(items: HTMLElement[])` Обновляет содержимое каталога товаров, заменяя текущие элементы на переданные items.
- `set locked(value: boolean)` Управляет блокировкой прокрутки страницы, добавляя или удаляя CSS-класс page__wrapper_locked.

---
### Класс Form
Класс `Form` является базовым компонентом для работы с формами. Он предоставляет общую функциональность для обработки ввода данных, управления состоянием формы и обработки событий.  
Класс наследуется от базового класса `Component<IFormState>`.

**Конструктор класса**

`constructor(container: HTMLFormElement, events: IEvents)`  
Создает экземпляр класса и инициализирует основные элементы формы.

- `container: HTMLFormElement` — контейнер, содержащий разметку формы.
- `events: IEvents` — объект для обработки событий приложения.

**Поля класса**
- `_submit: HTMLButtonElement`  - Кнопка отправки формы (`button[type=submit]`).
- `_errors: HTMLElement`  - Элемент для отображения ошибок формы (`.form__errors`).

**Методы**

- `protected onInputChange(field: keyof T, value: string)`  -Обрабатывает изменения в полях формы.
- `set valid(value: boolean)`  -  Устанавливает валидность формы, блокируя или разблокируя кнопку отправки.
- `set errors(value: string)`  - Устанавливает текст ошибок в элемент `_errors`.
- `render(state: Partial<T> & IFormState): HTMLElement`  - Рендерит состояние формы, включая валидность и ошибки.


## Слой коммуникации
#### Класс LarekApi
Класс LarekApi предназначен для взаимодействия с API приложения. Он наследуется от базового класса Api и реализует интерфейс ILarekApi.

**Конструктор класса**
`constructor(cdnBaseUrl: string, apiBaseUrl: string, options?: RequestInit)` Создает экземпляр класса и задает базовый URL для CDN-изображений и API.

- `cdnBaseUrl: string` — базовый URL-адрес CDN для получения изображений товаров.
- `apiBaseUrl: string` — базовый URL-адрес API для выполнения запросов.
- `options?: RequestInit` — параметры запроса, передаваемые в HTTP-клиент.

**Поля класса**
- `cdnBaseUrl: string` — хранит базовый URL для CDN, используемый при обработке изображений товаров.

**Методы**:
- `async fetchProductList(): Promise<IProduct[]>` Получает список товаров с API, обрабатывая изображения, добавляя к ним CDN-префикс. Возвращает массив объектов IProduct.
- `async submitOrder(order: IOrder): Promise<IOrderSuccess>` Отправляет заказ на сервер с помощью POST-запроса. Возвращает объект IOrderSuccess.
- `private processProductImages(products: IProduct[]): IProduct[]` Обрабатывает список товаров, добавляя к URL их изображений базовый CDN-префикс. Возвращает массив обработанных товаров.

## Взаимодействие компонентов
Код, описывающий взаимодействие представления и данных между собой, находится в файле index.ts, выполняющем роль презентера.

Взаимодействие осуществляется за счет событий, генерируемых с помощью брокера событий и обработчиков этих событий, описанных в index.ts.

В index.ts сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

### Обрабатываемые события (в классе EventEmitter):

**Товар**

- `productList:updated` - Обновляет каталог товаров на странице
    - Устанавливает для карточки обработчик события `card:select`, чтобы реагировать на выбор товара.
    - Подписывается на обновление корзины, чтобы обновить состояние кнопок "В корзину".
- `productPreview:updated` - Выполняет запрос на получение данных о товаре по ID.
    - Кнопка «Добавить в корзину» получает обработчик события клика, запускающий событие `item:check`.
    - Подписывается на обновление корзины, чтобы синхронизировать состояние кнопки "В корзину"
- `card:select` - Устанавливает товар в качестве текущего для предпросмотра
- `item:check` - Добавляет или удаляет товар из корзины в зависимости от текущего состояния.

**Корзина**

- `shoppingCart:updated` - Обновляет содержимое корзины и общую сумму
- `basket:open` - Открывает модальное окно с содержимым корзины

**Заказ**

- `checkout:initiate` - Инициализирует процесс оформления заказа
- `payment:changed` - Обрабатывает изменение способа оплаты
- `order..*:change` - Обновляет данные формы доставки
- `contacts..*:change` - Обновляет контактную информацию
- `validationDelivery:errors` - Обрабатывает ошибки валидации формы доставки.
- `validationContacts:errors` - Обрабатывает ошибки валидации контактной формы
- `deliveryInfo:updated` - Обновляет валидный статус формы доставки
- `contactInfo:updated` - Обновляет валидный статус формы контактной информации.
- `order:submit` - Открывает модальное окно с формой ввода контактной информации
- `contacts:submit` - Отправляет заказ на сервер

**Модальные окна**

- `modal:open` - Блокирует контент страницы под модальным окном.
- `modal:close` - Разблокирует контент страницы под модальным окном