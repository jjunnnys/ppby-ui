import React, { useMemo, useEffect, useState } from 'react';
import colors from '@field-share/styles';
import { map, tuple, getPrefixName, isArray } from '@field-share/utils';
import classNames from 'classnames';
// STYLES
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
        ? map(value.toString().length, (i) => value.toString()[i])
        : map(value.length, (i) => value[i]);

function NumberText({
    number,
    fontSize,
    color = colors.grey[700],
    isComma = false,
    isMountAnimate = false,
}: RightLeftHeaderProps) {
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
        const element = document.querySelector<HTMLElement>('.wds-nt');
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
        <strong aria-label={`${number}`} className={className}>
            {isArray(numberToString)
                ? map(numberToString.length, (i) =>
                      numberToString[i] === ',' ? (
                          <span key={i.toString()} className="comma">
                              ,
                          </span>
                      ) : (
                          <span
                              key={i.toString()}
                              aria-hidden="true"
                              data-index={numberToString[i]}
                              className="wds-nt-item"
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
