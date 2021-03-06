import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import classNames from 'classnames';
import { getPrefixName } from '../../lib';
import './styles.css';

export type PopBoxProps = {
    children: React.ReactNode;
    openType?: 'top' | 'right' | 'bottom' | 'left';
    isVisible: boolean;
    width?: number;
    height?: number;
    top?: number;
    left?: number;
    disabledShadow?: boolean;
    onCancel: OutsideHandler;
};

const prefixCls = getPrefixName('pop-box').class;

function PopBox({
    children,
    openType = 'right',
    disabledShadow = false,
    isVisible,
    width,
    height,
    left = 0,
    top = 0,
    onCancel,
}: PopBoxProps) {
    const menuRef = useRef<HTMLDivElement | null>(null);
    const timeout = useRef<NodeJS.Timeout>();
    const { isMounted, portalRef } = useInsertAdjacentElement();

    const className = useMemo(
        () =>
            classNames(
                prefixCls,
                {
                    'not-shadow': disabledShadow,
                },
                openType,
            ),
        [openType, disabledShadow],
    );

    useOnClickOutside(menuRef, onCancel);

    // 최초 캐싱
    useEffect(() => {
        if (menuRef.current) {
            if (isVisible) {
                if (timeout.current) clearTimeout(timeout.current);
                menuRef.current.classList.remove('hide');
                const totalTop = window.scrollY + top;
                const totalLeft = window.scrollX + left;
                menuRef.current.style.width = `${width}px`;
                menuRef.current.style.height = `${height}px`;
                menuRef.current.style.top = `${totalTop}px`;
                menuRef.current.style.left = `${totalLeft}px`;
                return;
            }
            timeout.current = setTimeout(() => {
                menuRef.current?.setAttribute('style', '');
            }, 300);
        }
    }, [height, left, top, width, isVisible]);

    useEffect(
        () => () => {
            if (timeout.current) {
                menuRef.current?.setAttribute('style', '');
                clearTimeout(timeout.current);
            }
        },
        [],
    );

    if (!portalRef.current || !isMounted) return null;
    return createPortal(
        <div className="ppby-portal-container">
            <div ref={menuRef} data-open={isVisible} className={className}>
                {children}
            </div>
        </div>,
        portalRef.current,
    );
}

export default PopBox;
