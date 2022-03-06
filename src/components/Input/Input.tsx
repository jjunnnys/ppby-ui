import React, { useMemo, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { bindingNumberOrComma, getPrefixCls } from '@field-share/utils';
// PAGES
// COMPONENTS
import Icons, { IconsType } from '../Icons';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

export type HTMLInputTypeAttribute = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'min' | 'max' | 'onChange' | 'type'> {
    loading?: boolean;
    bordered?: boolean;
    size?: 'default' | 'large';
    icon?: IconsType;
    iconColor?: string;
    onClickIcon?(): void;
    onChange?(value: number | string | undefined): void;
    min?: number;
    max?: number;
    type?: HTMLInputTypeAttribute;
}

const prefixCls = getPrefixCls('input');

function Input(
    {
        type = 'text',
        size = 'default',
        bordered = true,
        loading = false,
        icon,
        iconColor,
        onClickIcon,
        min,
        max,
        onChange,
        ...props
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const inputType = useMemo(() => (type === 'number' ? 'text' : type), [type]);

    const inputValue = useMemo(() => {
        const value = type === 'number' ? bindingNumberOrComma(props.value as number).toComma : props.value;
        if (!value) return '';
        return value;
    }, [type, props.value]);

    const onChangeValue = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!onChange) return;
            const { value } = e.target;
            if (type === 'number') {
                if (min && min > bindingNumberOrComma(value).toNumber) {
                    return onChange(min);
                }
                if (max && max < bindingNumberOrComma(value).toNumber) {
                    return onChange(max);
                }
                console.log({ value, toNumber: bindingNumberOrComma(value).toNumber });
                return onChange(bindingNumberOrComma(value).toNumber);
            }
            return onChange(value);
        },
        [max, min, onChange, type],
    );

    const onFocus = useCallback(
        (e: React.FocusEvent<HTMLDivElement, Element>) => {
            if (loading) return;
            const element = e.target.parentElement!;
            element.classList.add('focused');
        },
        [loading],
    );

    const onBlur = useCallback((e: React.FocusEvent<HTMLDivElement, Element>) => {
        const element = e.target.parentElement!;
        element.classList.remove('focused');
    }, []);

    useEffect(() => {
        const element = inputRef.current;
        if (!element) return;
        element.setAttribute('style', `height: ${size === 'default' ? 32 : 48}px`);
    }, [size]);

    return (
        <div
            className="wds-input-container"
            data-border={bordered}
            data-loading={loading}
            data-is-icon={!!icon}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            <input
                {...props}
                className="wds-input"
                ref={inputRef}
                type={inputType === 'password' ? passwordType : inputType}
                value={inputValue}
                onChange={onChangeValue}
            />
            {type === 'password' ? (
                <span className="icon">
                    <Icons
                        icon={passwordType === 'password' ? 'visibility' : 'visibilityOff'}
                        fill={iconColor}
                        onClick={() => {
                            setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'));
                            onClickIcon && onClickIcon();
                        }}
                    />
                </span>
            ) : (
                icon && (
                    <span className="icon">
                        <Icons icon={icon} fill={iconColor} onClick={onClickIcon} />
                    </span>
                )
            )}
        </div>
    );
}

export default forwardRef(Input);
