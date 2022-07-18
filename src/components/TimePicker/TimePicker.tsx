import React, { useEffect, useCallback, useMemo, useRef, useState, createRef, useImperativeHandle } from 'react';
import classNames from 'classnames';
import Button from '../Button';
import PopBox from '../PopBox';
import Icons from '../Icons';
import { getPrefixName } from '../../lib';
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
    const hourColRef = useRef<HTMLDivElement>(null);
    const minuteColRef = useRef<HTMLDivElement>(null);
    const ref = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const [minuteButtonRefs, setMinuteButtonRefs] = useState<React.RefObject<HTMLButtonElement>[]>([]);
    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hour, setHour] = useState<TimeType | undefined>();
    const [minute, setMinute] = useState<TimeType | undefined>();
    // const [isReset, setIsReset] = useState(false);
    const [time, setTime] = useState<TimePickerValueType | undefined>();

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
            if (!hourColRef.current) return;
            e.preventDefault();
            const hourButtons = Array.from(hourColRef.current.childNodes) as HTMLButtonElement[];
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
        [size],
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
            if (!hourColRef.current || !minuteColRef.current) return;
            const hourButtons = Array.from(hourColRef.current.childNodes) as HTMLButtonElement[];
            const minuteButtons = Array.from(minuteColRef.current.childNodes) as HTMLButtonElement[];
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
        [],
    );

    useEffect(() => {
        // setHourButtonRefs((prev) => range(hourList.length, (i) => prev[i] || createRef<HTMLButtonElement>()));
        setMinuteButtonRefs((prev) => range(minuteList.length, (i) => prev[i] || createRef<HTMLButtonElement>()));
    }, [hourList.length, minuteList.length]);

    useEffect(() => {
        if (typeof document === 'undefined') return;
        if (!isVisible) return;
        if (!hourColRef.current || !minuteColRef.current) return;
        const hourButtons = Array.from(hourColRef.current.childNodes) as HTMLButtonElement[];
        const minuteButtons = Array.from(minuteColRef.current.childNodes) as HTMLButtonElement[];
        const hourTotal = hourButtons.length;
        const minuteTotal = minuteButtons.length;
        let hourIdx: number = 0;
        let minuteIdx: number = 0;
        let initHourValue: TimeType | undefined = hour;

        function hourKeyevent(e: KeyboardEvent): void {
            e.preventDefault();
            const { key } = e;
            const target = e.target as HTMLButtonElement;
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
    }, [hour, isVisible]);

    useEffect(() => {
        if (!hourColRef.current || !minuteColRef.current) return;
        const hourButtons = Array.from(hourColRef.current.childNodes) as HTMLButtonElement[];
        const minuteButtons = Array.from(minuteColRef.current.childNodes) as HTMLButtonElement[];

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
    }, [isVisible, value]);

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
                    <div ref={hourColRef} className="col">
                        {hourList.map((v, i) => (
                            <button key={v.toString()} type="button" onClick={onClickTime('h', v)}>
                                {v}
                            </button>
                        ))}
                    </div>
                    <div ref={minuteColRef} className="col">
                        {minuteList.map((v, i) => (
                            <button key={v.toString()} type="button" onClick={onClickTime('m', v)}>
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
