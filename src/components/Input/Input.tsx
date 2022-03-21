import React, { useMemo, forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { bindingNumberOrComma, getPrefixName, applyHyphen } from '@field-share/utils';
import colors from '@field-share/styles';
import classNames from 'classnames';
// COMPONENTS
import Icons, { IconsType } from '../Icons';
// STYLES
import './styles.css';

export type HTMLInputTypeAttribute = 'email' | 'number' | 'password' | 'search' | 'tel' | 'text' | 'url';

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'ref' | 'size' | 'min' | 'max' | 'onChange' | 'type'> {
    loading?: boolean;
    bordered?: boolean;
    /**
     * input type에 따른 검사를 할 것인지에 대한 옵션 (`email` | `url` type만 가능)
     */
    isValidate?: boolean;
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
type AfterIconProps = {
    isValidate: boolean;
    isError: boolean;
    type: HTMLInputTypeAttribute;
    passwordType: 'password' | 'text';
    afterIcon?: IconsType;
    afterIconColor?: string;
    onClickAfterIcon?(): void;
};

const prefixCls = getPrefixName('input').class;

const urlRegex = /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;
const validateUrl = urlRegex.test.bind(urlRegex);
const validateEmail = emailRegex.test.bind(emailRegex);

function AfterIcon({
    isValidate,
    isError,
    type,
    afterIcon,
    afterIconColor,
    passwordType,
    onClickAfterIcon,
}: AfterIconProps) {
    if (isValidate) {
        return (
            <button type="button" className="after-icon vaidate" onClick={onClickAfterIcon}>
                <Icons className={['error', isError ? 'show' : ''].join(' ')} icon="error" />
                <Icons className={['success', isError ? '' : 'show'].join(' ')} icon="check" />
            </button>
        );
    }
    if (type === 'password') {
        return (
            <button type="button" className="after-icon password" onClick={onClickAfterIcon}>
                <Icons icon={passwordType === 'password' ? 'visibility' : 'visibilityOff'} />
            </button>
        );
    }
    if (afterIcon) {
        return (
            <button type="button" className="after-icon" onClick={onClickAfterIcon}>
                <Icons icon={afterIcon} fill={afterIconColor} color={afterIconColor} />
            </button>
        );
    }
    return null;
}

function Input(
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
        isValidate,
        style,
        disabled,
        ...props
    }: InputProps,
    ref: React.ForwardedRef<HTMLInputElement>,
) {
    const [passwordType, setPasswordType] = useState<'password' | 'text'>('password');
    const [isError, setIsError] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-${size}`]: size !== 'default',
                [`${prefixCls}-border`]: bordered,
                [`${prefixCls}-after-icon`]: type === 'password' || !!afterIcon,
                [`${prefixCls}-before-icon`]: !!beforeIcon,
                loading,
                disabled,
            }),
        [size, bordered, type, afterIcon, beforeIcon, loading, disabled],
    );

    const validateType = useMemo(() => {
        if (type === 'email' || type === 'url') return value ? Boolean(isValidate) : false;
        return false;
    }, [isValidate, type, value]);

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
            if (type === 'url') {
                if (v) {
                    setIsError(!validateUrl(v));
                }
                return onChange(v);
            }
            if (type === 'email') {
                if (v) {
                    setIsError(!validateEmail(v));
                }
                return onChange(v);
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
        <div className={className} onFocus={onFocus} onBlur={onBlur} style={style} aria-disabled={disabled}>
            {beforeIcon && (
                <button
                    type="button"
                    className="before-icon"
                    onClick={() => {
                        inputRef.current?.focus();
                        onClickBeforeIcon && onClickBeforeIcon();
                    }}
                >
                    <Icons icon={beforeIcon} fill={beforeIconColor} color={beforeIconColor} />
                </button>
            )}
            <input
                {...props}
                ref={inputRef}
                type={passwordType === 'text' ? 'text' : inputType}
                maxLength={type === 'tel' ? 13 : props.maxLength}
                value={inputValue}
                onChange={onChangeValue}
                disabled={disabled}
                required={validateType || props.required}
            />
            <AfterIcon
                isValidate={validateType}
                isError={isError}
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

export default forwardRef(Input);
