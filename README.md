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
## Паттерн программирования MVP
Model:
- Классы Product List, Product Item, Cart, Order образуют часть Model. 
- Управляют данными и предоставляют их презентеру.

View:
- View отображает интерфейс (например, каталог товаров и корзину). 
- Реагирует на действия пользователя, такие как нажатие кнопки.

Presenter (Презентер (брокер событий) связывает View и Model):
- Обрабатывает события от View (например, добавление товара в корзину).
- Передаёт данные из Model в View для отображения.

<h1>Функции View</h1>
View отвечает за отображение интерфейса и обработку действий пользователя.

Класс GlobalViewController - объединяет функциональность всех представлений (ProductListView, CartView, OrderView).
1. closeModal():
- Закрывает любое модальное окно (например, корзину или детали продукта).

Класс ProductListView - отвечает за отображение каталога товаров и взаимодействие с пользователем при выборе товара.
1. renderProductList(products):
- Отображает каталог продуктов на главной странице.
2. showProductDetails(product):
- Открывает модальное окно с детальной информацией о выбранном продукте.

Класс CartView - Управляет отображением корзины и обновлением её статуса на странице.
1. renderCart(cartItems):
- Отображает содержимое корзины.
2. showCart():
- Открывает модальное окно корзины.
3. updateCartIcon(cartItems):
- Обновляет визуальное состояние и количество товаров в иконке корзины.

Класс OrderView - Отвечает за отображение процесса оформления заказа и уведомлений для пользователя
1. showOrderForm():
- Показывает интерфейс для оформления заказа.
2. showErrorMessage(message):
- Отображает сообщение об ошибке, например, если адрес доставки не введён или поля заказа не заполнены.


<h1>Функции Presenter</h1>
Presenter управляет взаимодействием между Model и View, обрабатывает события от View и отправляет команды Model.
-реализация презентера как отдельного класса, который управляет взаимодействием между Model и View.

loadProducts():
- Загружает список продуктов из Model и передаёт его View для отображения.

showProductDetails(productId):
- Получает данные продукта из Model и вызывает метод View для отображения деталей.

addProductToCart(productId):
- Добавляет выбранный продукт в корзину через Model и обновляет View.

removeProductFromCart(productId):
- Удаляет продукт из корзины через Model и обновляет View.

checkout(cart, paymentMethod, address, email, phone):
- Передаёт данные заказа в Model для создания заказа и обновляет View.

validateOrderDetails(address, email, phone):
- Проверяет корректность введённых данных через Model и передаёт результат View.

updateCartIcon():
- Запрашивает данные корзины из Model и обновляет состояние иконки корзины в View.

handleUserActions(action, data):
- Универсальная функция для обработки любых действий пользователя (например, кликов, ввода данных).

## Базовый код

