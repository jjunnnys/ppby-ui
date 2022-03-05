import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import colors from '@field-share/colors';
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

function Alert({ isVisible, title, subTitle, onCancel, footer }: AlertProps) {
    const ref = useRef<Element | null>(null);
    const alertRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const dom = document.createElement('div');
        setIsMounted(true);
        if (document) {
            dom.id = 'wds-alert-modal';
            document.body.insertAdjacentElement('beforeend', dom);
            ref.current = dom;
        }

        return () => {
            setIsMounted(false);
            document.body.removeChild(dom);
        };
    }, []);

    if (!!ref.current && isMounted) {
        return createPortal(
            <div className="wds-alert-container" aria-label="얼럴트 배경" data-open={isVisible}>
                <div ref={alertRef} className="wds-alert-wrapper" role="dialog" aria-label="alert">
                    <header className="wds-alert-header">
                        <Icons
                            className="wds-alert-header-icon"
                            icon="close"
                            fill={colors.grey[700]}
                            onClick={onCancel}
                        />
                        <h1 className="wds-alert-title">{title}</h1>
                    </header>
                    <p className="wds-alert-content">{subTitle || ''}</p>
                    {footer && <footer className="wds-alert-footer">{footer}</footer>}
                </div>
            </div>,
            ref.current!,
        );
    }
    return null;
}

export default Alert;
