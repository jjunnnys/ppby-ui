// import React from 'react';
// import { css } from '@emotion/react';
// // PAGES
// // COMPONENTS
// // HOOKS
// import useToast from '../../hooks/useToast';
// // MODULES
// // LIB
// // TYPES
// // STYLES
// export type ToastProps = {
//     text: string;
//     position?: 'top' | 'bottom';
//     /**
//      * ms 단위
//      */
//     duration?: number;
// };

// function Toast({ text = '', position = 'top', duration = 3000 }: ToastProps) {
//     const { ToastPortal, onOpen } = useToast(duration);
//     return (
//         <>
//             <ToastPortal position={position}>{text}</ToastPortal>
//             <button css={container} type="button" onClick={onOpen}>
//                 Open Toast
//             </button>
//         </>
//     );
// }

// const container = css`
//     border: 1px solid #3a3a3a;
//     padding: 10px 30px;
//     border-radius: 4px;
// `;

// export default Toast;

// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
type ToastProps = {};

function Toast() {
    return <div>Toast</div>;
}

export default Toast;
