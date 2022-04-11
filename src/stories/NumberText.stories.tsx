import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/styles';
// COMPONENTS
import NumberText from '../components/NumberText';
import Input from '../components/Input';
import Button from '../components/Button';

export default {
    title: 'Design System/Atoms/NumberText',
    component: NumberText,
    argTypes: {
        number: {
            control: false,
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
                defaultValue: null,
            },
        },
        isMountAnimate: {
            table: {
                category: 'Value',
            },
        },
        isComma: {
            table: {
                category: 'Value',
            },
        },
    },
} as ComponentMeta<typeof NumberText>;

const Template: ComponentStory<typeof NumberText> = (args) => {
    const [number, setNumber] = useState<number>(3721468000);
    const onClick = (type: 'up' | 'down') => () => {
        if (type === 'up') {
            setNumber((prev) => prev + 10);
            return;
        }
        setNumber((prev) => prev - 10);
    };

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
                <Button.Group shape="round">
                    <Button onClick={onClick('down')}>down</Button>
                    <Button onClick={onClick('up')}>up</Button>
                </Button.Group>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    fontSize: 16,
    color: colors.grey[700],
    isComma: true,
    isMountAnimate: false,
};