<a href="https://viewer.diagrams.net/?tags=%7B%7D&lightbox=1&highlight=0000ff&edit=_blank&layers=1&nav=1&title=%D0%94%D0%B8%D0%B0%D0%B3%D1%80%D0%B0%D0%BC%D0%BC%D0%B0%20UML.drawio&dark=auto#R%3Cmxfile%3E%3Cdiagram%20id%3D%22C5RBs43oDa-KdzZeNtuy%22%20name%3D%22Page-1%22%3E7V1pc%2BK4Fv01VOW9qqS8YeAjkGXSk0zTnfQyn6YULMATYfFs0YT8%2BifJFthIXki80IGqrgoWso3vOXfVlbtlDucvNz5YzO6xA1HL0JyXlnnZMgzdMNv0DxtZhyO2YYUDU991oknbgQf3FUaDWjS6dB0YJCYSjBFxF8nBMfY8OCaJMeD7eJWcNsEoedcFmEJp4GEMkDz6w3XILBztGp3t%2BB%2FQnc7EnXW7F34zB2Jy9CTBDDh4FRsyr1rm0MeYhJ%2FmL0OImPCEXH7crn%2Bgu2f75tOX4H%2Fg2%2BDPx7%2B%2Bn4cXu97nlM0j%2BNAjb7708%2FX8U%2FCjM7lvo8%2FDy8dR37xenJvRw%2F4CaBkJLHpYshYS9PHScyC7itYyB6uZS%2BDDAozZtyvKGTo2I3NEj3T6EYEniAZg%2FDzlpw0xwj79ysMenT%2BYuAjtDDkgmPGLs7OjHwN9Al924Mt5dn0DCGUyxHNI%2FDU9T1xFizCMSGxGHF5tGWGKKbMYG2zdjpgYsXC6ufRW0vRDJGy14Efw7u%2FhgNx8niDw6sG%2F%2Fvn67fO53T1AwReTsgKgVMH3EmLvtDVJ7l1dIXezp71f7q%2FPk%2Bs%2Fvlv%2F%2FlyMrr%2BstJv%2B06fzSEfiYh%2F52FlSw2Nod25AJBCClTtHIBQi9shD9A1DBCB36tHPYyo0SCU7YHJxqenpR18QzEAaz1zk3IE1XrKnCwjFSBwNZth3X%2BllgYCRfu2TyIoadmLGAzszurUPAzpnJPDSN0N3ICDRnDFGCCwC94n%2FYDZlDvyp6w0wIXguLpTg2MbE8QPi4%2BeN0aySJVZSO7sKmmyscJwmumWl0yS621fqVIA3pTLY3I7qeuJ%2BuiXfT7cV9zN2rAFAFHcPEDhgUgwkcm6e9O18NSS%2BUiswp%2Ffvt4ZGq69t2XtLx1vtQat9KXGYwkBifEVwQlLZGlAL43rTOz7n0tqOfI3kwIYwPXeCOFNmruNAjzOJAAKeNtqxwK5HuKDYjxpQcQ61izb%2FeUN6rG%2BP6T823SdD7FHSAZezC1ImryBjcxZJIwuoKdmZaQHy2blOop7Hxl12lGazrHxXgVxuoWL%2BQNbeHPjnFEh2OYH3I6PD5bkuccKUOWEq8OcOaYQDl7iYXd8P5%2B7wIg%2F6qkBtG8VA7Vbk%2F82OBOoUkj5CkUIHZ%2F9JU%2BOcQKAqidkFjbKRYZPfJTIRiyVFFslrsL51zhbh51snVXZFdYA701RjxkgLlgQHoZ%2Feqlt%2B1FUVOl05olWiY5YQWKkzCQmcAPyCGzZH0ASHjkxO7pEOVioyul4jNMrfJ%2BvNZ9%2BhAesp1K0%2F1G3vxJ5dQ8GOjsqsdjNcUXqsq%2B%2Fcz%2Bwebqwru8QFWM85AH3OVJ%2BGHB8uuC1oZOzCTMsIW5XEqipslSsccA5c9KHBLDVT2RtyVVBbFeTKEE2hwTPuXU%2BQVwR5p9sw5HIBGTgOddDBCfTKQNe1okFDVba9wLLBsZck9kfVVGTYKlSrqkkIEOPFRo%2FKiqL0CnnKcEYwi9%2BputBLsTrk4aZz%2B1dE3gBYQeNbRmanRqwtIRZAMgqj5n5oh%2B8hmWEnvZzUOFKVwWM3Do%2BiKALJcBnQpBT6l5DQcDg4C6NirlM8WjpCpHpNI6XLijRxvZjhOz5QNn6mMVDEhWOg0I%2BuAwi89RZLcjZxIXJCzeFzjhCkduMgyUFDy7AR4VU5B9LPU%2FZ5CHwixul94l9JoGXUId9cYDS1%2FQuM4dA9eElM3LfsuPdyTTmFRtNIFv46HUXhz1IxxTKqoorsDjeL2fTXZq5dF1W0PTOK%2FZPKUpPIZHqiYopMj2wtLGw5FMmGmg5VGQ5Ltu4S%2BEeUQ5YEq2KVVglrCTmkchlQ7lWYQvLIssaR747hwcdROet%2FGSilQyK76Mo0TYmJHNtSTL4sgUdcsj5GRBTpRr2IyCuybnA1X2ShoXIOOwhVJi9dkQqoBVZZ6KAsM7OWtwJNH8cQO1TmUPSiHqW6QEGXsPfhnMq3IPzViaZXVDRVqYUI1WOioYQdLxFNkbnTTbcnlUnFEHFcc4SR84wxgsBnOWgTAlEsy9YsEGVUxtQno82wOnl0G5eHHBG5wa3H%2BdGgPTH1pgXTlt3siIZ3YdPXxy7TMHAf4uu4MswldYDl70UyRDk6DrqlV5Wzie0WMWyhM4UCUBqFzPAUewBdbUd3VsC3c%2B4wT7CZlP%2BFhKwjYFkKkMzk4YtLfsY%2B%2F80uRaOf8OhSoMkP1uLAc%2FpsTyD7VQseUtGRaxeJBXdOJTHDccEce87jzPXEV9HUbd2NPed%2BobJQkQAv%2FTHMmGintIX6kHpn91fythlNfSMWNG7ps7tZpqP1Ljq21TE0wzLb9s6CP31o1iMdXmKHJvt17KmZI4dm%2BsXFf5V0umOFkyQFcrtK98gxU9Rws7E0Orm1ab2NI52hFql6fK5d9GxNT4ARHb0TYjN5UVvED%2BIKeDIJ4HvxzOBsAs%2BrX5D%2FthnwHJTRynMMSdY7CrQbz%2FqeAq3SL1QWDNiycg9DXQroqNgpTs26oX134epEjJqIodqIUysxOnL5SgL%2F2Cv3%2B8OqKCYoYa2q%2B6srJ4kIA%2Bdt%2B9Gqk5JivVsZLVdF%2Fq6i5WqGV5GYRE9PfhZZq9SUnWr1ik22GcAR5HrEBVPveoWm6q2uV2hyP31Y%2BYzkdu3j%2BSFKztAbl5y8%2BWQ8g%2BNnvCRnY96KwtvtwkbJsEMyHBLN6%2FygcGdevdJV9fzUK125TCQas3i3nLCCv4MwG3coPTnnWi6YKJlm39Ls9UA8r9m4D%2BnJCQnPSuG3APr9MQvrKOf435BnVIrgQITXuC%2BxZZ2NUji1eCoq05TWP1nX%2B4lUe2Mr6wvQTQmOg63E0uf9GT8Iz%2Bq0xfH2PH6UXsKNV2a1fUq6oawyS7hZLMmt4Ip3dIRF1AzYbDXHCpcB38cZObL%2BODXYUCFS1Ve70LVyaq56J2EJ9B0NL6Xkqn5C63BUvlNQ58%2B1C01r7yh%2BAc2nRyPou1RkjGm75iAy9bvmoEQtz%2BrFiit5%2Bt7mxpRczgQ%2FkJJbOUpu2LaZVM9SdH7TkB5d9VzfuUSFWi%2Fnp0eEp9kVVcxS8dSTcPbqAtO0mzThWsKEG28L24w84121FdZ7BWMtIyUiqMkOy1nUDcJPALEVsCGmIsMIffhemfTUuYJX97aT%2FQ6q9xd1FTmanvW%2BpPdtcZBXAL7dMuVAkFUTAwn800JoPjMytG2fFXIlFSpL1y059brHDkAnCtRFAVVzer0UkAPza%2BzPTwyoiwGqHvx6GSCvm7PlOcBfyjymgkH41DRVFxt0o3E6yJsPJPQ%2FeHNMFbgqKvNKXKsK%2Bgx5lW6McAC5v09foTspeOlEUGxFrFXBFS%2F1idox2P8foeyEPGV%2FZWV%2FhdO%2FMv4DETX8srunT%2BhAP0aC%2FLddn%2BzCvnYhre5zKLmg6lVsqX2BJ17UxYvGE0RDrvSzxp6Tn6jUT1haQdw3CUP5wMul4tBR8I5N1oR4m%2FkGzZMp2NsUdA%2FbRSjeZ8dcRPa29BMNSqZB4x5BbO9Lb%2Fg8GYfaWdF4GVHxHkXeS30KFCoNFNqKruZ6E0rFWxGZV%2BDgs6WEk2sozwjkvOeq%2BQhBLi4wLlz5PvbvYRCAKTybh39PrKiLFc0HDB0J68PvL7rQNKOV6DHSN8f7NIiGj34IjUcpAUQ9jUfCTf3uHLB%2BbxKkmYp6SCDehHcIveJFScB7xXtJFpi93ltY0HyvuKngScYu8cZ48pG7i63sAJ%2FaGFPs0RdhXXj03m5xoX31d4tbcinxiPC0LbHmJiRvlAKonswE69vyo3jzedYLdA5xJ2YFiXn%2Ba%2FHa5QTd9NDHmMQxpRnELNwNa179Hw%3D%3D%3C%2Fdiagram%3E%3C%2Fmxfile%3E">UML диаграмма</a>

