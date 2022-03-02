import React, { useState, useCallback, useImperativeHandle, useRef, forwardRef } from 'react';
import { css } from '@emotion/react';
import colors from '../../utils/colors';
import Icons from '../Icons';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
interface SelectProps extends Omit<React.InputHTMLAttributes<HTMLSelectElement>, 'size' | 'value' | 'onChange'> {
    options: string[];
    loading?: boolean;
    bordered?: boolean;
    value?: string | number;
    size?: 'default' | 'large';
    onChange?(e: React.ChangeEvent<HTMLSelectElement>): void;
}

function Select(
    { options, bordered = true, size = 'default', loading = false, value, onChange, ...props }: SelectProps,
    ref: React.Ref<HTMLSelectElement>,
) {
    const selectRef = useRef<HTMLSelectElement>(null);
    const [selectValue, setSelectValue] = useState(value || '');
    const onSelect = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSelectValue(e.target.value);
            onChange && onChange(e);
        },
        [onChange],
    );
    useImperativeHandle(ref, () => selectRef.current!);
    return (
        <div
            css={container(size)}
            data-border={bordered}
            data-is-placeholder={loading || !selectValue}
            data-value={loading ? '로딩 중...' : selectValue || props?.placeholder}
            aria-label="select"
        >
            <select
                ref={selectRef}
                placeholder={loading ? '로딩 중...' : props.placeholder}
                value={value}
                onChange={onSelect}
                {...props}
            >
                {loading ? (
                    <option value="로딩 중..." disabled>
                        로딩 중...
                    </option>
                ) : (
                    options.map((option) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))
                )}
            </select>
            <Icons className="icon" icon="downArrow" />
        </div>
    );
}

const container = (size: 'default' | 'large') => css`
    position: relative;
    display: flex;
    align-items: center;
    border-radius: 4px;
    overflow: hidden;
    border: 1px solid rgba(0, 0, 0, 0);
    width: 100%;
    min-width: 100px;
    height: ${size === 'default' ? 32 : 48}px;

    &::after {
        content: attr(data-value);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        align-items: center;
        padding-left: 16px;
        padding-right: 48px;
        background-color: #fff;
        color: ${colors.grey[700]};
        font-size: 15px;
        line-height: 19px;
        pointer-events: none;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
    }

    &[data-is-placeholder='true'] {
        &::after {
            color: ${colors.grey[400]};
        }
    }

    select {
        width: 100%;
        height: 100%;
        border: 1px solid red;
        outline: none;
        border: none;
        border-radius: 4px;
        background-color: transparent;

        color: transparent;

        -webkit-appearance: none;
        -moz-appearance: none;
        cursor: pointer;
    }
    &[data-border='true'] {
        transition: border-color 0.2s;
        border: 1px solid ${colors.grey[200]};
        &:hover {
            border: 1px solid ${colors.grey[300]};
        }
    }
    &[data-border='false'] {
        &::after {
            transition: background-color 0.2s;
        }
        &:hover {
            &::after {
                background-color: ${colors.grey[100]};
            }
        }
    }

    .icon {
        position: absolute;
        top: 0;
        bottom: 0;
        right: 8px;
        margin: auto 0;
        pointer-events: none;
        z-index: 1;
    }
`;

export default forwardRef<HTMLSelectElement, SelectProps>(Select);
