import React, { Children, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getPrefixName } from '@field-share/utils';
// PAGES
// COMPONENTS
import PopBox from '../PopBox';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

type TooltipProps = {
    children: React.ReactNode;
    title: string;
    isVisible?: boolean;
    onCancel?(): void;
    placement: 'top' | 'left' | 'right' | 'bottom';
};

const prefixCls = getPrefixName('tooltip');

function Tooltip({ children, title, isVisible, placement, onCancel = () => {} }: TooltipProps) {
    const ref = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const [rect, setRect] = useState({ top: 0, left: 0 });

    useEffect(() => {
        (async () => {
            try {
                if (Children.count(children) !== 1) return;
                const el = ref.current;
                if (!el) return;
                const child = Array.from(el.children)[0];
                const clientRect = child?.getBoundingClientRect();
                if (!clientRect) return;
                const tooltipRect = await new Promise<DOMRect>((resolve, reject) => {
                    setTimeout(() => {
                        if (!tooltipRef.current) return reject(tooltipRef.current);
                        resolve(tooltipRef.current.getBoundingClientRect());
                    }, 50);
                });

                switch (placement) {
                    case 'top':
                        setRect({
                            top: clientRect.top - clientRect.height - tooltipRect.height - 8,
                            left: clientRect.left + clientRect.width / 2 - tooltipRect.width / 2 - 8,
                        });
                        break;
                    case 'left':
                        setRect({
                            top: clientRect.top - 10,
                            left: clientRect.left - tooltipRect.width - 24,
                        });
                        break;
                    case 'right':
                        setRect({ top: clientRect.top - 10, left: clientRect.right + 8 });
                        break;
                    case 'bottom':
                        setRect({
                            top: clientRect.top + clientRect.height + 8,
                            left: clientRect.left + clientRect.width / 2 - tooltipRect.width / 2 - 8,
                        });
                        break;
                    default:
                        break;
                }
            } catch (error) {
                console.error(error);
            }
        })();
    }, [children, placement, isVisible]);

    useEffect(() => {
        if (Children.count(children) !== 1) {
            console.error('부모 요소가 하나만 있어야 합니다.');
        }
    }, [children]);

    return (
        <>
            <div ref={ref}>{children}</div>
            {Children.count(children) === 1 && (
                <PopBox
                    isVisible={typeof isVisible === 'undefined' ? true : isVisible}
                    onCancel={onCancel}
                    openType={placement}
                    top={rect.top}
                    left={rect.left}
                    disabledShadow
                >
                    <div ref={tooltipRef} className={`${prefixCls.class} ${placement} ${isVisible ? 'show' : ''}`}>
                        <span className="point-wrapper">
                            <span className="point" />
                        </span>
                        <p>{title}</p>
                    </div>
                </PopBox>
            )}
        </>
    );
}

export default Tooltip;