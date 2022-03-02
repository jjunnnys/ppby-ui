/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { css } from '@emotion/react';
import dayjs, { Dayjs } from 'dayjs';
import ko from 'dayjs/locale/ko';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
// COMPONENTS
import Icons from '../Icons';
import NumberText from '../NumberText';
import FixedInfoBox from '../FixedInfo';
// HOOKS
// MODULES
// LIB
import colors from '../../utils/colors';
import { isToday, map } from '../../utils';
// TYPES
// STYLES

export type CalendarProps = {
    type?: 'button' | 'fixed';
    dateType?: 'month' | 'day';
    value: Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined;
    /**
     * dateType이 month일 때는 true 일 경우에만 onChangeDate 작동
     */
    isOnlyOneSelectDate?: boolean;
    onChangeDate(date: Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined): void;
    isShowToday?: boolean;
    disabledDate?: (date: Dayjs) => boolean;
    eventDate?: Dayjs[];
};

interface CalendarBodyProps extends Omit<CalendarProps, 'type' | 'value'> {
    monthList: Dayjs[][] | undefined;
    currentDate: Dayjs;
    initStartDate: Dayjs | undefined;
    initEndDate: Dayjs | undefined;
    setCurrentDate: React.Dispatch<React.SetStateAction<Dayjs>>;
    disabledDate: (date: Dayjs) => boolean;
    setIsVisible?: React.Dispatch<React.SetStateAction<boolean>>;
}

dayjs.locale(ko);
dayjs.extend(localeData);
dayjs.extend(isBetween);

const formatCurrentDate = (value: Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined) =>
    value ? (Array.isArray(value) ? value[0] || dayjs().startOf('date') : value) : dayjs().startOf('date');

const dateFormatMapping = (date: Dayjs, index: number) =>
    `${date.format('YYYY-MM')}-${index + 1 < 10 ? `0${index + 1}` : index + 1}`;

