/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { DateEventValue, isCurrentDateIncludedInList, isToday, range } from '@field-share/utils';
import classNames from 'classnames';
// PAGES
// COMPONENTS
import Icons from '../Icons';
import { DatePickerProps, prefixCls, DateValueType } from './DatePicker';
import NumberText from '../NumberText';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES

// TODO contextAPI 고려

interface DatePickerBodyProps extends Omit<DatePickerProps, 'type' | 'value'> {
    monthList: Dayjs[][] | undefined;
    currentDate: Dayjs;
    initStartDate: DateEventValue;
    initEndDate: DateEventValue;
    setCurrentDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    disabledDate: (date: Dayjs) => boolean;
    setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

const mobileRexg =
    /iPhone|iPod|Android|Windows CE|BlackBerry|Symbian|Windows Phone|webOS|Opera Mini|Opera Mobi|POLARIS|IEMobile|lgtelecom|nokia|SonyEricsson/i;
const isMobile = mobileRexg.test.bind(mobileRexg);

function DatePickerBody(
    {
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
    }: DatePickerBodyProps,
    ref: React.ForwardedRef<HTMLDivElement>,
) {
    const _ref = useRef<HTMLDivElement>(null);
    const monthsShort = useRef(dayjs.monthsShort()).current;
    const [startDate, setStartDate] = useState<Dayjs | undefined>(initStartDate);
    const [endDate, setEndDate] = useState<Dayjs | undefined>(initEndDate);
    const yearNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[0].split('년')[0], [currentDate]);
    const monthNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[1].split('월')[0], [currentDate]);

    useImperativeHandle(ref, () => _ref.current!);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-${dateType}`]: dateType || 'day',
                mobile: isMobile(navigator.userAgent),
            }),
        [dateType],
    );

    const handleDate = useCallback(
        (dates: DateValueType) => {
            if (onChangeDate) return onChangeDate(dates);
        },
        [onChangeDate],
    );

    const handleVisible = useCallback(
        (bool: boolean) => {
            if (setIsVisible) return setIsVisible(bool);
        },
        [setIsVisible],
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
                    handleDate(day);
                    const timeout = setTimeout(() => {
                        handleVisible(false);
                        clearTimeout(timeout);
                    }, 200);
                    return day;
                });
            } else {
                if (!!startDate && !!endDate) {
                    handleDate([day, undefined]);
                    setStartDate(day);
                    setEndDate(undefined);
                    return;
                }

                setStartDate((prevStart) => {
                    if (prevStart) {
                        if (day.isBefore(prevStart)) return day;
                        const isDisabledList = range(day.diff(prevStart, 'day') + 1, (i) => prevStart.add(i, 'day'));
                        const isReset = isDisabledList.findIndex((d) => disabledDate(d)) !== -1;
                        if (isReset) {
                            handleDate([day, undefined]);
                            setEndDate(undefined);
                            return day;
                        }
                        setEndDate(day);
                        handleDate([prevStart, day.endOf('date')]);
                        const timeout = setTimeout(() => {
                            handleVisible(false);
                            clearTimeout(timeout);
                        }, 200);
                        return prevStart;
                    }
                    handleDate([day, undefined]);
                    return day;
                });
            }
        },
        [currentDate, isOnlyOneDateSelect, setCurrentDate, handleDate, handleVisible, startDate, endDate, disabledDate],
    );

    const onClickMonth = useCallback(
        (day: Dayjs) => () => {
            if (isOnlyOneDateSelect) {
                setStartDate((prev) => {
                    if (prev?.isSame(day)) return prev;
                    setEndDate(day);
                    handleDate(day);
                    handleVisible(false);
                    return day;
                });
            }
        },
        [handleDate, handleVisible, isOnlyOneDateSelect],
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
                                        role="button"
                                        onKeyPress={() => {}}
                                        tabIndex={0}
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

export default React.memo(forwardRef(DatePickerBody));
