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

interface SelectProps extends Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange'> {
    options: string[];
    loading?: boolean;
    bordered?: boolean;
    value?: string | number;
    size?: 'default' | 'large';
    clearOption?: boolean;
    onChange?(value: string | undefined): void;
}

const CLEAR = 'clear';

const prefixCls = getPrefixName('select').class;

function Select(
    {
        options,
        bordered = true,
        size = 'default',
        loading = false,
        value,
        onChange,
        clearOption = false,
        ...props
    }: SelectProps,
    ref: React.ForwardedRef<HTMLSelectElement>,
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const [selectValue, setSelectValue] = useState(() => value || '');

    useImperativeHandle(ref, () => selectRef.current!);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-${size}`]: size !== 'default',
                [`${prefixCls}-border`]: bordered,
                [`${prefixCls}-placeholder`]: !selectValue,
                loading,
            }),
        [bordered, loading, selectValue, size],
    );

    const onSelect = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectValue(e.target.value);
            onChange && onChange(e.target.value || undefined);
        },
        [onChange],
    );

    return (
        <div
            ref={containerRef}
            className={className}
            data-value={selectValue || props?.placeholder}
            aria-label="select"
        >
            <select {...props} ref={selectRef} value={value} onChange={onSelect}>
                {clearOption && <option value="">- 선택취소 -</option>}
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <Icons className="icon" icon="downArrow" />
        </div>
    );
}

export default forwardRef(Select);
