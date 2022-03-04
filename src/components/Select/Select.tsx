import React, { useState, useCallback, useImperativeHandle, useRef, forwardRef, useEffect } from 'react';
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
    onChange?(v: string): void;
}

function Select(
    { options, bordered = true, size = 'default', loading = false, value, onChange, ...props }: SelectProps,
    ref: React.ForwardedRef<HTMLSelectElement>,
) {
    const containerRef = useRef<HTMLDivElement>(null);
    const selectRef = useRef<HTMLSelectElement>(null);
    const [selectValue, setSelectValue] = useState(() => value || '');
    const [isClear, setIsClear] = useState(false);

    const onSelect = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectValue(e.target.value);
            onChange && onChange(e.target.value);
        },
        [onChange],
    );

    const onMouseEnter = useCallback(() => {
        if (!selectValue) return;
        setIsClear(true);
    }, [selectValue]);

    const onMouseLeave = useCallback(() => {
        setIsClear(false);
    }, []);

    useImperativeHandle(ref, () => selectRef.current!);

    useEffect(() => {
        if (!containerRef.current) return;
        containerRef.current.style.height = `${size === 'default' ? 32 : 48}px`;
    }, [size]);

    return (
        <div
            ref={containerRef}
            className="wds-select-container"
            data-border={bordered}
            data-is-placeholder={!selectValue}
            data-value={selectValue || props?.placeholder}
            data-loading={loading}
            aria-label="select"
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <select ref={selectRef} className="wds-select" value={value} onChange={onSelect} {...props}>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            {isClear ? (
                <span className="clear-icon">
                    <Icons icon="close" onClick={() => setSelectValue('')} />
                </span>
            ) : (
                <Icons className="icon" icon="downArrow" />
            )}
        </div>
    );
}

export default forwardRef(Select);
