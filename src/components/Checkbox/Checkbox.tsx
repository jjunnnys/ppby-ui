import React, { useCallback, useEffect, useMemo } from 'react';
import classNames from 'classnames';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

export type CheckboxProps = {
    checked?: boolean;
    onChange?(checked: boolean): void;
    disabled?: boolean;
    label?: string;
};

const prefixCls = getPrefixName('checkbox').class;

function Checkbox({ checked, disabled = false, onChange, label }: CheckboxProps) {
    const className = useMemo(() => classNames(prefixCls, {}), []);
    const id = useMemo(() => (label ? simpleUniqueId(label) : undefined), [label]);
    const onChecked = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const isChecked = e.target.checked;
            onChange && onChange(isChecked);
        },
        [onChange],
    );

    return (
        <div className={className}>
            <input id={id} type="checkbox" checked={checked} onChange={onChecked} disabled={disabled} />
            {label && <label htmlFor={id}>{label}</label>}
        </div>
    );
}

export default Checkbox;
