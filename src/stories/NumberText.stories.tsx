import React, { useCallback, useEffect, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/colors';
// COMPONENTS
import NumberText from '../components/NumberText';
import Input from '../components/Input';

export default {
    title: 'Design System/Atoms/NumberText',
    component: NumberText,
    argTypes: {
        number: {
            control: { type: null },
            table: {
                category: 'Value',
            },
        },
        fontSize: {
            table: {
                category: 'Value',
            },
        },
        color: {
            table: {
                category: 'Value',
            },
        },
        isLocaelString: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
    },
} as ComponentMeta<typeof NumberText>;

const Template: ComponentStory<typeof NumberText> = (args) => {
    const [number, setNumber] = useState<number>(isNaN(Number(args.number)) ? 0 : Number(args.number));
    const onClick = (type: 'up' | 'down') => () => {
        if (type === 'up') {
            setNumber((prev) => prev + 1);
            return;
        }
        setNumber((prev) => prev);
    };

    // useEffect(() => {
    //     let rafId = 0;
    //     function up() {
    //         setNumber((prev) => prev + 1);
    //         rafId = requestAnimationFrame(up);
    //     }
    //     up();
    //     if (rafId >= 10000) {
    //         cancelAnimationFrame(rafId);
    //     }
    // }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <div style={{}}>
                <Input
                    type="number"
                    min={0}
                    placeholder="값 입력"
                    value={number}
                    loading={false}
                    onChange={(value) => {
                        if (typeof value === 'number') {
                            setNumber(value);
                        }
                    }}
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    fontSize: args.fontSize,
                    columnGap: 5,
                    marginTop: 20,
                }}
            >
                <NumberText {...args} number={number} />
                <span>원</span>
            </div>
            <div style={{ marginTop: 20 }}>
                <button
                    type="button"
                    style={{
                        padding: '10px 30px',
                        borderStyle: 'solid',
                        borderColor: 'blue',
                        borderRadius: '4px 0 0 4px',
                        borderWidth: 1,
                        borderRightWidth: 0,
                    }}
                    onClick={onClick('down')}
                >
                    down
                </button>
                <button
                    type="button"
                    style={{
                        padding: '10px 30px',
                        borderStyle: 'solid',
                        borderColor: 'blue',
                        borderWidth: 1,
                        borderRadius: '0 4px 4px 0',
                    }}
                    onClick={onClick('up')}
                >
                    up
                </button>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    fontSize: 16,
    color: colors.grey[700],
    isLocaelString: true,
};
