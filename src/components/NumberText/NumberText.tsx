import React, { useState, useEffect, useMemo } from 'react';
import colors from '@field-share/colors';
import { map, hooks } from '@field-share/utils';
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
    lineHeight: number;
    color?: string;
};

const CHANGE_TIMEOUT = 300;

const isNumberOrStringMapping = (value: string | number) =>
    typeof value === 'number'
        ? map(value.toString().length, (i) => value.toString()[i])
        : map(value.length, (i) => value[i]);

function NumberText({ number, fontSize, lineHeight, color = colors.grey[700] }: RightLeftHeaderProps) {
    const [prevItem, setPrevItem] = useState(isNumberOrStringMapping(number));
    const debounced = hooks.useDebouncedCallback((value) => {
        setPrevItem(value);
    }, CHANGE_TIMEOUT);

    const numberToString = useMemo(() => isNumberOrStringMapping(number), [number]);
    const textStyle = useMemo(
        () => ({ fontSize: `${fontSize}px`, lineHeight: `${lineHeight}px`, color }),
        [fontSize, lineHeight, color],
    );

    useEffect(() => {
        debounced(numberToString);
    }, [debounced, numberToString]);

    useEffect(
        () => () => {
            debounced.cancel();
        },
        [],
    );

    return (
        <strong className="wds-nt-container" style={textStyle}>
            {map(numberToString.length, (i) => (
                <span
                    key={i}
                    className="wds-nt-item"
                    data-change-number={numberToString[i] !== prevItem[i]}
                    data-prev-number={prevItem[i]}
                >
                    {numberToString[i]}
                </span>
            ))}
        </strong>
    );
}

export default NumberText;
