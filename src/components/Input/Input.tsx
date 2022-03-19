import React, { useMemo, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { bindingNumberOrComma, getPrefixName, applyHyphen } from '@field-share/utils';
import colors from '@field-share/styles';
import classNames from 'classnames';
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
    afterIcon?: IconsType;
    beforeIcon?: IconsType;
    afterIconColor?: string;
    beforeIconColor?: string;
    onClickAfterIcon?(): void;
    onClickBeforeIcon?(): void;
    onChange?(value: number | string | undefined): void;
    /**
     * type이 nubmer일 경우에만 사용
     */
    min?: number;
    /**
     * type이 nubmer일 경우에만 사용
     */
    max?: number;
    type?: HTMLInputTypeAttribute;
}

const prefixCls = getPrefixName('input').class;

function Input(
    {
        type = 'text',
        size = 'default',
        bordered = true,
        loading = false,
        afterIcon,
        beforeIcon,
        afterIconColor,
        beforeIconColor,
        onClickBeforeIcon,
        onClickAfterIcon,
        min,
        max,
        value,
        onChange,
        ...props
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const className = useMemo(
        () =>
            classNames(
                prefixCls,
                {
                    [`${prefixCls}-${size}`]: size !== 'default',
                    [`${prefixCls}-border`]: bordered,
                    [`${prefixCls}-after-icon`]: type === 'password' || !!afterIcon,
                    [`${prefixCls}-before-icon`]: !!beforeIcon,
                },
                `${prefixCls}-${loading ? 'on' : 'off'}`,
            ),
        [size, bordered, afterIcon, type, beforeIcon, loading],
    );

    const inputType = useMemo(() => (type === 'number' ? 'text' : type), [type]);

    const inputValue = useMemo(() => {
        let inputTypeValue = value as string;
        if (type === 'number') {
            inputTypeValue = bindingNumberOrComma(value as number).toComma;
        }
        if (type === 'tel') {
            inputTypeValue = applyHyphen(value as string).add;
        }

        return inputTypeValue || '';
    }, [type, value]);

    const onChangeValue = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!onChange) return;
            const { value: v } = e.target;
            if (type === 'number') {
                if (min && min > bindingNumberOrComma(v).toNumber) {
                    return onChange(min);
                }
                if (max && max < bindingNumberOrComma(v).toNumber) {
                    return onChange(max);
                }
                return onChange(bindingNumberOrComma(v).toNumber);
            }
            if (type === 'tel') {
                return onChange(applyHyphen(v).remove);
            }

            return onChange(v);
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

    return (
        <div
            className={className}
            // data-is-icon={!!icon}
            onFocus={onFocus}
            onBlur={onBlur}
        >
            {beforeIcon && (
                <span className="before-icon">
                    <Icons
                        icon={beforeIcon}
                        fill={beforeIconColor}
                        color={beforeIconColor}
                        onClick={onClickBeforeIcon}
                    />
                </span>
            )}
            <input
                {...props}
                ref={inputRef}
                type={inputType === 'password' ? passwordType : inputType}
                maxLength={type === 'tel' ? 13 : props.maxLength}
                value={inputValue}
                onChange={onChangeValue}
            />
            {type === 'password' ? (
                <span className="after-icon">
                    <Icons
                        icon={passwordType === 'password' ? 'visibility' : 'visibilityOff'}
                        fill={colors.grey[200]}
                        color={colors.grey[200]}
                        onClick={() => {
                            setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'));
                            onClickBeforeIcon && onClickBeforeIcon();
                        }}
                    />
                </span>
            ) : (
                afterIcon && (
                    <span className="after-icon">
                        <Icons
                            icon={afterIcon}
                            fill={afterIconColor}
                            color={afterIconColor}
                            onClick={onClickAfterIcon}
                        />
                    </span>
                )
            )}
        </div>
    );
}

export default forwardRef(Input);
