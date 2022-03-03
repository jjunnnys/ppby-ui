import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES

// STYLES
import './test.css';
type TestProps = {};

function Test() {
    const carousel = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [theta, setTheta] = useState(0);
    const [radius, setRadius] = useState(0);

    const rotateCarousel = useCallback(() => {
        if (!carousel.current) return;
        const angle = theta * selectedIndex * -1;
        console.log({ theta, selectedIndex, radius });
        carousel.current.style.transform = `translateZ(-${radius}px) rotateX(${angle}deg)`;
    }, [radius, selectedIndex, theta]);

    const onClickPrev = useCallback(() => {
        setSelectedIndex((prev) => prev - 1);
        rotateCarousel();
    }, [rotateCarousel]);

    const onClickNext = useCallback(() => {
        setSelectedIndex((prev) => prev + 1);
        rotateCarousel();
    }, [rotateCarousel]);

    useEffect(() => {
        rotateCarousel();
    }, [rotateCarousel]);

    useLayoutEffect(() => {
        if (!carousel.current) return;
        const cells = Array.from(carousel.current.querySelectorAll<HTMLDivElement>('.carousel__cell'));
        const cellHeight = carousel.current.offsetHeight || 0;
        const cellSize = cellHeight;
        cells.forEach((cell, i) => {
            setTheta((prevTheta) => {
                setRadius((prevRadius) => {
                    if (i < 10) {
                        // visible cell
                        cell.style.opacity = '1';
                        const cellAngle = prevTheta * i;
                        cell.style.transform = `rotateX(${cellAngle}deg) translateZ(${prevRadius}px)`;
                    } else {
                        // hidden cell
                        cell.style.opacity = '0';
                        cell.style.transform = 'none';
                    }
                    return Math.round(cellSize / 2 / Math.tan(Math.PI / 10));
                });
                return 360 / 10;
            });
        });
    }, []);

    return (
        <>
            <div className="scene">
                <div ref={carousel}>
                    <div className="carousel__cell">1</div>
                    <div className="carousel__cell">2</div>
                    <div className="carousel__cell">3</div>
                    <div className="carousel__cell">4</div>
                    <div className="carousel__cell">5</div>
                    <div className="carousel__cell">6</div>
                    <div className="carousel__cell">7</div>
                    <div className="carousel__cell">8</div>
                    <div className="carousel__cell">9</div>
                    <div className="carousel__cell">10</div>
                    <div className="carousel__cell">11</div>
                    <div className="carousel__cell">12</div>
                    <div className="carousel__cell">13</div>
                    <div className="carousel__cell">14</div>
                    <div className="carousel__cell">15</div>
                </div>
            </div>
            <button
                type="button"
                onClick={onClickPrev}
                style={{ padding: '10px 30px', borderStyle: 'solid', borderColor: 'red', borderWidth: 1 }}
            >
                이전
            </button>
            <button
                type="button"
                onClick={onClickNext}
                style={{ padding: '10px 30px', borderStyle: 'solid', borderColor: 'red', borderWidth: 1 }}
            >
                다음
            </button>
        </>
    );
}

export default Test;
