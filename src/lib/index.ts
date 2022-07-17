import { useEffect, useLayoutEffect } from 'react';
import { noop } from '@fxts/core';

const isBrowser = typeof document !== 'undefined';
let supportsPassiveEvents: boolean | undefined;

export function isPassiveEventsSupported(): boolean {
    if (supportsPassiveEvents !== undefined) return supportsPassiveEvents;

    if (!isBrowser) {
        supportsPassiveEvents = false;
        return false;
    }

    let passive = false;

    const options: AddEventListenerOptions = {
        // @ts-ignore: 이것은 임시 객체이며 아무 것도 반환할 필요가 없습니다.
        // eslint-disable-next-line getter-return
        get passive() {
            passive = true;
        },
    };

    window.addEventListener('t', noop, options);
    window.removeEventListener('t', noop, options as EventListenerOptions);
    supportsPassiveEvents = passive;
    return passive;
}

export const useIsomorphicLayoutEffect = typeof document !== 'undefined' ? useLayoutEffect : useEffect;

export const getPrefixName = (cls: string) => ({ class: `ppby-${cls}`, animate: `ppby-animate-${cls}` });
