import React, { useState, useCallback, useImperativeHandle, useRef, forwardRef, useEffect, useMemo } from 'react';
import { getPrefixName } from '@field-share/utils';
import classNames from 'classnames';
// COMPONENTS
import Icons from '../Icons';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

export interface SelectProps
    extends Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange' | 'ref'> {
    options: string[];
    loading?: boolean;
    bordered?: boolean;
    value?: string;
    size?: 'default' | 'large';
    clearOption?: boolean;
    onChange?(value: string | undefined): void;
}

const prefixCls = getPrefixName('select').class;

// TODO focus 추가
function Select(
    {
        options,
        bordered = true,
        size = 'default',
        loading = false,
        value,
        onChange,
        clearOption = false,
        disabled,
        style,
        ...props
    }: SelectProps,
    ref: React.ForwardedRef<HTMLSelectElement>,
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement | null>(null);

    useImperativeHandle(ref, () => selectRef.current!);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-${size}`]: size !== 'default',
                [`${prefixCls}-border`]: bordered,
                [`${prefixCls}-placeholder`]: !value,
                disabled,
                loading,
            }),
        [bordered, disabled, loading, size, value],
    );

    const onSelect = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            onChange && onChange(e.target.value || (undefined as any));
            containerRef.current?.classList.remove('focus');
        },
        [onChange],
    );

    useEffect(() => {
        if (!selectRef.current) return;
        const onFocus = () => {
            containerRef.current?.classList.add('focus');
        };
        const onBlur = () => {
            containerRef.current?.classList.remove('focus');
        };
        selectRef.current.addEventListener('focus', onFocus, true);
        selectRef.current.addEventListener('blur', onBlur, true);

        return () => {
            selectRef.current?.removeEventListener('focus', onFocus, true);
            selectRef.current?.removeEventListener('blur', onBlur, true);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            className={className}
            data-value={value || props?.placeholder}
            aria-disabled={disabled}
            style={style}
        >
            <select {...props} ref={selectRef} onChange={onSelect} disabled={disabled}>
                {clearOption && <option value="">- 선택취소 -</option>}
                {options.map((option) => (
                    <option key={option as any} value={option as any}>
                        {option}
                    </option>
                ))}
            </select>
            <Icons className="icon" icon="downArrow" />
        </div>
    );
}

export default forwardRef(Select);