<h1>Класс Product List</h1>
Класс служит для представления коллекции продуктов с различными атрибутами, такими как идентификатор, название, категория, описание, цена и изображение. 

Основное назначение класса — предоставление удобного способа хранения, отображения и управления списком продуктов.

<b>Свойства:</b>
1. Элементы списка (items): массив объектов, где каждый объект представляет отдельный продукт со следующими атрибутами:
- ID: уникальный идентификатор продукта.
- Название (title): название продукта.
- Категория (category): тип продукта.
- Описание (description): дополнительная информация о продукте.
- Цена (price): стоимость продукта.
- Изображение (image): ссылка на изображение продукта.
<i>Каждый элемент в массиве items класса ProductList будет соответствовать интерфейсу ProductItem </i>

<b>Методы:</b>
getAllProducts()
- Возвращает весь список доступных товаров.
- Используется на главной странице для отображения каталога.

getProductById(productId)
- Ищет и возвращает данные конкретного товара по его уникальному идентификатору.
- Используется для загрузки детальной информации о товаре в модальном окне.
- Возвращает null или выбрасывает ошибку, если продукт не найден

saveProducts(products)
- Принимает массив объектов ProductItem и сохраняет их


<h1>Класс Order</h1>
Класс представляет собой структуру, которая описывает информацию о заказе.

