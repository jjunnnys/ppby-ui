import React, { forwardRef, useState, useEffect, useCallback, useImperativeHandle, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { tuple, getPrefixCls } from '@field-share/utils';
// STYLES
import './styles.css';

const ButtonTypes = tuple('default', 'primary', 'secondary', 'cancel', 'goast');
const ButtonHTMLTypes = tuple('submit', 'button', 'reset');
const ButtonSize = tuple('small', 'medium', 'large');
const ButtonShape = tuple('default', 'circle', 'round', 'ellipse');
const ButtonFontWeight = tuple('100', '300', '400', '500', '700');

interface ButtonProps
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        'type' | 'style' | 'onMouseDown' | 'onMouseUp' | 'onMouseLeave'
    > {
    type?: typeof ButtonTypes[number];
    /** @default button */
    htmlType?: typeof ButtonHTMLTypes[number];
    width?: string | number;
    /** @default medium */
    size?: typeof ButtonSize[number];
    /** @default default */
    shape?: typeof ButtonShape[number];
    /** @default 400 - Ragular */
    fontWeight?: typeof ButtonFontWeight[number];
}

interface CompoundedComponent extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
    Group: typeof Group;
}

const getButtonWidth = (width: string | number | undefined, isButtonGroup: boolean) => {
    if (width) {
        return typeof width === 'number' ? `${width}px` : width;
    }
    return isButtonGroup ? '100%' : 'auto';
};
const prefixCls = getPrefixCls('btn');
const SCALE_UP_TIME = 300;

function InternalButton(
    {
        children,
        type = 'default',
        htmlType = 'button',
        size = 'medium',
        width,
        shape = 'default',
        fontWeight = '400',
        ...props
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
) {
    const [isMouseDown, setIsMouseDown] = useState(false);
    const [isClcikTimeout, setIsClickTimeout] = useState(false);
    const upTimeout = useRef<NodeJS.Timeout | null>(null);
    const downTimeout = useRef<NodeJS.Timeout | null>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    useImperativeHandle(ref, () => buttonRef.current!);

    const className = useMemo(() => {
        const sizeClassNameMap: Record<typeof size, string | undefined> = {
            large: 'lg',
            small: 'sm',
            medium: undefined,
        };
        const sizeCls = size ? sizeClassNameMap[size] || '' : '';

        return classNames(
            prefixCls,
            {
                [`${prefixCls}-${sizeCls}`]: sizeCls,
                [`${prefixCls}-${type}`]: type,
                [`${prefixCls}-${shape}`]: shape !== 'default' && shape,
            },
            props.className,
        );
    }, [props.className, shape, size, type]);

    // 누른 상태
    const onMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setIsMouseDown(true);
        setIsClickTimeout(true);
        upTimeout.current && clearTimeout(upTimeout.current);
        const buttonEl = e.target as HTMLButtonElement;
        const rect = buttonEl.getBoundingClientRect();
        const { width, height, left, top } = rect;
        const positionY = e.clientY - top;
        const positionX = e.clientX - left;
        const size = width > height ? width : height;
        const element = document.createElement('div');
        const chidElement = Array.from(buttonEl.children);
        chidElement.forEach((el) => {
            buttonEl.removeChild(el);
        });
        element.classList.add('on');
        element.style.width = `${size}px`;
        element.style.height = `${size}px`;
        element.style.top = `${positionY - size / 2}px`;
        element.style.left = `${positionX - size / 2}px`;
        buttonEl.appendChild(element);
        downTimeout.current = setTimeout(() => {
            setIsClickTimeout(false);
        }, SCALE_UP_TIME);
    }, []);

    // 눌렀다 떈 상태
    const onMouseUp = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            downTimeout.current && clearTimeout(downTimeout.current);
            setIsMouseDown(false);
            const buttonEl = e.target as HTMLButtonElement;
            const element = Array.from(buttonEl.children);
            const cleanChildren = () => {
                element.forEach((el) => {
                    buttonEl.removeChild(el);
                });
            };

            if (isClcikTimeout) {
                upTimeout.current = setTimeout(cleanChildren, SCALE_UP_TIME);
            } else {
                cleanChildren();
            }
        },
        [isClcikTimeout],
    );

    // 누르고 다른 곳으로 이동 상태
    const onMouseLeave = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!isMouseDown) return;
            const buttonEl = e.target as HTMLButtonElement;
            const element = Array.from(buttonEl.children);
            element.forEach((el) => {
                buttonEl.removeChild(el);
            });
        },
        [isMouseDown],
    );

    useEffect(() => {
        if (!buttonRef.current) return;
        const parentNode = buttonRef.current.parentNode as HTMLElement;
        const parentClassList = Array.from(parentNode.classList);
        const isButtonGroup = parentClassList.includes(`${prefixCls}-group`);
        buttonRef.current.style.width = getButtonWidth(width, isButtonGroup);
        buttonRef.current.style.fontWeight = fontWeight;
    }, [fontWeight, width]);

    return (
        <button
            {...props}
            ref={buttonRef}
            type={htmlType}
            className={className}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </button>
    );
}

function Group({ children, size = 'medium' }: { children: React.ReactNode; size?: typeof ButtonSize[number] }) {
    const groupPrefixCls = `${prefixCls}-group`;
    return (
        <div className={groupPrefixCls}>
            {(children as any).map((v: any) => ({ ...v, props: { ...v.props, size } }))}
        </div>
    );
}

const Button = forwardRef(InternalButton) as CompoundedComponent;

Button.Group = Group;

export default Button;
