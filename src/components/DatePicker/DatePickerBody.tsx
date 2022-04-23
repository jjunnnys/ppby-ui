import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { isCurrentDateIncludedInList, isToday } from '@field-share/utils';
import classNames from 'classnames';
// PAGES
// COMPONENTS
import Icons from '../Icons';
import { DatePickerProps, prefixCls } from './DatePicker';
import NumberText from '../NumberText';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES

// TODO contextAPI 고려

interface DatePickerBodyProps
    extends Omit<
        DatePickerProps,
        'type' | 'value' | 'onChangeDate' | 'isOnlyOneDateSelect' | 'inputFormat' | 'inputTypeSize'
    > {
    monthList: Dayjs[][] | undefined;
    currentDate: Dayjs;
    setCurrentDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    disabledDate: (date: Dayjs) => boolean;
    startDate: Dayjs | undefined;
    endDate: Dayjs | undefined;
    onClickDate: (date: Dayjs) => () => void;
}

const mobileRexg =
    /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i;
const isMobile = mobileRexg.test.bind(mobileRexg);

function DatePickerBody(props: DatePickerBodyProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const {
        dateType,
        monthList,
        currentDate,
        setCurrentDate,
        eventDate,
        isShowToday,
        disabledDate,
        startDate,
        endDate,
        onClickDate,
    } = props;
    const _ref = useRef<HTMLDivElement>(null);
    const monthsShort = useRef(dayjs.monthsShort()).current;
    const yearNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[0].split('년')[0], [currentDate]);
    const monthNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[1].split('월')[0], [currentDate]);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-${dateType}`]: dateType || 'day',
                mobile: isMobile(navigator.userAgent),
            }),
        [dateType],
    );

    const cellClassName = useCallback(
        (index: number, day: Dayjs) => {
            const cellCls = `${prefixCls}-cell`;
            const isPrevDate = index === 0 && day.get('date') > 10;
            const isNextDate = monthList ? index === monthList.length - 1 && day.get('date') < 10 : undefined;
            return classNames(cellCls, {
                [`${cellCls}-not-included`]: isPrevDate || isNextDate,
                [`${cellCls}-event`]: isCurrentDateIncludedInList(day, eventDate || []),
            });
        },
        [eventDate, monthList],
    );

    const onClickArrow = useCallback(
        (type: 'left' | 'right') => () => {
            if (type === 'left') {
                setCurrentDate((prev) => {
                    const prevMonth = prev.startOf('month').subtract(1, dateType === 'day' ? 'month' : 'year');
                    return prevMonth;
                });
                return;
            }
            setCurrentDate((prev) => {
                const nextMonth = prev.startOf('month').add(1, dateType === 'day' ? 'month' : 'year');
                return nextMonth;
            });
        },
        [dateType, setCurrentDate],
    );

    useImperativeHandle(ref, () => _ref.current!);

    useEffect(() => {}, []);

    return (
        <div ref={_ref} className={className} role="presentation" aria-label="날짜 선택 달력">
            <div className={`${prefixCls}-header`}>
                <button type="button" onClick={onClickArrow('left')}>
                    <Icons icon="leftArrow" />
                </button>
                <div className={`${prefixCls}-year-month`}>
                    <span>
                        <NumberText fontSize={14} number={yearNumber} />년
                    </span>
                    {dateType === 'day' && (
                        <span>
                            <NumberText fontSize={14} number={monthNumber} />월
                        </span>
                    )}
                </div>
                <button type="button" onClick={onClickArrow('right')}>
                    <Icons icon="rightArrow" />
                </button>
            </div>
            {dateType === 'day' ? (
                <table className={`${prefixCls}-body`}>
                    <thead>
                        <tr>
                            {dayjs.weekdaysShort(true).map((v) => (
                                <th key={v}>{v}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {monthList?.map((weeks, i) => (
                            <tr key={i}>
                                {weeks.map((day) => (
                                    <td
                                        key={day.format('YYYY-MM-DD')}
                                        data-today={isShowToday ? isToday(day) : false}
                                        data-start-date-finish={!!endDate && day.isSame(startDate)}
                                        data-start-date={day.isSame(startDate)}
                                        data-end-date={day.isSame(endDate)}
                                        data-select={startDate && endDate ? day.isBetween(startDate, endDate) : false}
                                        data-same-date={startDate?.isSame(endDate)}
                                        data-disabled={disabledDate(day)}
                                        className={cellClassName(i, day)}
                                        // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                                        role="button"
                                        onKeyPress={() => {}}
                                        onClick={disabledDate(day) ? undefined : onClickDate(day)}
                                    >
                                        <span>{day.get('date')}</span>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div id="wds-date-picker-month">
                    {monthsShort.map((v, i) => (
                        <button
                            key={v}
                            type="button"
                            className="month-cell"
                            onClick={onClickDate(dayjs(`${yearNumber}-${i + 1}-01`))}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default React.memo(forwardRef(DatePickerBody));
