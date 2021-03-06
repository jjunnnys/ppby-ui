import React, { useMemo, useEffect, useState, useRef } from 'react';
import classNames from 'classnames';
import { getPrefixName, tuple } from '../../lib';
import './styles.css';

export type RightLeftHeaderProps = {
    number: string | number;
    /**
     * px 단위
     */
    fontSize: number;
    /**
     * px 단위
     */
    isComma?: boolean;
    color?: string;
    /**
     * `true`로 설정 시 처음 마운트 시 fade-in animation
     */
    isMountAnimate?: boolean;
};

const NOT_A_NUMBER = 'NaN';
const NUMBERS = tuple('0', '1', '2', '3', '4', '5', '6', '7', '8', '9');

const prefixCls = getPrefixName('nt').class;

const splitToString = (value: string | number) =>
    typeof value === 'number'
        ? range(value.toString().length, (i) => value.toString()[i])
        : range(value.length, (i) => value[i]);

function NumberText({
    number,
    fontSize,
    color = colors.grey[700],
    isComma = false,
    isMountAnimate = false,
}: RightLeftHeaderProps) {
    const ref = useRef<HTMLElement>(null);
    const validString = useMemo(() => {
        if (isNaN(Number(number))) return NOT_A_NUMBER;
        const localeString = isComma ? Number(number).toLocaleString('ko') : number;
        return splitToString(localeString);
    }, [isComma, number]);

    const className = useMemo(
        () =>
            classNames(prefixCls, {
                [`${prefixCls}-mount-animate`]: isMountAnimate,
            }),
        [isMountAnimate],
    );

    const [numberToString, setNumberToString] = useState<string[] | 'NaN'>(() =>
        isArray(validString) ? validString.map((v) => (v === ',' ? ',' : '0')) : 'NaN',
    );

    useEffect(() => {
        const element = ref.current;
        if (!element) return;
        element.style.fontSize = `${fontSize}px`;
        element.style.color = color;
    }, [color, fontSize]);

    useEffect(() => {
        let timeout: NodeJS.Timeout | undefined;
        if (isMountAnimate) {
            timeout = setTimeout(() => {
                setNumberToString(validString);
            }, 300);
        } else {
            setNumberToString(validString);
        }
        return () => {
            if (timeout) clearTimeout(timeout);
        };
    }, [isMountAnimate, validString]);

    return (
        <strong ref={ref} aria-label={`${number}`} className={className}>
            {isArray(numberToString)
                ? range(numberToString.length, (i) =>
                      numberToString[i] === ',' ? (
                          <span key={i.toString()} className="comma">
                              ,
                          </span>
                      ) : (
                          <span
                              key={i.toString()}
                              aria-hidden="true"
                              data-index={numberToString[i]}
                              className="ppby-nt-item"
                          >
                              {NUMBERS.map((v) => (
                                  <span key={v}>{v}</span>
                              ))}
                          </span>
                      ),
                  )
                : NOT_A_NUMBER}
        </strong>
    );
}

export default NumberText;
