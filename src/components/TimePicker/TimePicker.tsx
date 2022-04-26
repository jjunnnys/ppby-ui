import React, { useEffect, useCallback, useMemo, useRef, useState, createRef } from 'react';
import classNames from 'classnames';
import { getPrefixName, OutsideHandler, range } from '@field-share/utils';
import colors from '@field-share/styles';
// COMPONENTS
import Button from '../Button';
import PopBox from '../PopBox';
import Icons from '../Icons';
// HOOKS
// MODULES
// LIB
// TYPES
// STYLES
import './styles.css';

type TimeType = `${number}${number}`;
export type TimePickerValueType = `${TimeType}:${TimeType}`;

export type TimePickerProps = {
    value: TimePickerValueType | undefined;
    size?: 'default' | 'large';
    hourList?: TimeType[];
    minuteList?: TimeType[];
    disabled?: boolean;
    onChange?(value: TimePickerValueType): void;
};

const prefixCls = getPrefixName('time-picker').class;

const getTimeValue = (i: number, rangeNumber?: number): TimeType => {
    let doubleDigits = `${i < 10 ? `0${i}` : i}`;
    if (rangeNumber) {
        doubleDigits = `${i * rangeNumber < 10 ? `0${i * rangeNumber}` : i * rangeNumber}`;
    }
    return `${Number(doubleDigits[0])}${Number(doubleDigits[1])}`;
};

const initHourList = range(26, (i) => getTimeValue(i));
const initMinuteList = range(6, (i) => getTimeValue(i, 10));

