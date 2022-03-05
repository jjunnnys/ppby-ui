import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ko from 'dayjs/locale/ko';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import { map } from '@field-share/utils';
// COMPONENTS
import Icons from '../Icons';
import PopBox from '../PopBox';
import DatePickerBody from './DatePickerBody';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

export type DatePickerProps = {
    type?: 'button' | 'fixed';
    dateType?: 'month' | 'day';
    value: Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined;
    /**
     * dateType이 month일 때는 true 일 경우에만 onChangeDate 작동
     */
    isOnlyOneDateSelect?: boolean;
    onChangeDate(date: Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined): void;
    isShowToday?: boolean;
    disabledDate?: (date: Dayjs) => boolean;
    eventDate?: Dayjs[];
};

dayjs.locale(ko);
dayjs.extend(localeData);
dayjs.extend(isBetween);

const formatCurrentDate = (value: Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined) =>
    value ? (Array.isArray(value) ? value[0] || dayjs().startOf('date') : value) : dayjs().startOf('date');

const dateFormatMapping = (date: Dayjs, index: number) =>
    `${date.format('YYYY-MM')}-${index + 1 < 10 ? `0${index + 1}` : index + 1}`;

function DatePicker({
    type = 'button',
    dateType = 'day',
    value,
    isOnlyOneDateSelect = true,
    onChangeDate,
    isShowToday = true,
    eventDate,
    disabledDate = () => false,
}: DatePickerProps) {
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

    const onClickShowDatePicker = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            const x = e.currentTarget.getBoundingClientRect()?.x || 0;
            const y = e.currentTarget.getBoundingClientRect()?.y || 0;
            const width = e.currentTarget.getBoundingClientRect()?.width || 0;

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
        },
        [value],
    );

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
            // 이전 달
            ...map(startWeekIndex, (i) => prevMonthList[i]).reverse(),
            // 이번 달
            ...map(currentDate.daysInMonth(), (i) => dayjs(dateFormatMapping(currentDate, i))),
            // 다음 달
            ...map(endWeekIndex, (i) => nextMonthList[i]),
        ];

        // console.log({
        //     a: map(startWeekIndex, (i) => prevMonthList[i]).reverse(),
        //     b: map(currentDate.daysInMonth(), (i) => dayjs(dateFormatMapping(currentDate, i))),
        //     c: map(endWeekIndex, (i) => nextMonthList[i]),
        // });
        const weeksLength = Math.floor(daysInMonthList.length / 7);
        const weeksMapping = (i: number) => map(7, (j) => daysInMonthList[i * 7 + j]);
        setMonthList(map(weeksLength, weeksMapping));
        console.timeEnd('달 계산');
    }, [currentDate]);

    return type === 'button' ? (
        <>
            <div ref={ref} className="wds-date-picker-button-container">
                <button type="button" aria-label="calendar" onClick={onClickShowDatePicker}>
                    <Icons icon="calendar" />
                </button>
            </div>
            <PopBox buttonRef={ref} isVisible={isVisible} onCancel={onCancel} top={position.y} left={position.x}>
                <DatePickerBody
                    dateType={dateType}
                    monthList={monthList}
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    onChangeDate={onChangeDate}
                    initStartDate={initStartDate}
                    initEndDate={initEndDate}
                    disabledDate={disabledDate}
                    eventDate={eventDate}
                    isOnlyOneDateSelect={isOnlyOneDateSelect}
                    isShowToday={isShowToday}
                    setIsVisible={setIsVisible}
                />
            </PopBox>
        </>
    ) : (
        <DatePickerBody
            dateType={dateType}
            monthList={monthList}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            onChangeDate={onChangeDate}
            initStartDate={initStartDate}
            initEndDate={initEndDate}
            disabledDate={disabledDate}
            eventDate={eventDate}
            isOnlyOneDateSelect={isOnlyOneDateSelect}
            isShowToday={isShowToday}
        />
    );
}

export default DatePicker;
