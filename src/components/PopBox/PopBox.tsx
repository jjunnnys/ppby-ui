/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { getPrefixName, useOnClickOutside, OutsideHandler, useInsertAdjacentElement } from '@field-share/utils';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';
import classNames from 'classnames';

type PopBoxProps = {
    children: React.ReactNode;
    openType?: 'right' | 'bottom' | 'left';
    isVisible: boolean;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    onCancel: OutsideHandler;
};

const prefixCls = getPrefixName('pop-box').class;

function PopBox({ children, openType = 'right', isVisible, width, height, left = 0, top = 0, onCancel }: PopBoxProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { isMounted, portalRef } = useInsertAdjacentElement();

    const className = useMemo(() => classNames(prefixCls, openType), [openType]);

    useOnClickOutside(menuRef, onCancel);

    // 최초 캐싱
    useEffect(() => {
        if (!menuRef.current) return;
        menuRef.current.style.width = `${width}px`;
        menuRef.current.style.height = `${height}px`;
        menuRef.current.style.top = `${top}px`;
        menuRef.current.style.left = `${left}px`;
    }, [height, left, top, width]);

    if (!portalRef.current || !isMounted) return null;
    return createPortal(
        <div ref={menuRef} data-open={isVisible} className={className}>
            {children}
        </div>,
        portalRef.current,
    );
}

export default PopBox;