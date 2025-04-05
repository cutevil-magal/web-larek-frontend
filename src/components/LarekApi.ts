import { IProduct, IOrder, IOrderSuccess } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
    fetchProductList: () => Promise<IProduct[]>;
    submitOrder: (order: IOrder) => Promise<IOrderSuccess>
  }

export class LarekApi extends Api implements ILarekApi {
    private readonly cdnBaseUrl: string;

    constructor(cdnBaseUrl: string, apiBaseUrl: string, options?: RequestInit) {
        super(apiBaseUrl, options);
        this.cdnBaseUrl = cdnBaseUrl;
    };

    // Получает список товаров с CDN-префиксом для изображений
    async fetchProductList(): Promise<IProduct[]> {
        const response = await this.get('/product');
        return this.processProductImages((response as ApiListResponse<IProduct>).items);
    }

    // Отправляет заказ на сервер
    async submitOrder(order: IOrder): Promise<IOrderSuccess> {
        return this.post('/order', order) as Promise<IOrderSuccess>;
    }

    //  Добавляет CDN-префикс к URL изображений товаров
    private processProductImages(products: IProduct[]): IProduct[] {
        return products.map(product => ({
            ...product,
            image: `${this.cdnBaseUrl}${product.image}`
        }));
    }
};