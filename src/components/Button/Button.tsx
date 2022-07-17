import React, {
    forwardRef,
    useState,
    useCallback,
    useImperativeHandle,
    useMemo,
    useRef,
    createContext,
    useContext,
} from 'react';
import classNames from 'classnames';
// STYLES
import './styles.css';

const buttonTypes = tuple('default', 'primary', 'secondary', 'cancel', 'goast', 'danger');
const buttonHTMLTypes = tuple('submit', 'button', 'reset');
const buttonSize = tuple('small', 'medium', 'large');
const buttonShape = tuple('default', 'circle', 'round', 'ellipse');

export interface ButtonProps
    extends Omit<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        'ref' | 'type' | 'onMouseDown' | 'onMouseUp' | 'onMouseLeave'
    > {
    type?: typeof buttonTypes[number];
    /** @default button */
    htmlType?: typeof buttonHTMLTypes[number];
    /** @default medium */
    size?: typeof buttonSize[number];
    /** @default round */
    shape?: typeof buttonShape[number];
    /** @default reagular - Ragular */
    fontWeight?: 'reagular' | 'bold';
    block?: boolean;
    /** @default true */
    enalbledShadow?: boolean;
}

type ButtonGroupProps = Pick<ButtonProps, 'size' | 'shape' | 'children' | 'block'>;

interface CompoundedComponent extends React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLElement>> {
    Group: typeof Group;
}

const prefixCls = getPrefixName('btn').class;
const SCALE_UP_TIME = 500;
const SizeContext = createContext<typeof buttonSize[number] | undefined>(undefined);
const ShapeContext = createContext<typeof buttonShape[number] | undefined>(undefined);
const BlockContext = createContext<boolean>(false);

// TODO focus, box-shadow 없애기
function InternalButton(
    {
        children,
        type = 'default',
        htmlType = 'button',
        size = 'medium',
        shape = 'round',
        fontWeight,
        block = false,
        enalbledShadow = true,
        ...props
    }: ButtonProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
) {
    const sizeContext = useContext(SizeContext);
    const shapeContext = useContext(ShapeContext);
    const blockContext = useContext(BlockContext);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const shadowBoxRef = useRef<HTMLSpanElement>(null);

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
                shadow: enalbledShadow,
                block: _block,
            },
            props.className,
        );
    }, [
        block,
        blockContext,
        enalbledShadow,
        fontWeight,
        props.className,
        shape,
        shapeContext,
        size,
        sizeContext,
        type,
    ]);

    // 누른 상태
    const onMouseDown = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!buttonRef.current) return;
        if (!shadowBoxRef.current) return;

        const buttonEl = buttonRef.current;
        const rect = buttonEl.getBoundingClientRect();
        const positionY = e.clientY - rect.top;
        const positionX = e.clientX - rect.left;
        const rectSize = rect.width > rect.height ? rect.width : rect.height;

        const box = shadowBoxRef.current;

        const element = document.createElement('div');
        element.style.width = `${rectSize}px`;
        element.style.height = `${rectSize}px`;
        element.style.top = `${positionY - rectSize / 2}px`;
        element.style.left = `${positionX - rectSize / 2}px`;
        box.appendChild(element);
    }, []);

    // 눌렀다 떈 상태
    const onMouseUp = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!shadowBoxRef.current) return;
        const elements = Array.from(shadowBoxRef.current.children);
        elements.forEach((el) => {
            setTimeout(() => el.remove(), SCALE_UP_TIME);
        });
    }, []);

    // 누르고 다른 곳으로 이동 상태
    const onMouseLeave = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (!shadowBoxRef.current) return;
        const elements = Array.from(shadowBoxRef.current.children);
        elements.forEach((el) => {
            setTimeout(() => el.remove(), SCALE_UP_TIME);
        });
    }, []);

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
            <span ref={shadowBoxRef} className="ppby-btn-press-shadow" />
        </button>
    );
}

function Group({ children, block = false, size = 'medium', shape = 'round' }: ButtonGroupProps) {
    const groupPrefixCls = useMemo(
        () =>
            classNames(`${prefixCls}-group`, {
                [`${prefixCls}-group-block`]: block,
            }),
        [block],
    );

    return (
        <SizeContext.Provider value={size}>
            <ShapeContext.Provider value={shape === 'circle' ? 'round' : shape}>
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
