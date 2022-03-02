import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { css } from '@emotion/react';
import useOnClickOutside from '../../hooks/useOnClickOutside';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
type FixedInfoBoxProps = {
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

function FixedInfo({
    children,
    openType = 'right',
    buttonRef,
    isVisible,
    width,
    height,
    left,
    top,
    onCancel,
}: FixedInfoBoxProps) {
    const ref = useRef<Element | null>(null);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const [isMounted, setIsMounted] = useState(false);

    useOnClickOutside(menuRef, onCancel, buttonRef);

    useEffect(() => {
        setIsMounted(true);
        if (document) {
            const dom = document.getElementById('wds-fixed-info');
            ref.current = ref.current || dom;
        }

        return () => {
            setIsMounted(false);
        };
    }, []);

    if (!!ref.current && isMounted) {
        return createPortal(
            <div
                ref={menuRef}
                css={container(width, height, left, top)}
                aria-label="dropdown"
                data-open={isVisible}
                className={openType}
            >
                {children}
            </div>,
            ref.current!,
        );
    }

    return null;
}

const container = (width?: number, height?: number, clientX?: number, clientY?: number) => css`
    position: fixed;
    top: ${clientY || 0}px;
    left: ${clientX || 0}px;
    width: ${width ? `${width}px` : 'auto'};
    height: ${height ? `${height}px` : 'auto'};
    background: #ffffff;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    z-index: 900;
    opacity: 0;
    pointer-events: none;
    transition: transform 0.2s ease-in-out, opacity 0.3s;

    &.right {
        transform-origin: -5% 10px;
        transform: scale(0);
        &[data-open='true'] {
            transform: scale(1);
        }
    }
    &.left {
        transform-origin: 105% 10px;
        transform: scale(0);
        &[data-open='true'] {
            transform: scale(1);
        }
    }
    &.bottom {
        transform-origin: 50% 0;
        transform: scaleY(0);
        &[data-open='true'] {
            transform: scaleY(1);
        }
    }

    &[data-open='true'] {
        pointer-events: auto;
        opacity: 1;
    }
`;

export default FixedInfo;
