import React, { useMemo, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { bindingNumberOrComma, getPrefixName, applyHyphen } from '@field-share/utils';
import colors from '@field-share/styles';
import classNames from 'classnames';
// COMPONENTS
import Icons, { IconsType } from '../Icons';
// STYLES
import './styles.css';

export type HTMLInputTypeAttribute = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export interface InputProps<T>
    extends Omit<
        React.InputHTMLAttributes<HTMLInputElement>,
        'ref' | 'size' | 'min' | 'max' | 'value' | 'onChange' | 'type'
    > {
    loading?: boolean;
    bordered?: boolean;
    value?: T;
    validate?: (value: string) => boolean;
    size?: 'default' | 'large';
    afterIcon?: IconsType;
    beforeIcon?: IconsType;
    afterIconColor?: string;
    beforeIconColor?: string;
    onClickAfterIcon?(): void;
    onClickBeforeIcon?(): void;
    onChange?(value: T): void;
    /**
     * @description type이 nubmer일 경우에만 사용
     */
    min?: number;
    /**
     * @description type이 nubmer일 경우에만 사용
     */
    max?: number;
    type?: HTMLInputTypeAttribute;
}
type AfterIconProps = {
    type: HTMLInputTypeAttribute;
    passwordType: 'password' | 'text';
    afterIcon?: IconsType;
    afterIconColor?: string;
    onClickAfterIcon?(): void;
};

const prefixCls = getPrefixName('input').class;

// const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
// const emailRegex =
//     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
// const validateUrl = urlRegex.test.bind(urlRegex);
// const validateEmail = emailRegex.test.bind(emailRegex);

function AfterIcon({ type, afterIcon, afterIconColor, passwordType, onClickAfterIcon }: AfterIconProps) {
    if (type === 'password') {
        return (
            <Icons
                className="after-icon password"
                icon={passwordType === 'password' ? 'visibility' : 'visibilityOff'}
                onClick={onClickAfterIcon}
            />
        );
    }
    if (afterIcon) {
        return (
            <Icons
                className="after-icon"
                icon={afterIcon}
                fill={afterIconColor}
                color={afterIconColor}
                onClick={onClickAfterIcon}
            />
        );
    }
    return null;
}

function InternalInput<T extends string | number>(
    {
        type = 'text',
        size = 'default',
        bordered = true,
        loading = false,
        afterIcon,
        beforeIcon,
        afterIconColor = colors.grey[300],
        beforeIconColor = colors.grey[300],
        onClickBeforeIcon,
        onClickAfterIcon,
        min,
        max,
        value,
        onChange,
        validate,
        style,
        disabled,
        ...props
    }: InputProps<T>,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

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

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-${size}`]: size !== 'default',
                [`${prefixCls}-border`]: bordered,
                [`${prefixCls}-after-icon`]: type === 'password' || !!afterIcon,
                [`${prefixCls}-before-icon`]: !!beforeIcon,
                [`${prefixCls}-error`]: validate ? validate(inputValue) : false,
                loading,
                disabled,
            }),
        [size, bordered, type, afterIcon, beforeIcon, validate, inputValue, loading, disabled],
    );

    const onChangeValue = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (!onChange) return;
            const { value: v } = e.target;
            switch (type) {
                case 'number':
                    if (min && min > bindingNumberOrComma(v).toNumber) {
                        return onChange(min as any);
                    }
                    if (max && max < bindingNumberOrComma(v).toNumber) {
                        return onChange(max as any);
                    }
                    return onChange(bindingNumberOrComma(v).toNumber as any);
                case 'tel':
                    return onChange(applyHyphen(v).remove as any);
                default:
                    return onChange(v as any);
            }
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
        <div className={className} onFocus={onFocus} onBlur={onBlur} style={style} aria-disabled={disabled}>
            {beforeIcon && (
                <Icons
                    className="before-icon"
                    onClick={() => {
                        inputRef.current?.focus();
                        onClickBeforeIcon && onClickBeforeIcon();
                    }}
                    icon={beforeIcon}
                    fill={beforeIconColor}
                    color={beforeIconColor}
                />
            )}
            <input
                {...props}
                ref={inputRef}
                type={passwordType === 'text' ? 'text' : inputType}
                maxLength={type === 'tel' ? 13 : props.maxLength}
                value={inputValue}
                onChange={onChangeValue}
                disabled={disabled}
            />
            <AfterIcon
                passwordType={passwordType}
                type={type}
                afterIcon={afterIcon}
                afterIconColor={afterIconColor}
                onClickAfterIcon={
                    type === 'password'
                        ? () => {
                              setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'));
                              onClickAfterIcon && onClickAfterIcon();
                          }
                        : onClickAfterIcon
                }
            />
        </div>
    );
}

const Input = forwardRef(InternalInput) as unknown as (<T>(props: InputProps<T>) => React.ReactElement) & {
    Option: typeof Option;
};

export default Input;
