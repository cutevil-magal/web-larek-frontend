import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";
import {IEvents} from "../base/events";

// Интерфейс для данных модального окна
interface IModalData {
    content: HTMLElement;
}
// Класс Modal — отвечает за логику модального окна
export class Modal extends Component<IModalData> {
    protected _closeButton: HTMLButtonElement;
    protected _content: HTMLElement;

    constructor(container: HTMLElement, protected events: IEvents) {
        super(container);

        this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
        this._content = ensureElement<HTMLElement>('.modal__content', container);
        this._closeButton.addEventListener('click', this.close.bind(this));
        this.container.addEventListener('click', this.close.bind(this));
        this._content.addEventListener('click', (event) => event.stopPropagation());
    }

    // Сеттер для обновления контента в модальном окне
    set content(value: HTMLElement) {
        this._content.replaceChildren(value);
    }

    // Открытие модального окна
    open() {
        this.container.classList.add('modal_active');
        this.events.emit('modal:open');
    }

    // Закрытие модального окна
    close() {
        this.container.classList.remove('modal_active');
        this.content = null;
        this.events.emit('modal:close');
    }
    
    // Рендеринг модального окна с указанным контентом
    render(data: IModalData): HTMLElement {
        super.render(data);
        this.open();
        return this.container;
    }
}