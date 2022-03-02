import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { css } from '@emotion/react';
import colors from '../../utils/colors';
import Icons, { IconsType } from '../Icons';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
    loading?: boolean;
    bordered?: boolean;
    size?: 'default' | 'large';
    icon?: IconsType;
    iconColor?: string;
    onClickIcon?(): void;
}

function Input(
    { size = 'default', bordered = true, loading = false, icon, iconColor, onClickIcon, ...props }: InputProps,
    ref: React.Ref<HTMLInputElement>,
) {
    const inputRef = useRef<HTMLInputElement>(null);
    useImperativeHandle(ref, () => inputRef.current!);
    return (
        <div css={container(size)} data-border={bordered}>
            <input ref={inputRef} type="text" {...props} />
            {icon && <Icons icon={icon} fill={iconColor} onChange={onClickIcon} />}
        </div>
    );
}

const container = (size: 'default' | 'large') => css`
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    width: 100%;
    border: 1px solid rgba(0, 0, 0, 0);

    input {
        width: 100%;
        min-width: 100px;
        height: ${size === 'default' ? 32 : 48}px;
        padding: 6px 0;
        padding-left: 16px;
        padding-right: 32px;
        outline: none;
        border: 1px solid rgba(0, 0, 0, 0);
        border-radius: 4px;
        background-color: #fff;
        text-align: left;
        font-size: 15px;
        line-height: 19px;
        color: ${colors.grey[700]};
        cursor: pointer;
    }

    &[data-border='true'] {
        transition: background-color 0.2s;
        input {
            border: 1px solid ${colors.grey[200]};
            background-color: #fff;
        }
        &:hover {
            background-color: ${colors.grey[300]};
        }
    }
    &[data-border='false'] {
        input {
            transition: background-color 0.2s;
        }
        &:hover {
            input {
                background-color: ${colors.grey[100]};
            }
        }
    }

    svg {
        position: absolute;
        top: 0;
        right: 10px;
        bottom: 0;
        margin: auto 0;
        color: inherit;
        cursor: pointer;
    }
`;

export default forwardRef<HTMLInputElement, InputProps>(Input);
