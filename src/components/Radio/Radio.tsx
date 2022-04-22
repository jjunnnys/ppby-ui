import React, { useCallback, useRef, useMemo, createContext, useContext, useEffect } from 'react';
import { getPrefixName, simpleUniqueId } from '@field-share/utils';
import classNames from 'classnames';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

type ChangeType = ((value: string | undefined) => void) | undefined;

export type RadioProps = {
    value?: string;
    label?: string;
    disabled?: boolean;
};
type GroupProps = {
    children: React.ReactNode;
    direction?: 'column' | 'row';
    value?: string;
    onChange?(value: string | undefined): void;
};

const prefixCls = getPrefixName('radio').class;
const ValueContext = createContext<string | undefined>(undefined);
const NameContext = createContext<string | undefined>(undefined);
const ChangeContext = createContext<ChangeType>(undefined);

function Radio({ label, value, disabled }: RadioProps) {
    const groupValue = useContext(ValueContext);
    const groupName = useContext(NameContext);
    const onChangeValue = useContext(ChangeContext);
    const className = useMemo(() => classNames(prefixCls, {}), []);

    const radioChecked = useMemo(() => (groupValue ? groupValue === value : false), [groupValue, value]);

    const getId = useMemo(() => (label ? `${label}-${groupName}` : undefined), [groupName, label]);

    const onChangeRadio = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const v = e.target.value;
            if (onChangeValue) onChangeValue(v);
        },
        [onChangeValue],
    );

    return (
        <div className={className}>
            <input
                id={getId}
                type="radio"
                value={value}
                onChange={onChangeRadio}
                disabled={disabled}
                checked={radioChecked}
                name={groupName}
            />
            {groupName && label && <label htmlFor={getId}>{label}</label>}
        </div>
    );
}

function Group({ children, direction = 'row', onChange, value }: GroupProps) {
    const groupPrefixCls = useMemo(
        () =>
            classNames(`${prefixCls}-group`, {
                column: direction === 'column',
            }),
        [direction],
    );

    return (
        <ChangeContext.Provider value={onChange}>
            <ValueContext.Provider value={value}>
                <NameContext.Provider value={simpleUniqueId(prefixCls)}>
                        <div className={groupPrefixCls}>{children}</div>
                </NameContext.Provider>
            </ValueContext.Provider>
        </ChangeContext.Provider>
    );
}

Radio.Group = Group;

export default Radio;
