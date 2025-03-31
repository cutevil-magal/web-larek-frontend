import { ICard, IOrder, IOrderSuccess } from "../types";
import { Api, ApiListResponse } from "./base/api";

export interface ILarekApi {
    getCardsList: () => Promise<ICard[]>;
    orderProducts: (order: IOrder) => Promise<IOrderSuccess>
  }

export class LarekApi extends Api implements ILarekApi {
    readonly cdn: string;

    constructor(cdn: string, baseUrl: string, options?: RequestInit) {
        super(baseUrl, options);
        this.cdn = cdn;
    };

    // Метод для получения списка товаров
    getCardsList(): Promise<ICard[]> {
        return this.get('/product').then((data:ApiListResponse<ICard>) =>
            data && data.items ? data.items.map((item) => ({
                ...item,
                image: this.cdn + item.image
            })) : []
        );
    }

    // Метод для отправки заказа
    orderProducts(order: IOrder): Promise<IOrderSuccess> {
        return this.post(`/order`, order).then(
            (data: IOrderSuccess) => data
        );
    };
};