import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import colors from '@field-share/colors';
// COMPONENTS
import Icons from '../Icons';
// STYLES
import './styles.css';

type ModalProps = {
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    isVisible: boolean;
    onCancel(): void;
};

function Modal({ title, children, footer, isVisible, onCancel }: ModalProps) {
    const ref = useRef<Element | null>(null);
    const modalRef = useRef<HTMLDivElement>(null);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        let dom: HTMLDivElement;
        setIsMounted(true);
        if (document) {
            const element = document.querySelector<HTMLDivElement>('#wds-modal');
            if (element) {
                dom = element;
            } else {
                dom = document.createElement('div');
                dom.id = 'wds-modal';
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
            <div className="wds-modal-container" aria-label="모달 배경" data-open={isVisible}>
                <div ref={modalRef} className="wds-modal-wrapper" role="dialog" aria-label="modal">
                    <header className="wds-modal-header">
                        <h1 className="wds-modal-header-title">{title}</h1>
                        <Icons className="wds-modal-icon" icon="close" fill={colors.grey[700]} onClick={onCancel} />
                    </header>
                    <section className="wds-modal-content">{children}</section>
                    {footer && <footer className="wds-modal-footer">{footer}</footer>}
                </div>
            </div>,
            ref.current!,
        );
    }
    return null;
}

export default Modal;
