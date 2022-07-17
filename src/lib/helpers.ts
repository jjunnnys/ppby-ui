/* eslint-disable class-methods-use-this */

export const isIterable = (iter: any) => iter == null || typeof iter[Symbol.iterator] === 'function';

class DomHelper {
    constructor() {
        this.find = this.find.bind(this);
        this.findAll = this.findAll.bind(this);
        this.el = this.el.bind(this);
        this.append = this.append.bind(this);
        this.remove = this.remove.bind(this);
        this.on = this.on.bind(this);
    }

    find<T extends HTMLElement>(sel: string, el?: HTMLElement): T | null {
        const dom = el || document;
        return dom.querySelector<T>(sel);
    }

    findAll<T extends HTMLElement>(sel: string, el?: HTMLElement): NodeListOf<T> | null {
        const dom = el || document;
        return dom.querySelectorAll<T>(sel);
    }

    el(el: string) {
        const template = document.createElement('div');
        template.innerHTML = el;
        return template.firstChild as HTMLElement | null;
    }

    append(parent: HTMLElement | null) {
        return function (child: HTMLElement | null) {
            return child ? parent?.appendChild(child) || null : null;
        };
    }

    remove(el: HTMLElement) {
        return el.parentNode?.removeChild<HTMLElement>(el);
    }

    on(event: keyof WindowEventMap, lis: EventListenerOrEventListenerObject) {
        return function (els?: any) {
            // eslint-disable-next-line no-restricted-syntax
            for (const el of isIterable(els) ? els : [els]) {
                el.addEventListener(event, lis);
            }
        };
    }
}

export const $ = new DomHelper();
