import React, { useMemo, forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react';
import { bindingNumberOrComma } from '@field-share/utils';
// PAGES
// COMPONENTS
import Icons, { IconsType } from '../Icons';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'min' | 'max' | 'onChange'> {
    loading?: boolean;
    bordered?: boolean;
    size?: 'default' | 'large';
    icon?: IconsType;
    iconColor?: string;
    onClickIcon?(): void;
    onChange?<T = number | string | undefined>(value: T): void;
    min?: number;
    max?: number;
}

function Input(
    {
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
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const inputType = useMemo(() => (props.type === 'number' ? 'text' : props.type), [props.type]);

    const inputValue = useMemo(() => {
        // console.log({ aa: bindingNumberOrComma(props.value as number).toComma });
        return props.type === 'number' ? bindingNumberOrComma(props.value as number).toComma : props.value;
    }, [props.type, props.value]);

    const onChangeValue = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!onChange) return;
            const { value } = e.target;
            if (props.type === 'number') {
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
        [max, min, onChange, props.type],
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
                type={inputType}
                value={inputValue}
                onChange={onChangeValue}
            />
            {icon && (
                <span className="icon">
                    <Icons icon={icon} fill={iconColor} onChange={onClickIcon} />
                </span>
            )}
        </div>
    );
}

export default forwardRef(Input);
