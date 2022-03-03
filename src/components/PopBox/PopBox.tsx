import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { hooks } from '@field-share/utils';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

type PopBoxProps = {
    children: React.ReactNode;
    openType?: 'right' | 'bottom' | 'left';
    buttonRef?: React.RefObject<HTMLElement>;
    isVisible: boolean;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    onCancel(): void;
};

const { useOnClickOutside } = hooks;

function PopBox({
    children,
    openType = 'right',
    buttonRef,
    isVisible,
    width,
    height,
    left,
    top,
    onCancel,
}: PopBoxProps) {
    const ref = useRef<Element | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    const className = useMemo(() => ['wds-pop-box-container', openType].join(' '), [openType]);

    useOnClickOutside(menuRef, onCancel, buttonRef!);

    useEffect(() => {
        setIsMounted(true);
        if (document) {
            const dom = document.getElementById('wds-pop-box');
            ref.current = ref.current || dom;
        }

        return () => {
            setIsMounted(false);
        };
    }, []);

    // 최초 캐싱
    useEffect(() => {
        const element = document.querySelector('.wds-pop-box-container');
        if (!element) return;
        element.setAttribute('style', `width:${width}px; height: ${height}px; top: ${top}px; left: ${left}px`);
    }, [height, left, top, width]);

    if (!ref.current || !isMounted) return null;
    return createPortal(
        <div ref={menuRef} data-open={isVisible} className={className}>
            {children}
        </div>,
        ref.current,
    );
}

export default PopBox;
