import {IEvents} from "../base/events";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

// Интерфейс состояния формы
interface IFormState {
    valid: boolean;
    errors: string[];
}
// Класс Form — базовый компонент для работы с формами
export class Form<T> extends Component<IFormState> {
    protected _submit: HTMLButtonElement;
    protected _errors: HTMLElement;

    constructor(protected container: HTMLFormElement, protected events: IEvents) {
        super(container);

        this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', this.container);
        this._errors = ensureElement<HTMLElement>('.form__errors', this.container);

        // Обработчик для ввода данных в поля формы
        this.container.addEventListener('input', (e: Event) => {
            const target = e.target as HTMLInputElement;
            const field = target.name as keyof T;
            const value = target.value;
            this.onInputChange(field, value);
        });

        // Обработчик отправки формы
        this.container.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            this.events.emit(`${this.container.name}:submit`);
        });
    }

    // Обработчик изменений в полях формы
    protected onInputChange(field: keyof T, value: string) {
        this.events.emit(`${this.container.name}.${String(field)}:change`, {
            field,
            value
        });
    }

    // Установка валидности формы: блокировка/разблокировка кнопки отправки
    set valid(value: boolean) {
        this._submit.disabled = !value;
    }

    // Установка текста ошибок формы
    set errors(value: string) {
        this.setText(this._errors, value);
    }
    
    // Рендеринг формы и её состояния
    render(state: Partial<T> & IFormState) {
        const {valid, errors, ...inputs} = state;
        super.render({valid, errors});
        Object.assign(this, inputs);
        return this.container;
    }
}