const CalendarBody = React.memo(
    ({
        dateType,
        monthList,
        currentDate,
        setCurrentDate,
        isOnlyOneSelectDate,
        eventDate,
        onChangeDate,
        isShowToday,
        disabledDate,
        initStartDate,
        initEndDate,
        setIsVisible,
    }: CalendarBodyProps) => {
        const [startDate, setStartDate] = useState<Dayjs | undefined>(initStartDate);
        const [endDate, setEndDate] = useState<Dayjs | undefined>(initEndDate);
        const yearNumber = useMemo(() => currentDate.format('YYYY년 MM월').split(' ')[0].split('년')[0], [currentDate]);
        const monthNumber = useMemo(
            () => currentDate.format('YYYY년 MM월').split(' ')[1].split('월')[0],
            [currentDate],
        );

        const isEventDate = useCallback(
            (day: Dayjs) => eventDate?.map((v) => v.toISOString()).includes(day.toISOString()) || false,
            [eventDate],
        );

        const onClickDate = useCallback(
            (day: Dayjs) => () => {
                if (dayjs(currentDate.startOf('month')).isAfter(day.startOf('month'))) {
                    console.log('이전');
                    setCurrentDate((prev) => {
                        const prevMonth = prev.startOf('month').subtract(1, 'month');
                        return prevMonth;
                    });
                } else if (dayjs(currentDate.startOf('month')).isBefore(day.startOf('month'))) {
                    console.log('이후');
                    setCurrentDate((prev) => {
                        const nextMonth = prev.startOf('month').add(1, 'month');
                        return nextMonth;
                    });
                }

                if (isOnlyOneSelectDate) {
                    setStartDate((prev) => {
                        if (prev?.isSame(day)) return prev;
                        setEndDate(day);
                        onChangeDate(day);
                        setIsVisible && setIsVisible(false);
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
                            setIsVisible && setIsVisible(false);
                            return prevStart;
                        }
                        onChangeDate([day, undefined]);
                        return day;
                    });
                }
            },
            [currentDate, endDate, startDate, isOnlyOneSelectDate],
        );

        const onClickMonth = useCallback(
            (day: Dayjs) => () => {
                if (isOnlyOneSelectDate) {
                    setStartDate((prev) => {
                        if (prev?.isSame(day)) return prev;
                        setEndDate(day);
                        onChangeDate(day);
                        setIsVisible && setIsVisible(false);
                        return day;
                    });
                }
            },
            [isOnlyOneSelectDate],
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
            [],
        );

        useEffect(() => {
            if (!initStartDate) setStartDate(undefined);
            if (!initEndDate) setEndDate(undefined);
        }, [initStartDate, initEndDate]);

        return (
            <div css={container} role="presentation" aria-label="날짜 선택 캘린더" data-date-type={dateType || 'day'}>
                <div className="date-picker-header">
                    <button type="button" onClick={onClickArrow('left')}>
                        <Icons icon="leftArrow" fill={colors.grey[300]} />
                    </button>
                    <div className="year-month-wrapper">
                        <span>
                            <NumberText fontSize={14} lineHeight={22} number={yearNumber} />년
                        </span>
                        {dateType === 'day' && (
                            <span>
                                <NumberText fontSize={14} lineHeight={22} number={monthNumber} />월
                            </span>
                        )}
                    </div>
                    <button type="button" onClick={onClickArrow('right')}>
                        <Icons icon="rightArrow" fill={colors.grey[300]} />
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
                                <tr key={i}>
                                    {weeks.map((day) => (
                                        <td
                                            css={dateCell}
                                            key={day.format('YYYY-MM-DD')}
                                            data-today={isShowToday ? isToday(day) : false}
                                            data-start-date-finish={!!endDate && day.isSame(startDate)}
                                            data-start-date={day.isSame(startDate)}
                                            data-end-date={day.isSame(endDate)}
                                            data-select={
                                                startDate && endDate ? day.isBetween(startDate, endDate) : false
                                            }
                                            data-same-date={startDate?.isSame(endDate)}
                                            data-disabled={disabledDate(day)}
                                            className={
                                                (i === 0 && day.get('date') > 10) ||
                                                (i === monthList.length - 1 && day.get('date') < 10)
                                                    ? 'prev-or-next-date'
                                                    : undefined
                                            }
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
                        {dayjs.monthsShort().map((v, i) => (
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
    },
);

function Calendar({
    type = 'button',
    dateType = 'day',
    value,
    isOnlyOneSelectDate = true,
    onChangeDate,
    isShowToday = true,
    eventDate,
    disabledDate = () => false,
}: CalendarProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState(formatCurrentDate(value));
    const [monthList, setMonthList] = useState<Dayjs[][] | undefined>();
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const initStartDate = useMemo(
        () => (value ? (Array.isArray(value) ? value[0]?.startOf('date') : value) : undefined),
        [value],
    );

    const initEndDate = useMemo(
        () => (value ? (Array.isArray(value) ? value[1]?.startOf('date') : value) : undefined),
        [value],
    );

    const onClickShowCalendar = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const x = e.currentTarget.getClientRects().item(0)?.x || 0;
        const y = e.currentTarget.getClientRects().item(0)?.y || 0;
        const width = e.currentTarget.getClientRects().item(0)?.width || 0;
        setIsVisible((prev) => {
            if (prev) return false;
            setPosition({ x: x + width + 8, y });
            return true;
        });
        if (value) {
            setCurrentDate((prev) =>
                prev.isSame(dayjs(Array.isArray(value) ? value[0] : value).startOf('date'))
                    ? prev
                    : dayjs(Array.isArray(value) ? value[0] : value).startOf('date'),
            );
        } else {
            setCurrentDate((prev) => (prev.isSame(dayjs().startOf('date')) ? prev : dayjs().startOf('date')));
        }
    }, []);

    const onCancel = useCallback(() => {
        setIsVisible((prev) => {
            if (!prev) return prev;
            return false;
        });
    }, []);

    useEffect(() => {
        if (!value) setCurrentDate(dayjs().startOf('date'));
    }, [value]);

    useEffect(() => {
        console.time('달 계산');
        const firstDay = currentDate.startOf('month').day();
        const endDay = currentDate.endOf('month').day();
        const startWeekIndex = 7 - (7 - firstDay);
        const endWeekIndex = 7 - endDay - 1;
        const prevMonth = currentDate.startOf('month').subtract(1, 'month');
        const nextMonth = currentDate.startOf('month').add(1, 'month');

        const prevMonthList = map(prevMonth.daysInMonth(), (i) =>
            prevMonth.add(prevMonth.daysInMonth() - (i + 1), 'days'),
        );
        const nextMonthList = map(nextMonth.daysInMonth(), (i) => nextMonth.add(i, 'days'));

        const daysInMonthList = [
            ...map(startWeekIndex, (i) => prevMonthList[i]).reverse(), // 이전 달
            ...map(currentDate.daysInMonth(), (i) => dayjs(dateFormatMapping(currentDate, i))), // 요번 달
            ...map(endWeekIndex, (i) => nextMonthList[i]), // 다음 달
        ];

        console.log({
            a: map(startWeekIndex, (i) => prevMonthList[i]).reverse(),
            b: map(currentDate.daysInMonth(), (i) => dayjs(dateFormatMapping(currentDate, i))),
            c: map(endWeekIndex, (i) => nextMonthList[i]),
        });
        const weeksLength = Math.floor(daysInMonthList.length / 7);
        const weeksMapping = (i: number) => map(7, (j) => daysInMonthList[i * 7 + j]);
        setMonthList(map(weeksLength, weeksMapping));
        console.timeEnd('달 계산');
    }, [currentDate]);

    if (type === 'button') {
        return (
            <div ref={ref} css={button}>
                <button type="button" aria-label="calendar" onClick={onClickShowCalendar}>
                    <Icons icon="calendar" />
                </button>
                <FixedInfoBox
                    buttonRef={ref}
                    isVisible={isVisible}
                    onCancel={onCancel}
                    top={position.y}
                    left={position.x}
                >
                    <CalendarBody
                        dateType={dateType}
                        monthList={monthList}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        onChangeDate={onChangeDate}
                        initStartDate={initStartDate}
                        initEndDate={initEndDate}
                        disabledDate={disabledDate}
                        eventDate={eventDate}
                        isOnlyOneSelectDate={isOnlyOneSelectDate}
                        isShowToday={isShowToday}
                        setIsVisible={setIsVisible}
                    />
                </FixedInfoBox>
            </div>
        );
    }

    return (
        <CalendarBody
            dateType={dateType}
            monthList={monthList}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onChangeDate={onChangeDate}
            initStartDate={initStartDate}
            initEndDate={initEndDate}
            disabledDate={disabledDate}
            eventDate={eventDate}
            isOnlyOneSelectDate={isOnlyOneSelectDate}
            isShowToday={isShowToday}
        />
    );
}

const absoluteFill = css`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
`;

const container = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 284px;
    padding: 16px;
    background: ${colors.grey[50]};
    border: 1px solid ${colors.grey[150]};
    border-radius: 4px;

    &[data-date-type='day'] {
        min-height: 280px;
    }
    &[data-date-type='month'] {
        min-height: 240px;
    }

    .date-picker-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;

        > button {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: inherit;

            > svg {
                transition: fill 0.2s;
            }
            &:hover {
                > svg {
                    fill: ${colors.grey[400]};
                }
            }
            &:active {
                > svg {
                    fill: ${colors.grey[500]};
                }
            }
        }

        .year-month-wrapper {
            display: flex;
            align-items: center;
            column-gap: 5px;

            > span {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                line-height: 22px;
                color: ${colors.grey[700]};
            }
        }
    }

    #wds-date-picker-day {
        width: 100%;
        height: 100%;
        margin-top: 6px;

        thead > tr {
            display: flex;
            justify-content: space-between;
            align-items: center;

            th {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 36px;
                height: 36px;

                font-weight: 500;
                font-size: 10px;
                line-height: 12px;
                text-align: center;
                letter-spacing: 0.03em;
                color: ${colors.grey[700]};
            }
        }

        tbody {
            display: flex;
            flex-direction: column;
            align-items: center;

            > tr {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
        }
    }

    #wds-date-picker-month {
        flex: 1;
        display: grid;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-columns: repeat(4, 1fr);
        width: 100%;
        height: 100%;

        .month-cell {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0;

            font-size: 14px;
            line-height: 22px;
            text-align: center;
            color: ${colors.grey[700]};
        }
    }
`;

const dateCell = css`
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 36px;
    height: 36px;

    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: ${colors.grey[800]};

    cursor: pointer;

    > span {
        position: relative;
        width: 17px;
        z-index: 2;

        &[data-event='true'] {
            color: ${colors.grey[300]};
        }
    }

    &::before,
    &::after {
        content: '';
        ${absoluteFill}
    }

    &.prev-or-next-date {
        color: ${colors.grey[500]};
    }

    &[data-today='true'][data-select='false'][data-start-date='false'][data-end-date='false'] {
        &::after {
            width: 30px;
            height: 30px;
            margin: auto;
            border: 1px solid ${colors.primary[500]};
            border-radius: 50%;
        }
    }

    &[data-start-date='true'] {
        color: #fff;
        &::after {
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin: auto;
            background-color: ${colors.primary[500]};
            z-index: 1;
        }
    }

    &[data-start-date-finish='true'][data-same-date='false']::before {
        width: 50%;
        height: 30px;
        margin: auto 0;
        margin-left: auto;
        background-color: ${colors.primary[400]};
    }

    &[data-end-date='true'] {
        color: #fff;
        &::after {
            border-radius: 50%;
            width: 30px;
            height: 30px;
            margin: auto;
            background-color: ${colors.primary[500]};
            z-index: 1;
        }
        &[data-same-date='false'] {
            &::before {
                width: 50%;
                height: 30px;
                margin: auto 0;
                margin-right: auto;
                background-color: ${colors.primary[400]};
            }
        }
    }

    &[data-select='true'] {
        color: #fff;
        &::after {
            width: 100%;
            height: 30px;
            margin: auto 0;
            margin-left: auto;
            background-color: ${colors.primary[400]};
        }
    }

    &[data-disabled='true'] {
        cursor: not-allowed;
        color: ${colors.grey[300]};
    }

    &[data-disabled='false']:hover {
        &[data-select='false'][data-end-date='false'][data-start-date='false'] {
            color: ${colors.grey[500]};
            &.prev-or-next-date {
                color: ${colors.grey[400]};
            }
        }
    }
`;

const button = css`
    position: relative;

    > button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 32px;
        height: 32px;
        border: 1px solid ${colors.grey[200]};
        border-radius: 4px;
        color: ${colors.grey[700]};
    }

    > span {
        position: absolute;
        top: 0px;
        left: 40px;
        transition: all 0.2s;
        transform-origin: -16px 8px;

        > div {
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
            border: none;
        }

        &[data-open='false'] {
            visibility: hidden;
            transform: scale(0);
            opacity: 0;
        }
        &[data-open='true'] {
            visibility: visible;
            transform: scale(1);
            opacity: 1;
        }
    }
`;

export default Calendar;
