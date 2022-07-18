import { curry, delay, map, pipe, reduce, tap, toArray } from '@fxts/core';
import { getPrefixName, $ } from '../../lib';
import './styles.css';

export type AlertProps = {
    title: string;
    subTitle?: string;
    isVisible: boolean;
    onCancel(): void;
    footer?: React.ReactNode;
};

type MessageButtonType = {
    type: 'ok' | 'cancel';
    name: string;
    value: boolean;
};

const srtMap = curry((fn: (a: MessageButtonType) => string, iter: MessageButtonType[]) =>
    pipe(
        iter,
        map(fn),
        reduce((a, b) => `${a}${b}`),
    ),
);

class Message {
    private prefixCls = getPrefixName('message').class;

    constructor() {
        this.message = this.message.bind(this);
    }

    message(msg: string, btns?: MessageButtonType[]) {
        return new Promise<boolean>((resolve) => {
            pipe(
                `
                    <div class="${this.prefixCls}" aria-hidden="true" data-open="false">
                        <article class="${this.prefixCls}-wrapper" role="dialog">
                            <header class="${this.prefixCls}-header">
                                <svg class="${
                                    this.prefixCls
                                }-icon" width="36" height="36" viewBox="0 0 36 36" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M7.15342 7.15342C7.35798 6.94886 7.68964 6.94886 7.8942 7.15342L28.8466 28.1058C29.0511 28.3104 29.0511 28.642 28.8466 28.8466C28.642 29.0511 28.3104 29.0511 28.1058 28.8466L7.15342 7.8942C6.94886 7.68964 6.94886 7.35798 7.15342 7.15342Z" fill="currentColor"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd" d="M28.8466 7.15342C28.642 6.94886 28.3104 6.94886 28.1058 7.15342L7.15342 28.1058C6.94886 28.3104 6.94886 28.642 7.15342 28.8466C7.35798 29.0511 7.68964 29.0511 7.8942 28.8466L28.8466 7.8942C29.0511 7.68964 29.0511 7.35798 28.8466 7.15342Z" fill="currentColor"/>
                                </svg>
                            </header>
                            <p className="${this.prefixCls}-contents">${msg}</p>
                            <footer className="${this.prefixCls}-footer">
                            ${srtMap(
                                (btn) => `
                                <button type="button" class="${btn.type}">${btn.name}</button>
                            `,
                                btns || [],
                            )}
                            </footer>
                        </article>
                    </div>
                    `,
                $.el,
                $.append($.find('#dmade-modal')),
                tap(async (container) => {
                    if (!container) return;
                    delay(10).then(() => {
                        container.dataset.open = 'true';
                    });
                }),
                tap((container) => {
                    if (!container || !btns) return;
                    pipe(
                        btns,
                        // map(btn =>$.find(`.${btn.type}`, container)),
                        map((btn) =>
                            $.on('click', function listener(e: Event) {
                                pipe(
                                    e.currentTarget as HTMLElement,
                                    tap((el) => {
                                        el.removeEventListener('click', listener);
                                    }),
                                    (el) => el.closest<HTMLElement>('.ppby-message'),
                                    tap((el) => el && (el.dataset.open = 'false')),
                                    tap((el) => {
                                        if (!el) return;
                                        delay(100).then(() => {
                                            $.remove(el);
                                        });
                                    }),
                                    () => resolve(btn.value),
                                );
                            })(btn),
                        ),
                        toArray,
                    );
                }),
            );
        });
    }
}

export default new Message();
