import React, { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { getPrefixName, OutsideHandler, map } from '@field-share/utils';
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

type TimePickerProps = {
    value: TimePickerValueType | undefined;
    size?: 'default' | 'large';
    hourList?: TimeType[];
    minuteList?: TimeType[];
    onChange?(value: TimePickerValueType): void;
};

const prefixCls = getPrefixName('time-picker').class;
const hourBtnCls = '.hour-btn';
const minuteBtnCls = '.minute-btn';

const getTimeValue = (i: number, range?: number): TimeType => {
    let doubleDigits = `${i < 10 ? `0${i}` : i}`;
    if (range) {
        doubleDigits = `${i * range < 10 ? `0${i * range}` : i * range}`;
    }
    return `${Number(doubleDigits[0])}${Number(doubleDigits[1])}`;
};
const buttonDisalbed = (bool: boolean) => (button: HTMLButtonElement) => {
    button.disabled = bool;
};

function TimePicker({ value, size, hourList, minuteList, onChange }: TimePickerProps) {
    const ref = useRef<HTMLButtonElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);

    const [isVisible, setIsVisible] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [hour, setHour] = useState<TimeType | undefined>();
    const [minute, setMinute] = useState<TimeType | undefined>();
    const [isReset, setIsReset] = useState(false);
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
            e.preventDefault();
            const targetRect = e.currentTarget.getBoundingClientRect();
            const x = targetRect?.x || 0;
            const y = targetRect?.y || 0;

            setIsVisible((prev) => {
                if (prev) return false;
                setPosition({ x, y: y + (size === 'default' ? 32 : 40) + 4 });
                const timeout = setTimeout(() => {
                    const hourButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(hourBtnCls));
                    const findSelectButtonIdx = hourButtons.findIndex((v) => v.className.includes('select'));

                    if (findSelectButtonIdx !== -1) {
                        hourButtons[findSelectButtonIdx].focus();
                    } else {
                        hourButtons[0].focus();
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
            const hourButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(hourBtnCls));
            const minuteButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(minuteBtnCls));
            if (type === 'h') {
                minuteButtons.forEach((button) => button.classList.remove('select'));
                hourButtons.forEach((button) => button.classList.remove('select'));
                setMinute(undefined);
                setHour(t);
            } else {
                minuteButtons.forEach((button) => button.classList.remove('select'));
                setHour((h) => {
                    setMinute(() => {
                        if (h && t) {
                            setTime(`${h}:${t}`);
                            setIsVisible(false);
                        }
                        return t;
                    });
                    if (!h) hourButtons.forEach((button) => button.classList.remove('select'));
                    return h;
                });
            }

            const bnt = e.target as HTMLButtonElement;
            bnt.classList.add('select');
        },
        [],
    );

    useEffect(() => {
        if (typeof document === 'undefined') return;
        let hourIdx: number = 0;
        let minuteIdx: number = 0;
        let initHourValue: TimeType | undefined = hour;
        const hourButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(hourBtnCls));
        const hourTotal = hourButtons.length;
        const minuteButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(minuteBtnCls));
        const minuteTotal = minuteButtons.length;

        function hourKeyevent(e: KeyboardEvent): void {
            if (!isVisible) return;
            e.preventDefault();
            const { key } = e;
            const target = e.target as HTMLButtonElement;
            hourIdx = hourButtons.indexOf(target);
            const text = hourButtons[hourIdx].innerText as TimeType;

            switch (key) {
                case 'Enter':
                    console.log('hour Enter');
                    minuteButtons.forEach((button) => button.classList.remove('select'));
                    hourButtons.forEach((button) => button.classList.remove('select'));
                    hourButtons[hourIdx].classList.add('select');
                    // eslint-disable-next-line no-case-declarations
                    initHourValue = text;
                    setHour(text);
                    setMinute(undefined);
                    return;
                case 'ArrowUp':
                    if (hourIdx === 0) {
                        hourButtons[hourTotal - 1].focus();
                        return;
                    }
                    hourButtons[hourIdx - 1].focus();
                    return;
                case 'ArrowDown':
                    if (hourIdx === hourTotal - 1) {
                        hourButtons[0].focus();
                        return;
                    }
                    hourButtons[hourIdx + 1].focus();
                    return;
                case 'ArrowRight':
                    minuteButtons[minuteIdx].focus();
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
                    minuteButtons.forEach((button) => button.classList.remove('select'));
                    minuteButtons[minuteIdx].classList.add('select');
                    // eslint-disable-next-line no-case-declarations
                    const text = minuteButtons[minuteIdx].innerText as TimeType;
                    setMinute(text);
                    if (initHourValue) {
                        setIsVisible(false);
                        setTime(`${initHourValue}:${text}`);
                    } else {
                        hourButtons.forEach((button) => button.classList.remove('select'));
                        setHour(undefined);
                    }
                    return;
                case 'ArrowUp':
                    if (minuteIdx === 0) {
                        minuteButtons[minuteTotal - 1].focus();
                        return;
                    }
                    minuteButtons[minuteIdx - 1].focus();
                    return;
                case 'ArrowDown':
                    if (minuteIdx === minuteTotal - 1) {
                        minuteButtons[0].focus();
                        return;
                    }
                    minuteButtons[minuteIdx + 1].focus();
                    return;
                case 'ArrowLeft':
                    hourButtons[hourIdx].focus();
                    return;
                default:
                    return undefined;
            }
        }

        hourButtons.forEach((button) => {
            button.addEventListener('keydown', hourKeyevent);
        });
        minuteButtons.forEach((button) => {
            button.addEventListener('keydown', minuteKeyevent);
        });
        return () => {
            hourButtons.forEach((button) => {
                button.removeEventListener('keydown', hourKeyevent);
            });
            minuteButtons.forEach((button) => {
                button.removeEventListener('keydown', minuteKeyevent);
            });
        };
    }, [hour, isVisible]);

    useEffect(() => {
        const hourButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(hourBtnCls));
        const minuteButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(minuteBtnCls));
        if (!isVisible) {
            hourButtons.forEach((button) => button.classList.remove('select'));
            minuteButtons.forEach((button) => button.classList.remove('select'));
            setHour(undefined);
            setMinute(undefined);
        } else if (value) {
            const h = value.split(':')[0];
            const m = value.split(':')[1];
            hourButtons.forEach((button) => button.innerText === h && button.classList.add('select'));
            minuteButtons.forEach((button) => button.innerText === m && button.classList.add('select'));
            console.log({ hourButtons });
        }
    }, [isVisible, value]);

    useEffect(() => {
        if (time && onChange) {
            console.log({ time });
            onChange(time);
            setIsReset(true);
            setHour(undefined);
            setMinute(undefined);
        }
    }, [time]);

    return (
        <>
            <Button ref={ref} className={className} shape="round" onClick={onClickTimePicker}>
                <span ref={textRef} className="text" data-placeholder={!value && !hour}>
                    {hour ? `${hour}:${minute || '00'}` : value || '시간선택'}
                </span>
                <Icons icon="time" color={colors.grey[300]} />
            </Button>
            <PopBox isVisible={isVisible} onCancel={onCancel} top={position.y} left={position.x} openType="bottom">
                <div ref={pickerRef} className={`${prefixCls}-body`}>
                    <div className="col">
                        {hourList
                            ? hourList.map((v) => (
                                  <button
                                      key={v.toString()}
                                      type="button"
                                      className="hour-btn"
                                      onClick={onClickTime('h', v)}
                                  >
                                      {v}
                                  </button>
                              ))
                            : map(24, (i) => (
                                  <button
                                      key={i.toString()}
                                      type="button"
                                      className="hour-btn"
                                      onClick={onClickTime('h', getTimeValue(i))}
                                  >
                                      {getTimeValue(i)}
                                  </button>
                              ))}
                    </div>
                    <div className="col">
                        {minuteList
                            ? minuteList.map((v) => (
                                  <button
                                      key={v.toString()}
                                      type="button"
                                      className="minute-btn"
                                      onClick={onClickTime('m', v)}
                                  >
                                      {v}
                                  </button>
                              ))
                            : map(6, (i) => (
                                  <button
                                      key={i.toString()}
                                      type="button"
                                      className="minute-btn"
                                      onClick={onClickTime('m', getTimeValue(i, 10))}
                                  >
                                      {getTimeValue(i, 10)}
                                  </button>
                              ))}
                    </div>
                </div>
            </PopBox>
        </>
    );
}

export default TimePicker;