function TimePicker({
    value,
    size = 'default',
    hourList = initHourList,
    minuteList = initMinuteList,
    onChange,
    disabled,
}: TimePickerProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [hourButtonRefs, setHourButtonRefs] = useState<React.RefObject<HTMLButtonElement>[]>([]);
    const [minuteButtonRefs, setMinuteButtonRefs] = useState<React.RefObject<HTMLButtonElement>[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hour, setHour] = useState<TimeType | undefined>();
    const [minute, setMinute] = useState<TimeType | undefined>();
    // const [isReset, setIsReset] = useState(false);
    const [time, setTime] = useState<TimePickerValueType | undefined>();

    // const hourButtonRefs = useMemo(
    //     () => range(hourList?.length || 24, () => createRef<HTMLButtonElement>()),
    //     [hourList?.length],
    // );
    // const minuteButtonRefs = useMemo(
    //     () => range(minuteList?.length || 6, () => createRef<HTMLButtonElement>()),
    //     [minuteList?.length],
    // );
    const hourButtons = useMemo(() => hourButtonRefs.map((button) => button.current), [hourButtonRefs]);
    const minuteButtons = useMemo(() => minuteButtonRefs.map((button) => button.current), [minuteButtonRefs]);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [size || 'default']: size !== 'default',
            }),
        [size],
    );

    const onClickTimePicker = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (!pickerRef.current) return;
            e.preventDefault();
            const targetRect = e.currentTarget.getBoundingClientRect();
            const x = targetRect?.x || 0;
            const y = targetRect?.y || 0;

            setIsVisible((prev) => {
                if (prev) return false;
                setPosition({ x, y: y + (size === 'default' ? 32 : 40) + 4 });
                const timeout = setTimeout(() => {
                    const findSelectButtonIdx = hourButtons.findIndex((button) => button?.className.includes('select'));

                    if (findSelectButtonIdx !== -1) {
                        hourButtons[findSelectButtonIdx]?.focus();
                    } else {
                        hourButtons[0]?.focus();
                    }
                    clearTimeout(timeout);
                });
                return true;
            });
        },
        [hourButtons, size],
    );

    const onCancel = useCallback<OutsideHandler>((e) => {
        const btn = e.target as HTMLButtonElement;
        if (btn.isSameNode(ref.current)) return;
        setIsVisible((prev) => {
            if (!prev) return prev;
            return false;
        });
    }, []);

    const onClickTime = useCallback<(type: 'h' | 'm', t: TimeType) => React.MouseEventHandler<HTMLButtonElement>>(
        (type, t) => (e) => {
            if (type === 'h') {
                minuteButtons.forEach((button) => button?.classList.remove('select'));
                hourButtons.forEach((button) => button?.classList.remove('select'));
                setMinute(undefined);
                setHour(t);
            } else {
                minuteButtons.forEach((button) => button?.classList.remove('select'));
                setHour((h) => {
                    setMinute(() => {
                        if (h && t) {
                            setTime(`${h}:${t}`);
                            setIsVisible(false);
                        }
                        return t;
                    });
                    if (!h) hourButtons.forEach((button) => button?.classList.remove('select'));
                    return h;
                });
            }

            const bnt = e.target as HTMLButtonElement;
            bnt.classList.add('select');
        },
        [hourButtons, minuteButtons],
    );

    useEffect(() => {
        setHourButtonRefs((prev) => range(hourList.length, (i) => prev[i] || createRef<HTMLButtonElement>()));
    }, [hourList.length]);

    useEffect(() => {
        setMinuteButtonRefs((prev) => range(minuteList.length, (i) => prev[i] || createRef<HTMLButtonElement>()));
    }, [minuteList.length]);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (hourButtons[0] == null || minuteButtons[0] == null) return;
        let hourIdx: number = 0;
        let minuteIdx: number = 0;
        let initHourValue: TimeType | undefined = hour;
        const hourTotal = hourButtons.length;
        const minuteTotal = minuteButtons.length;

        function hourKeyevent(e: KeyboardEvent): void {
            if (!isVisible) return;
            e.preventDefault();
            const { key } = e;
            const target = e.target as HTMLButtonElement;
            console.log({ target });
            hourIdx = hourButtons.indexOf(target);
            const text = hourButtons[hourIdx]?.innerText as TimeType;

            switch (key) {
                case 'Enter':
                    console.log('hour Enter');
                    minuteButtons.forEach((button) => button?.classList.remove('select'));
                    hourButtons.forEach((button) => button?.classList.remove('select'));
                    hourButtons[hourIdx]?.classList.add('select');
                    // eslint-disable-next-line no-case-declarations
                    initHourValue = text;
                    setHour(text);
                    setMinute(undefined);
                    return;
                case 'ArrowUp':
                    if (hourIdx === 0) {
                        hourButtons[hourTotal - 1]?.focus();
                        return;
                    }
                    hourButtons[hourIdx - 1]?.focus();
                    return;
                case 'ArrowDown':
                    if (hourIdx === hourTotal - 1) {
                        hourButtons[0]?.focus();
                        return;
                    }
                    hourButtons[hourIdx + 1]?.focus();
                    return;
                case 'ArrowRight':
                    minuteButtons[minuteIdx]?.focus();
                    return;
                default:
                    return undefined;
            }
        }

        function minuteKeyevent(e: KeyboardEvent): void {
            if (!isVisible) return;
            e.preventDefault();
            const { key } = e;
            const target = e.target as HTMLButtonElement;
            minuteIdx = minuteButtons.indexOf(target);

            switch (key) {
                case 'Enter':
                    console.log('minute Enter');
                    minuteButtons.forEach((button) => button?.classList.remove('select'));
                    minuteButtons[minuteIdx]?.classList.add('select');
                    // eslint-disable-next-line no-case-declarations
                    const text = minuteButtons[minuteIdx]?.innerText as TimeType;
                    setMinute(text);
                    if (initHourValue) {
                        setIsVisible(false);
                        setTime(`${initHourValue}:${text}`);
                    } else {
                        hourButtons.forEach((button) => button?.classList.remove('select'));
                        setHour(undefined);
                    }
                    return;
                case 'ArrowUp':
                    if (minuteIdx === 0) {
                        minuteButtons[minuteTotal - 1]?.focus();
                        return;
                    }
                    minuteButtons[minuteIdx - 1]?.focus();
                    return;
                case 'ArrowDown':
                    if (minuteIdx === minuteTotal - 1) {
                        minuteButtons[0]?.focus();
                        return;
                    }
                    minuteButtons[minuteIdx + 1]?.focus();
                    return;
                case 'ArrowLeft':
                    hourButtons[hourIdx]?.focus();
                    return;
                default:
                    return undefined;
            }
        }

        hourButtons.forEach((button) => {
            button?.addEventListener('keydown', hourKeyevent);
        });
        minuteButtons.forEach((button) => {
            button?.addEventListener('keydown', minuteKeyevent);
        });
        return () => {
            hourButtons.forEach((button) => {
                button?.removeEventListener('keydown', hourKeyevent);
            });
            minuteButtons.forEach((button) => {
                button?.removeEventListener('keydown', minuteKeyevent);
            });
        };
    }, [hour, hourButtons, isVisible, minuteButtons]);

    useEffect(() => {
        if (!isVisible) {
            hourButtons.forEach((button) => button?.classList.remove('select'));
            minuteButtons.forEach((button) => button?.classList.remove('select'));
            setHour(undefined);
            setMinute(undefined);
        } else if (value) {
            const h = value.split(':')[0];
            const m = value.split(':')[1];
            hourButtons.forEach((button) => button?.innerText === h && button?.classList.add('select'));
            minuteButtons.forEach((button) => button?.innerText === m && button?.classList.add('select'));
        }
    }, [hourButtons, isVisible, minuteButtons, value]);

    useEffect(() => {
        if (time && onChange) {
            console.log({ time });
            onChange(time);
            // setIsReset(true);
            setHour(undefined);
            setMinute(undefined);
        }
    }, [time]);

    return (
        <>
            <Button ref={ref} className={className} onClick={onClickTimePicker} disabled={disabled}>
                <span ref={textRef} className="text" data-placeholder={!value && !hour}>
                    {hour ? `${hour}:${minute || '00'}` : value || '시간선택'}
                </span>
                <Icons icon="time" color={colors.grey[300]} />
            </Button>
            <PopBox isVisible={isVisible} onCancel={onCancel} top={position.y} left={position.x} openType="bottom">
                <div ref={pickerRef} className={`${prefixCls}-body`}>
                    <div className="col">
                        {hourList.map((v, i) => (
                            <button
                                ref={hourButtonRefs[i]}
                                key={v.toString()}
                                type="button"
                                className="hour-btn"
                                onClick={onClickTime('h', v)}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                    <div className="col">
                        {minuteList.map((v, i) => (
                            <button
                                ref={minuteButtonRefs[i]}
                                key={v.toString()}
                                type="button"
                                className="minute-btn"
                                onClick={onClickTime('m', v)}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </PopBox>
        </>
    );
}

export default TimePicker;
