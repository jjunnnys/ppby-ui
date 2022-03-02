import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useLayoutEffect,
} from "react";
import colors from "@field-share/colors";
import { map, hooks } from "@field-share/utils";
// STYLES
import "./styles.css";

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

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const isNumberOrStringMapping = (value: string | number) =>
    typeof value === "number"
        ? map(value.toString().length, (i) => value.toString()[i])
        : map(value.length, (i) => value[i]);

function NumberText({
    number,
    fontSize,
    color = colors.grey[700],
}: RightLeftHeaderProps) {
    const rectMap = React.useRef<Map<string, DOMRect>>(new Map()).current;
    const [prevItem, setPrevItem] = useState(isNumberOrStringMapping(number));
    const debounced = hooks.useDebouncedCallback((value) => {
        setPrevItem(value);
    }, CHANGE_TIMEOUT);

    const numberToString = useMemo(
        () => isNumberOrStringMapping(number),
        [number]
    );

    const textStyle = useMemo(
        () => ({
            fontSize: `${fontSize}px`,
            color,
        }),
        [fontSize, color]
    );

    const translateY = useCallback((value: string) => {
        // console.log({ value });
        return { transform: `translateY(-${Number(value) * (1 + 0.1)}em)` };
    }, []);

    // // 최초 캐싱
    // useEffect(() => {
    //     const elements = Array.from(
    //         document.querySelectorAll<HTMLLIElement>(".wds-nt-item")
    //     );

    //     elements.forEach((el) => {
    //         rectMap.set(el.id, el.getBoundingClientRect());
    //     });
    // }, [rectMap]);

    // useLayoutEffect(() => {
    //     const elements = Array.from(document.querySelectorAll(".wds-nt-item"));

    //     elements.forEach((el) => {
    //         const cachedRect = rectMap.get(el.id);

    //         if (cachedRect) {
    //             const nextRect = el.getBoundingClientRect();
    //             console.log(nextRect);

    //             el.animate(
    //                 [
    //                     {
    //                         transform: `translateX(${
    //                             cachedRect.right - nextRect.right
    //                         }px), translateY(${1}em)`,
    //                     },
    //                     {
    //                         transform: `translateX(${0}px), , translateY(${0}em)`,
    //                     },
    //                 ],
    //                 {
    //                     duration: 300,
    //                     easing: "ease-in-out",
    //                 }
    //             );

    //             rectMap.set(el.id, nextRect);
    //         }
    //     });
    // }, [rectMap, numberToString]);

    useEffect(() => {
        debounced(numberToString);
    }, [numberToString]);

    useEffect(
        () => () => {
            debounced.cancel();
        },
        []
    );

    return (
        <strong
            aria-label={`${number}`}
            className="wds-nt-container"
            style={textStyle}
        >
            {map(numberToString.length, (i) => (
                <span
                    aria-hidden="true"
                    key={i.toString()}
                    className="wds-nt-item"
                    style={translateY(numberToString[i])}
                >
                    {NUMBERS.map((v) => (
                        <span key={v} className="wds-nt">
                            {v}
                        </span>
                    ))}
                </span>
            ))}
        </strong>
    );
}

export default NumberText;
