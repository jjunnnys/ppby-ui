import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import colors from '@field-share/colors';
import { getPrefixCls } from '@field-share/utils';
import classNames from 'classnames';
// COMPONENTS
import Icons from '../Icons';
// STYLES
import './styles.css';

type AlertProps = {
    title: string;
    subTitle?: string;
    isVisible: boolean;
    onCancel(): void;
    footer?: React.ReactNode;
};

const prefixCls = getPrefixCls('alert');

function Alert({ isVisible, title, subTitle, onCancel, footer }: AlertProps) {
    const ref = useRef<Element | null>(null);
    const alertRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-open`]: isVisible,
            }),
        [isVisible],
    );

    useEffect(() => {
        let dom: HTMLDivElement;
        setIsMounted(true);
        if (document) {
            const element = document.querySelector<HTMLDivElement>(`#${prefixCls}`);
            if (element) {
                dom = element;
            } else {
                dom = document.createElement('div');
                dom.id = prefixCls;
                document.body.insertAdjacentElement('beforeend', dom);
            }
            ref.current = dom;
        }

        return () => {
            setIsMounted(false);
            document.body.removeChild(dom);
        };
    }, []);

    if (!!ref.current && isMounted) {
        return createPortal(
            <div className={className} aria-hidden="true" data-open={isVisible}>
                <div ref={alertRef} className={`${prefixCls}-wrapper`} role="dialog" aria-label="alert">
                    <header className={`${prefixCls}-header`}>
                        <Icons
                            className={`${prefixCls}-icon`}
                            icon="close"
                            fill={colors.grey[700]}
                            onClick={onCancel}
                        />
                        <h1 className={`${prefixCls}-title`}>{title}</h1>
                    </header>
                    <p className={`${prefixCls}-contents`}>{subTitle || ''}</p>
                    {footer && <footer className={`${prefixCls}-footer`}>{footer}</footer>}
                </div>
            </div>,
            ref.current!,
        );
    }
    return null;
}

export default Alert;
