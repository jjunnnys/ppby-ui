import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
            const element = document.querySelector<HTMLDivElement>('#ppby-modal');
            if (element) {
                dom = element;
            } else {
                dom = document.createElement('div');
                dom.id = 'ppby-modal';
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
            <div className="ppby-modal-container" aria-label="모달 배경" data-open={isVisible}>
                <div ref={modalRef} className="ppby-modal-wrapper" role="dialog" aria-label="modal">
                    <header className="ppby-modal-header">
                        <h1 className="ppby-modal-header-title">{title}</h1>
                        <Icons className="ppby-modal-icon" icon="close" fill={colors.grey[700]} onClick={onCancel} />
                    </header>
                    <section className="ppby-modal-content">{children}</section>
                    {footer && <footer className="ppby-modal-footer">{footer}</footer>}
                </div>
            </div>,
            ref.current!,
        );
    }
    return null;
}

export default Modal;
