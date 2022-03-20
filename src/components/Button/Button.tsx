/* eslint-disable react/button-has-type */
import React, {
    forwardRef,
    useState,
    useEffect,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    createContext,
    useContext,
} from 'react';
import classNames from 'classnames';
import { getPrefixName, tuple } from '@field-share/utils';
// STYLES
import './styles.css';

const buttonTypes = tuple('default', 'primary', 'secondary', 'cancel', 'goast');
const buttonHTMLTypes = tuple('submit', 'button', 'reset');
const buttonSize = tuple('small', 'medium', 'large');
const buttonShape = tuple('default', 'circle', 'round', 'ellipse');

interface ButtonProps
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        'type' | 'style' | 'onMouseDown' | 'onMouseUp' | 'onMouseLeave'
    > {
    type?: typeof buttonTypes[number];
    /** @default button */
    htmlType?: typeof buttonHTMLTypes[number];
    width?: string | number;
    /** @default medium */
    size?: typeof buttonSize[number];
    /** @default default */
    shape?: typeof buttonShape[number];
    /** @default reagular - Ragular */
    fontWeight?: 'reagular' | 'bold';
    block?: boolean;
}

type ButtonGroupProps = Pick<ButtonProps, 'size' | 'shape' | 'children' | 'block'>;

interface CompoundedComponent extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
    Group: typeof Group;
}

const prefixCls = getPrefixName('btn').class;
const SCALE_UP_TIME = 300;
const SizeContext = createContext<typeof buttonSize[number] | undefined>(undefined);
const ShapeContext = createContext<typeof buttonShape[number] | undefined>(undefined);
const BlockContext = createContext<boolean>(false);

function InternalButton(
    {
        children,
        type = 'default',
        htmlType = 'button',
        size = 'medium',
        // width,
        shape = 'default',
        fontWeight,
        block = false,
        ...props
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
) {
    const sizeContext = useContext(SizeContext);
    const shapeContext = useContext(ShapeContext);
    const blockContext = useContext(BlockContext);
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
        const _shape = shapeContext || shape;
        const _size = sizeContext || size;
        const _block = blockContext || block;
        const sizeCls = _size ? sizeClassNameMap[_size] || '' : '';

        return classNames(
            prefixCls,
            {
                [`${prefixCls}-${sizeCls}`]: !!sizeCls,
                [`${prefixCls}-${fontWeight}`]: !!fontWeight && fontWeight !== 'reagular',
                [`${prefixCls}-${type}`]: type !== 'default',
                [`${prefixCls}-${_shape}`]: _shape !== 'default',
                block: _block,
            },
            props.className,
        );
    }, [block, blockContext, fontWeight, props.className, shape, shapeContext, size, sizeContext, type]);

    // 누른 상태
    const onMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!buttonRef.current) return;
        setIsMouseDown(true);
        setIsClickTimeout(true);
        upTimeout.current && clearTimeout(upTimeout.current);
        const buttonEl = buttonRef.current;
        const rect = buttonEl.getBoundingClientRect();
        const positionY = e.clientY - rect.top;
        const positionX = e.clientX - rect.left;
        const rectSize = rect.width > rect.height ? rect.width : rect.height;
        const element = document.createElement('div');
        const chidElement = Array.from(buttonEl.children);
        chidElement.forEach((el) => {
            if (el.className === 'on') {
                buttonEl.removeChild(el);
            }
        });
        element.classList.add('on');
        element.style.width = `${rectSize}px`;
        element.style.height = `${rectSize}px`;
        element.style.top = `${positionY - rectSize / 2}px`;
        element.style.left = `${positionX - rectSize / 2}px`;
        buttonEl.appendChild(element);
        downTimeout.current = setTimeout(() => {
            setIsClickTimeout(false);
        }, SCALE_UP_TIME);
    }, []);

    // 눌렀다 떈 상태
    const onMouseUp = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!buttonRef.current) return;
            downTimeout.current && clearTimeout(downTimeout.current);
            setIsMouseDown(false);
            const buttonEl = buttonRef.current;
            const element = Array.from(buttonEl.children);
            const cleanChildren = () => {
                element.forEach((el) => {
                    if (el.className === 'on') {
                        buttonEl.removeChild(el);
                    }
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
            if (!isMouseDown || !buttonRef.current) return;
            const buttonEl = buttonRef.current;
            const element = Array.from(buttonEl.children);
            element.forEach((el) => {
                if (el.className === 'on') {
                    buttonEl.removeChild(el);
                }
            });
        },
        [isMouseDown],
    );

    return (
        <button
            {...props}
            ref={buttonRef}
            type={htmlType as any}
            className={className}
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseLeave}
        >
            {children}
        </button>
    );
}

function Group({ children, block = false, size = 'medium', shape = 'default' }: ButtonGroupProps) {
    const groupPrefixCls = useMemo(
        () =>
            classNames(`${prefixCls}-group`, {
                [`${prefixCls}-group-block`]: block,
            }),
        [block],
    );

    return (
        <SizeContext.Provider value={size}>
            <ShapeContext.Provider value={shape === 'circle' ? 'default' : shape}>
                <BlockContext.Provider value={block}>
                    <div className={groupPrefixCls}>{children}</div>
                </BlockContext.Provider>
            </ShapeContext.Provider>
        </SizeContext.Provider>
    );
}

const Button = forwardRef(InternalButton) as CompoundedComponent;

Button.Group = Group;

export default Button;
