import React, { useCallback, useEffect, useMemo } from 'react';
import { getPrefixName } from '@field-share/utils';
import classNames from 'classnames';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

type CheckboxProps = {
    checked?: boolean;
    onChange?(checked: boolean): void;
    disabled?: boolean;
    label?: string;
};

const prefixCls = getPrefixName('checkbox').class;

function Checkbox({ checked, disabled = false, onChange, label }: CheckboxProps) {
    const className = useMemo(() => classNames(prefixCls, {}), []);
    const onChecked = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const isChecked = e.target.checked;
            onChange && onChange(isChecked);
        },
        [onChange],
    );

    return (
        <div className={className}>
            <input
                id={label ? `${prefixCls}-${label}` : undefined}
                type="checkbox"
                checked={checked}
                onChange={onChecked}
                disabled={disabled}
            />
            {label && <label htmlFor={`${prefixCls}-${label}`}>{label}</label>}
        </div>
    );
}

export default Checkbox;
