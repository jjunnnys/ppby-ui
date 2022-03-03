// import React, { useCallback, useMemo, useState } from 'react';
// import { css } from '@emotion/react';
// import dayjs, { Dayjs } from 'dayjs';
// import colors from '../../utils/colors';
// import Icons from '../Icons';
// // PAGES
// // COMPONENTS
// // HOOKS
// // MODULES
// // LIB
// // TYPES
// // STYLES
// type PickerProps = {
//     type: 'date' | 'time';
//     value: Dayjs | undefined;
//     onChangePicker(value: Dayjs | undefined): void;
//     format?: string;
// } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'format' | 'onChange'>;

// function Picker({ type, value, onChangePicker, format, ...props }: PickerProps) {
//     const valueData = useMemo(() => {
//         if (type === 'date') {
//             if (value) return value.format(format || 'YYYY-MM-DD');
//             return '날짜 선택';
//         }
//         if (value) return value.format(format || 'HH:mm');
//         return '시간 선택';
//     }, [type, value]);

//     const onChange = useCallback(
//         (e: React.ChangeEvent<HTMLInputElement>) => {
//             const { value: v } = e.target;
//             let pickerValue: Dayjs | undefined;
//             if (type === 'date') {
//                 pickerValue = v ? dayjs(v).startOf('date') : undefined;
//             } else {
//                 pickerValue = v ? dayjs(`${dayjs().format('YYYY-MM-DD')} ${v}`) : undefined;
//             }
//             onChangePicker(pickerValue);
//         },
//         [onChangePicker, type],
//     );

//     return (
//         <div css={container(type)} data-value={valueData}>
//             <input type={type} onChange={onChange} {...props} />
//             <Icons icon={type === 'date' ? 'calendar' : 'time'} />
//         </div>
//     );
// }

// const container = (type: 'date' | 'time') => css`
//     position: relative;
//     border: 1px solid ${colors.grey[300]};
//     box-sizing: border-box;
//     border-radius: 4px;
//     overflow: hidden;

//     input {
//         display: inline-block;
//         min-width: ${type === 'date' ? 173 : 114}px;
//         height: 48px;
//         outline: none;
//         border: none;
//         padding: 0;
//         background-color: transparent;

//         &::-webkit-datetime-edit-ampm-field,
//         &::-webkit-datetime-edit-day-field,
//         &::-webkit-datetime-edit-hour-field,
//         &::-webkit-datetime-edit-millisecond-field,
//         &::-webkit-datetime-edit-minute-field,
//         &::-webkit-datetime-edit-month-field,
//         &::-webkit-datetime-edit-second-field,
//         &::-webkit-datetime-edit-week-field,
//         &::-webkit-datetime-edit-year-field,
//         &::-webkit-datetime-edit-text {
//             display: none;
//         }

//         &[type='date']::-webkit-calendar-picker-indicator {
//             position: absolute;
//             left: auto;
//             right: 0;
//             top: 0;
//             bottom: 0;
//             width: 100%;
//             height: 100%;
//             background-color: transparent;
//             color: transparent;
//             opacity: 0;
//             cursor: pointer;
//         }
//         &[type='time']::-webkit-calendar-picker-indicator {
//             position: absolute;
//             left: auto;
//             right: 0;
//             top: 0;
//             bottom: 0;
//             width: 100%;
//             height: 100%;
//             background-color: transparent;
//             color: transparent;
//             opacity: 0;
//             cursor: pointer;
//         }
//     }

//     svg {
//         position: absolute;
//         top: 0;
//         right: 8px;
//         bottom: 0;
//         margin: auto 0;
//         color: ${colors.grey[400]};
//         pointer-events: none;
//         transform: ${type === 'date' ? 'scale(1)' : 'scale(0.9)'};
//         z-index: 1;
//     }

//     &::after {
//         content: attr(data-value);
//         position: absolute;
//         top: 0;
//         left: 0;
//         right: 0;
//         bottom: 0;
//         display: flex;
//         align-items: center;
//         padding-left: 16px;
//         background-color: #fff;

//         font-size: 16px;
//         line-height: 21px;
//         color: ${colors.grey[700]};

//         pointer-events: none;
//     }
// `;

// export default React.memo(Picker);
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
type PickerProps = {};

function Picker() {
    return <div>Picker</div>;
}

export default Picker;
