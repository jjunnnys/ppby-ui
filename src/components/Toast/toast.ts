import { getPrefixName } from '@field-share/utils';

/* eslint-disable no-param-reassign */
type ShowMethodType = 'success' | 'error' | 'warn' | 'info';

const infoIcon = `
<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
`;

const successIcon = `
<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
<path d="M13.609 6.91406C13.4975 6.91388 13.3873 6.93579 13.2843 6.97853C13.1813 7.02126 13.088 7.08398 13.0094 7.16306L8.42738 11.7421L6.40833 9.65006C6.32938 9.56771 6.23456 9.50227 6.12953 9.45775C6.02449 9.41322 5.91109 9.39053 5.79701 9.39106C5.57721 9.39087 5.3661 9.47623 5.20814 9.62906C5.04655 9.78559 4.95377 9.99979 4.94984 10.2247C4.9459 10.4497 5.03113 10.667 5.18714 10.8291L7.80628 13.5431C7.88433 13.6236 7.97725 13.6879 8.08021 13.7324C8.18317 13.7768 8.29425 13.8005 8.40638 13.8021H8.41419C8.63916 13.8012 8.85484 13.7118 9.01429 13.5531L14.2042 8.36306C14.3628 8.20361 14.4518 7.98791 14.4518 7.76306C14.4518 7.53822 14.3628 7.32251 14.2042 7.16306C14.1263 7.08449 14.0334 7.02206 13.9313 6.97933C13.8292 6.93661 13.7197 6.91443 13.609 6.91406Z" fill="currentColor"/>
</svg>
`;

const warningOrErrorIcon = `
<svg  height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor">
    <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
</svg>
`;

/**
 * @author ppby
 */
class Toast {
    private prefixCls = getPrefixName('toast').class;

    private prefixAnimate = getPrefixName('toast').animate;

    private _container = `${this.prefixCls}-container`;

    private _toastIn = `${this.prefixAnimate}-in`;

    private _toastOut = `${this.prefixAnimate}-out`;

    private _text = 'toast-text';

    private dom = document.createElement('div');

    private count = 1;

    private _spacing = 50;

    constructor() {
        if (typeof window === 'undefined') throw new Error('브라우저 환경에서 사용 가능합니다.');
        const toastEl = document.querySelector<HTMLDivElement>(`#${this.prefixCls}`);
        if (toastEl) {
            this.dom = toastEl;
        } else {
            this.dom.id = this.prefixCls;
        }
        window.onload = () => document.body.insertAdjacentElement('beforeend', this.dom);
    }

    private removeBoxTimeoutFunction(contentBox: HTMLDivElement, closeCallback?: () => void) {
        if (contentBox) this.dom.removeChild(contentBox);
        const boxs = Array.from(document.querySelectorAll<HTMLDivElement>(`.${this._container}`));
        boxs.forEach((box) => {
            box.style.top = `${parseInt(box.style.top, 10) - this._spacing}px`;
        });
        this.count -= 1;

        if (typeof closeCallback === 'function') closeCallback();
    }

    private show(content: string, duration = 3000, type: ShowMethodType = 'info', closeCallback = () => {}): void {
        const contentBox = document.createElement('div');
        const contentDom = document.createElement('span');
        const icon = document.createElement('i');
        icon.classList.add(`${this.prefixCls}-icon`);
        icon.classList.add(type);
        if (type === 'info') {
            icon.innerHTML = infoIcon;
        }
        if (type === 'success') {
            icon.innerHTML = successIcon;
        }
        if (type === 'warn' || type === 'error') {
            icon.innerHTML = warningOrErrorIcon;
        }
        contentDom.classList.add(this._text);
        contentDom.innerText = content;
        contentBox.classList.add(this._container);
        contentBox.classList.add(this._toastIn);
        contentBox.appendChild(icon);
        contentBox.appendChild(contentDom);
        contentBox.style.top = `${this.count * this._spacing - 14}px`;
        this.dom.appendChild(contentBox);

        this.count += 1;

        setTimeout(() => {
            contentBox.classList.add(this._toastOut);
            setTimeout(() => this.removeBoxTimeoutFunction(contentBox, closeCallback), 300);
        }, duration);
    }

    mount() {
        document.body.insertAdjacentElement('beforeend', this.dom);
    }

    clean() {
        if (this.dom.parentNode) {
            document.body.removeChild(this.dom);
        }
    }

    success(content: string, duration?: number, closeCallback?: () => {}) {
        return this.show(content, duration, 'success', closeCallback);
    }

    error(content: string, duration?: number, closeCallback?: () => {}) {
        return this.show(content, duration, 'error', closeCallback);
    }

    warn(content: string, duration?: number, closeCallback?: () => {}) {
        return this.show(content, duration, 'warn', closeCallback);
    }

    info(content: string, duration?: number, closeCallback?: () => {}) {
        return this.show(content, duration, 'info', closeCallback);
    }
}

export default new Toast();
