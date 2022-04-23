import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import ko from 'dayjs/locale/ko';
import localeData from 'dayjs/plugin/localeData';
import isBetween from 'dayjs/plugin/isBetween';
import { getPrefixName, isArray, range, DateEventValue, OutsideHandler } from '@field-share/utils';
import colors from '@field-share/styles';
// COMPONENTS
import Icons from '../Icons';
import PopBox from '../PopBox';
import DatePickerBody from './DatePickerBody';
import Button from '../Button';
// STYLES
import './styles.css';

export type DateRangeValue = [DateEventValue, DateEventValue];
export type DateValueType = DateEventValue | DateRangeValue;
export type DatePickerProps = {
    type?: 'button' | 'fixed' | 'input';
    dateType?: 'month' | 'day';
    value: DateValueType;
    /**
     * `dateType`이 "month"일 때는 해당 값이 `true` 일 경우에만 <br/> `onChangeDate` 작동
     */
    isOnlyOneDateSelect?: boolean;
    onChangeDate?(date: DateValueType): void;
    isShowToday?: boolean;
    disabledDate?: (date: Dayjs) => boolean;
    eventDate?: Dayjs[];
    inputTypeSize?: 'default' | 'large';
    /**
     * `type`이 "<strong>input</strong>"일 경우에만 사용<br/>
     * 전달된 토큰 문자열에 따라 형식이 지정된 날짜를 가져옵니다.
     */
    inputFormat?: string;
};

dayjs.locale(ko);
dayjs.extend(localeData);
dayjs.extend(isBetween);

const validateFormDate = (value: DateValueType, index?: 0 | 1) => {
    if (value) {
        if (isArray(value)) return value[index || 0] || dayjs().startOf('date');
        return value;
    }
    return undefined;
};

const dateFormattingToString = (date: Dayjs, index: number) =>
    `${date.format('YYYY-MM')}-${index + 1 < 10 ? `0${index + 1}` : index + 1}`;

export const prefixCls = getPrefixName('picker').class;

