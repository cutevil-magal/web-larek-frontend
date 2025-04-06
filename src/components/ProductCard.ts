import { IProduct } from "../types";
import { ensureElement, formatNumber} from "../utils/utils";
import { Component } from './base/Component';

const categories: Record<string, string> = {
    "дополнительное": "card__category_additional",
    "софт-скил": "card__category_soft",
    "хард-скил": "card__category_hard",
    "кнопка": "card__category_button",
    "другое": "card__category_other"
};

interface ICardActions {
    onClick: (event: MouseEvent) => void;
}

export class ProductCard extends Component<IProduct> {
    protected _category: HTMLElement;
    protected _image?: HTMLImageElement;
    protected _title: HTMLElement;
    protected _description?: HTMLElement;
    protected _price?: HTMLElement;
    protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
        super(container);

        this._category = container.querySelector('.card__category')
        this._image = container.querySelector('.card__image');
        this._title = ensureElement<HTMLElement>('.card__title', container);
        this._description = container.querySelector('.card__text');
        this._price = ensureElement<HTMLElement>('.card__price', container);
        this._button = container.querySelector('.button');
        

        if (actions?.onClick) {
            if (this._button) {
                this._button.addEventListener('click', actions.onClick);
            } else {
                container.addEventListener('click', actions.onClick);
            }
        }
    }

    set id(value: string) {
        this.container.dataset.id = value;
    }

    set title(value: string) {
        this.setText(this._title, value);
    }

    set image(value: string) {
        this.setImage(this._image, value, this.title);
    }

    set description(content: string | string[]) {
        if (Array.isArray(content)) {
            const fragments = content.map(text => {
                const elem = this._description.cloneNode() as HTMLElement;
                elem.textContent = text;
                return elem;
            });
            this._description.replaceWith(...fragments);
        } else {
            this.setText(this._description, content);
        }
    }

    set button(value: string) {
        this.setText(this._button, value);
    }

    set price(value: number | null) {
        this.setText(this._price, formatNumber(value));
    }

    set category(value: string) {
        this.setText(this._category, value);
        this.toggleCategoryClass(value);
    }

    private toggleCategoryClass(category: string): void {
        Object.entries(categories).forEach(([key, className]) => {
            this._category.classList.toggle(className, key === category);
        });
    }

    set buttonText(value: string) {
        if (this._button) {
          this._button.textContent = value;
        }
    }

    // метод для полной инициализации карточки
    initCard(item: IProduct, isDetailedView: boolean = false): this {
        this.id = item.id;
        this.title = item.title;
        this.image = item.image;
        this.price = item.price;
        this.category = item.category;

        if (isDetailedView && item.description) {
            this.description = item.description;
        }
       
        return this;
    }

    // Метод для обновления состояния кнопки корзины
    updateCartButtonState(isInCart: boolean, isDisabled = false) {
        if (isDisabled) {
            this._button.disabled = true; // Блокируем кнопку    
        }
        this.buttonText = isInCart ? 'Убрать из корзины' : 'В корзину';  
    }

}