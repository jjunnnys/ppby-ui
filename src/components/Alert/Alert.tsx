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
    cancelText?: string;
    okText?: string;
    type?: 'primary' | 'danger';
    onCancel(): void;
    onOk?(): void;
};

function Alert({
    isVisible,
    title,
    subTitle,
    cancelText = '취소하기',
    okText = '삭제하기',
    type = 'danger',
    onOk,
    onCancel,
}: AlertProps) {
    const ref = useRef<Element | null>(null);
    const alertRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (document) {
            const dom = document.getElementById('wds-alert-modal');
            ref.current = dom;
        }

        return () => {
            setIsMounted(false);
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
                    <footer className="wds-alert-footer">
                        <button
                            type="button"
                            className={['wds-alert-button', 'wds-close'].join(' ')}
                            onClick={onCancel}
                        >
                            {cancelText}
                        </button>
                        {onOk && (
                            <button
                                type="button"
                                className={['wds-alert-button', 'wds-ok'].join(' ')}
                                data-type={type}
                                onClick={onOk}
                            >
                                {okText}
                            </button>
                        )}
                    </footer>
                </div>
            </div>,
            ref.current!,
        );
    }
    return null;
}

export default Alert;