function DatePicker({
    type = 'button',
    dateType = 'day',
    value,
    isOnlyOneDateSelect = true,
    onChangeDate,
    isShowToday = true,
    eventDate,
    disabledDate = () => false,
    inputTypeSize = 'default',
    inputFormat = 'YYYY-MM-DD',
}: DatePickerProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState(() => validateFormDate(value) || dayjs());
    const [monthList, setMonthList] = useState<Dayjs[][] | undefined>();
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [openType, setOpenType] = useState<'right' | 'left'>('right');
    const [startDate, setStartDate] = useState<Dayjs | undefined>(() => validateFormDate(value, 0));
    const [endDate, setEndDate] = useState<Dayjs | undefined>(() => validateFormDate(value, 1));

    const onClickShowDatePicker = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!pickerRef.current) return;
            const targetRect = e.currentTarget.getBoundingClientRect();
            const x = targetRect?.x || 0;
            const y = targetRect?.y || 0;
            const width = targetRect?.width || 0;
            const pickerWidth = pickerRef.current.clientWidth;
            const clientX = document.documentElement.clientWidth;
            const isRightOver = clientX - x < pickerWidth;

            setIsVisible((prev) => {
                if (prev) return false;
                if (type === 'input') {
                    setPosition({ x, y: y + (inputTypeSize === 'default' ? 32 : 40) + 4 });
                } else if (isRightOver) {
                    setPosition({ x: x - 8 - pickerWidth, y });
                    setOpenType('left');
                } else {
                    setPosition({ x: x + width + 8, y });
                    setOpenType('right');
                }
                return true;
            });

            if (value) {
                setCurrentDate((prev) =>
                    prev.isSame(dayjs(isArray(value) ? value[0] : value).startOf('date'))
                        ? prev
                        : dayjs(isArray(value) ? value[0] : value).startOf('date'),
                );
            } else {
                setCurrentDate((prev) => (prev.isSame(dayjs().startOf('date')) ? prev : dayjs().startOf('date')));
            }
        },
        [inputTypeSize, type, value],
    );

    const handleNextOrPrevDate = useCallback(
        (day: Dayjs) => {
            // prev
            if (currentDate.startOf('month').isAfter(day.startOf('month'))) {
                setCurrentDate((prev) => {
                    const prevMonth = prev.startOf('month').subtract(1, 'month');
                    return prevMonth;
                });
                return;
            }
            // next
            if (currentDate.startOf('month').isBefore(day.startOf('month'))) {
                setCurrentDate((prev) => {
                    const nextMonth = prev.startOf('month').add(1, 'month');
                    return nextMonth;
                });
            }
        },
        [currentDate],
    );

    const onClickDay = useCallback(
        (day: Dayjs) => () => {
            handleNextOrPrevDate(day);

            if (isOnlyOneDateSelect) {
                onChangeDate && onChangeDate(day);
                setStartDate((prev) => {
                    if (prev?.isSame(day)) return prev;
                    setEndDate(day);
                    const timeout = setTimeout(() => {
                        setIsVisible(false);
                        clearTimeout(timeout);
                    }, 200);
                    return day;
                });
            } else {
                if (!!startDate && !!endDate) {
                    onChangeDate && onChangeDate([day, undefined]);
                    setStartDate(day);
                    setEndDate(undefined);
                    return;
                }

                let isReset = false;
                setStartDate((prevStart) => {
                    if (prevStart) {
                        if (day.isBefore(prevStart)) return day;
                        const isDisabledList = range(day.diff(prevStart, 'day') + 1, (i) => prevStart.add(i, 'day'));
                        isReset = isDisabledList.findIndex((d) => disabledDate(d)) !== -1;
                        if (isReset) {
                            setEndDate(undefined);
                            return day;
                        }
                        setEndDate(day);
                        const timeout = setTimeout(() => {
                            setIsVisible(false);
                            clearTimeout(timeout);
                        }, 200);
                        return prevStart;
                    }
                    return day;
                });

                if (isReset) {
                    onChangeDate && onChangeDate([day, undefined]);
                } else {
                    onChangeDate && onChangeDate([startDate, day.endOf('date')]);
                }
            }
        },
        [handleNextOrPrevDate, isOnlyOneDateSelect, onChangeDate, startDate, endDate, disabledDate],
    );

    const onClickMonth = useCallback(
        (day: Dayjs) => () => {
            if (isOnlyOneDateSelect) {
                setStartDate((prev) => {
                    if (prev?.isSame(day)) return prev;
                    setEndDate(day);
                    onChangeDate && onChangeDate(day);
                    const timeout = setTimeout(() => {
                        setIsVisible(false);
                        clearTimeout(timeout);
                    }, 200);
                    return day;
                });
            }
        },
        [isOnlyOneDateSelect, onChangeDate],
    );

    const onCancel = useCallback<OutsideHandler>((e) => {
        const btn = e.target as HTMLButtonElement;
        if (btn.isSameNode(ref.current)) return;
        setIsVisible((prev) => {
            if (!prev) return prev;
            return false;
        });
    }, []);

    useEffect(() => {
        if (!isOnlyOneDateSelect && type === 'input') {
            console.error('Error: type이 "input" 경우  isOnlyOneDateSelect 는 "true" 이어야 합니다.');
        }
    }, [isOnlyOneDateSelect, type]);

    useEffect(() => {
        console.time('달 계산');
        const firstDay = currentDate.startOf('month').day();
        const endDay = currentDate.endOf('month').day();
        const startWeekIndex = 7 - (7 - firstDay);
        const endWeekIndex = 7 - endDay - 1;
        const prevMonth = currentDate.startOf('month').subtract(1, 'month');
        const nextMonth = currentDate.startOf('month').add(1, 'month');

        const prevMonthList = range(prevMonth.daysInMonth(), (i) =>
            prevMonth.add(prevMonth.daysInMonth() - (i + 1), 'days'),
        );
        const nextMonthList = range(nextMonth.daysInMonth(), (i) => nextMonth.add(i, 'days'));

        const daysInMonthList = [
            // 이전 달
            ...range(startWeekIndex, (i) => prevMonthList[i]).reverse(),
            // 이번 달
            ...range(currentDate.daysInMonth(), (i) => dayjs(dateFormattingToString(currentDate, i))),
            // 다음 달
            ...range(endWeekIndex, (i) => nextMonthList[i]),
        ];

        const weeksLength = Math.floor(daysInMonthList.length / 7);
        const weeksMapping = (i: number) => range(7, (j) => daysInMonthList[i * 7 + j]);
        setMonthList(range(weeksLength, weeksMapping));
        console.timeEnd('달 계산');
    }, [currentDate]);

    if (type === 'input' && !isOnlyOneDateSelect) return null;
    if (type === 'input') {
        return (
            <>
                <Button
                    ref={ref}
                    className={[`${prefixCls}-input`, inputTypeSize === 'default' ? '' : inputTypeSize].join(' ')}
                    shape="round"
                    onClick={onClickShowDatePicker}
                >
                    <span className="text" data-placeholder={!(value && !isArray(value))}>
                        {value && !isArray(value) ? value?.format(inputFormat) : '날짜선택'}
                    </span>
                    <Icons icon="calendar" color={colors.grey[300]} />
                </Button>
                <PopBox isVisible={isVisible} onCancel={onCancel} top={position.y} left={position.x} openType="bottom">
                    <DatePickerBody
                        ref={pickerRef}
                        dateType={dateType}
                        monthList={monthList}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        disabledDate={disabledDate}
                        eventDate={eventDate}
                        isShowToday={isShowToday}
                        startDate={startDate}
                        endDate={endDate}
                        onClickDate={dateType === 'day' ? onClickDay : onClickMonth}
                    />
                </PopBox>
            </>
        );
    }

    if (type === 'button') {
        return (
            <>
                <Button
                    ref={ref}
                    className={`${prefixCls}-btn`}
                    size="small"
                    shape="round"
                    onClick={onClickShowDatePicker}
                >
                    <Icons icon="calendar" color={colors.grey[500]} />
                </Button>
                <PopBox
                    isVisible={isVisible}
                    onCancel={onCancel}
                    top={position.y}
                    left={position.x}
                    openType={openType}
                >
                    <DatePickerBody
                        ref={pickerRef}
                        dateType={dateType}
                        monthList={monthList}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        disabledDate={disabledDate}
                        eventDate={eventDate}
                        isShowToday={isShowToday}
                        startDate={startDate}
                        endDate={endDate}
                        onClickDate={dateType === 'day' ? onClickDay : onClickMonth}
                    />
                </PopBox>
            </>
        );
    }

    return (
        <DatePickerBody
            dateType={dateType}
            monthList={monthList}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            disabledDate={disabledDate}
            eventDate={eventDate}
            isShowToday={isShowToday}
            startDate={startDate}
            endDate={endDate}
            onClickDate={dateType === 'day' ? onClickDay : onClickMonth}
        />
    );
}

export default DatePicker;
