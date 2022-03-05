import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { isToday, map } from '@field-share/utils';
// PAGES
// COMPONENTS
import Icons from '../Icons';
import { DatePickerProps } from './DatePicker';
import NumberText from '../NumberText';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES

interface DatePickerBodyProps extends Omit<DatePickerProps, 'type' | 'value'> {
    monthList: Dayjs[][] | undefined;
    currentDate: Dayjs;
    initStartDate: Dayjs | undefined;
    initEndDate: Dayjs | undefined;
    setCurrentDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    disabledDate: (date: Dayjs) => boolean;
    setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

function DatePickerBody({
    dateType,
    monthList,
    currentDate,
    setCurrentDate,
    isOnlyOneDateSelect,
    eventDate,
    onChangeDate,
    isShowToday,
    disabledDate,
    initStartDate,
    initEndDate,
    setIsVisible,
}: DatePickerBodyProps) {
    const monthsShort = useRef(dayjs.monthsShort()).current;
    const [startDate, setStartDate] = useState<Dayjs | undefined>(initStartDate);
    const [endDate, setEndDate] = useState<Dayjs | undefined>(initEndDate);
    const yearNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[0].split('년')[0], [currentDate]);
    const monthNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[1].split('월')[0], [currentDate]);

    const isEventDate = useCallback(
        (day: Dayjs) => eventDate?.map((v) => v.toISOString()).includes(day.toISOString()) || false,
        [eventDate],
    );

    const onClickDate = useCallback(
        (day: Dayjs) => () => {
            if (dayjs(currentDate.startOf('month')).isAfter(day.startOf('month'))) {
                /**
                 * 이전
                 */
                setCurrentDate((prev) => {
                    const prevMonth = prev.startOf('month').subtract(1, 'month');
                    return prevMonth;
                });
            } else if (dayjs(currentDate.startOf('month')).isBefore(day.startOf('month'))) {
                /**
                 * 이후
                 */
                setCurrentDate((prev) => {
                    const nextMonth = prev.startOf('month').add(1, 'month');
                    return nextMonth;
                });
            }

            if (isOnlyOneDateSelect) {
                setStartDate((prev) => {
                    if (prev?.isSame(day)) return prev;
                    setEndDate(day);
                    onChangeDate(day);
                    const timeout = setTimeout(() => {
                        setIsVisible && setIsVisible(false);
                        clearTimeout(timeout);
                    }, 200);
                    return day;
                });
            } else {
                if (!!startDate && !!endDate) {
                    onChangeDate([day, undefined]);
                    setStartDate(day);
                    setEndDate(undefined);
                    return;
                }

                setStartDate((prevStart) => {
                    if (prevStart) {
                        if (day.isBefore(prevStart)) return day;
                        const isDisabledList = map(day.diff(prevStart, 'day') + 1, (i) => prevStart.add(i, 'day'));
                        const isReset = isDisabledList.findIndex((d) => disabledDate(d)) !== -1;
                        if (isReset) {
                            onChangeDate([day, undefined]);
                            setEndDate(undefined);
                            return day;
                        }
                        setEndDate(day);
                        onChangeDate([prevStart, day.endOf('date')]);
                        const timeout = setTimeout(() => {
                            setIsVisible && setIsVisible(false);
                            clearTimeout(timeout);
                        }, 200);
                        return prevStart;
                    }
                    onChangeDate([day, undefined]);
                    return day;
                });
            }
        },
        [
            currentDate,
            isOnlyOneDateSelect,
            setCurrentDate,
            onChangeDate,
            setIsVisible,
            startDate,
            endDate,
            disabledDate,
        ],
    );

    const onClickMonth = useCallback(
        (day: Dayjs) => () => {
            if (isOnlyOneDateSelect) {
                setStartDate((prev) => {
                    if (prev?.isSame(day)) return prev;
                    setEndDate(day);
                    onChangeDate(day);
                    setIsVisible && setIsVisible(false);
                    return day;
                });
            }
        },
        [isOnlyOneDateSelect, onChangeDate, setIsVisible],
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

    useEffect(() => {
        if (!initStartDate) setStartDate(undefined);
        if (!initEndDate) setEndDate(undefined);
    }, [initStartDate, initEndDate]);

    return (
        <div
            className="wds-date-picker-container"
            role="presentation"
            aria-label="날짜 선택 캘린더"
            data-date-type={dateType || 'day'}
        >
            <div className="date-picker-header">
                <button type="button" onClick={onClickArrow('left')}>
                    <Icons icon="leftArrow" />
                </button>
                <div className="year-month-wrapper">
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
                <table id="wds-date-picker-day">
                    <thead>
                        <tr>
                            {dayjs.weekdaysShort(true).map((v) => (
                                <th key={v}>{v}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {monthList?.map((weeks, i) => (
                            <tr className="date-picker-month-row" key={i}>
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
                                        className={[
                                            'wds-date-picker-day-date-cell',
                                            (i === 0 && day.get('date') > 10) ||
                                            (i === monthList.length - 1 && day.get('date') < 10)
                                                ? 'prev-or-next-date'
                                                : '',
                                        ].join(' ')}
                                        role="button"
                                        onKeyPress={() => {}}
                                        tabIndex={0}
                                        onClick={disabledDate(day) ? undefined : onClickDate(day)}
                                    >
                                        <span data-event={isEventDate(day)}>{day.get('date')}</span>
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
                            onClick={onClickMonth(dayjs(`${yearNumber}-${i + 1}-01`))}
                        >
                            {v}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default React.memo(DatePickerBody);