Класс предназначен для представления и хранения информации о заказах. Он может быть частью системы управления продажами или интернет-магазина

<b>Свойства:</b>
1. Оплата (payment): Описывает способ оплаты заказа.
2. Электронная почта (email): Указывает email покупателя.
3. Телефон (phone): Хранит номер телефона покупателя.
4. Адрес (address): Указывает адрес доставки заказа.

<b>Методы:</b>
initializeOrder(total, items)
- Инициализирует процесс оформления заказа на основе содержимого корзины.

setPaymentAddressMethod()
- Устанавливает способ оплаты (например, "наличные" или "онлайн") и адрес доставки.
- Если адрес или способ оплаты не указан, уведомление об ошибке.

setCustomerDetails(email, phone)
- Сохраняет информацию о покупателе (почта и телефон).
- Генерирует ошибку, если поля не заполнены.

finalizeOrder()
- Проверяет заполненность всех необходимых данных.
- Возвращает сообщение об успешной оплате и удаляет товары из корзины.

validateInput(field, value)
- Проверяет корректность введённых данных, таких как адрес, почта и телефон.


<h1>Класс Cart</h1>
Класс Cart (корзина) отвечает за управление товарами, добавленными пользователем, а также за оформление заказа.

<b>Свойства:</b>
1. items: Содержит список всех товаров, добавленных в корзину.


<b>Методы:</b>
getTotalPrice()
- Рассчитывает общую стоимость товаров.

getQuantity()
- Рассчитывает общее количество товаров.

isEmpty()
- Проверяет, пуста ли корзина.

addItem(product):
- Добавляет товар в корзину. Если товар уже есть, увеличивает его количество.
- При нажатии на кнопку покупки.

removeItem(productId):
- Удаляет товар из корзины по его идентификатору.
- При нажатии на кнопку удаления.

calculateTotal():
- Пересчитывает общую стоимость товаров в корзине.
- После добавления или удаления товара

clearCart():
- Очищает корзину, удаляя все товары.
- При оформлении заказа или вручную

getItems():
- Возвращает список всех товаров в корзине.
- Для отображения содержимого корзины

isInCart(productId):
- Проверяет, находится ли товар с указанным идентификатором в корзине.
- Для предотвращения повторного добавления


<h1>Связи между классами</h1>

Cart и Product List: 
- Cart управляет объектами Product List через методы добавления, удаления и проверки.

Order и Cart:
- Order использует корзину (Cart) для оформления заказа.

