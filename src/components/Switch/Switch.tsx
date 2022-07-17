import { useCallback, useMemo } from 'react';
import classNames from 'classnames';
// STYLES
import './styles.css';

export type SwitchProps = {
    checked?: boolean;
    onChange?(checked: boolean): void;
    disabled?: boolean;
    label?: string;
};

const prefixCls = getPrefixName('switch').class;

function Switch({ checked, disabled, label, onChange }: SwitchProps) {
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

export default Switch;
