import React, { useMemo, useCallback } from 'react';
import colors from '@field-share/colors';
import { map } from '@field-share/utils';
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
    isLocaelString?: boolean;
    color?: string;
};

const NUMBERS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

const isNumberOrStringMapping = (value: string | number) =>
    typeof value === 'number'
        ? map(value.toString().length, (i) => value.toString()[i])
        : map(value.length, (i) => value[i]);

function NumberText({ number, fontSize, color = colors.grey[700], isLocaelString = false }: RightLeftHeaderProps) {
    const numberToString = useMemo(
        () =>
            isNaN(Number(number))
                ? 'NaN'
                : isNumberOrStringMapping(isLocaelString ? Number(number).toLocaleString('ko') : number),
        [isLocaelString, number],
    );

    const textStyle = useMemo(
        () => ({
            fontSize: `${fontSize}px`,
            color,
        }),
        [fontSize, color],
    );

    const translateY = useCallback(
        (value: string) => ({ transform: `translateY(-${Number(value) * fontSize}px)` }),
        [fontSize],
    );

    return (
        <strong aria-label={`${number}`} className="wds-nt-container" style={textStyle}>
            {numberToString === 'NaN'
                ? 'NaN'
                : map(numberToString.length, (i) =>
                      numberToString[i] === ',' ? (
                          <span key={i.toString()} className="comma">
                              ,
                          </span>
                      ) : (
                          <span
                              key={i.toString()}
                              aria-hidden="true"
                              className="wds-nt-item"
                              style={translateY(numberToString[i])}
                          >
                              {NUMBERS.map((v) => (
                                  <span key={v} className="wds-nt">
                                      {v}
                                  </span>
                              ))}
                          </span>
                      ),
                  )}
        </strong>
    );
}

export default NumberText;
