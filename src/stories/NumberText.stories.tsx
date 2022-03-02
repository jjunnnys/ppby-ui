import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/colors';

import NumberText from '../components/NumberText';

export default {
    title: 'Design System/Atoms/NumberText',
    component: NumberText,
    argTypes: {
        leftIcon: {
            table: {
                category: 'Value',
            },
        },
        rightIcon: {
            table: {
                category: 'Value',
            },
        },
        iconColor: {
            control: { type: 'color' },
            table: {
                category: 'Value',
            },
        },
        numberBoxList: {
            description: 'string 배열',
            table: {
                category: 'Value',
            },
        },
        numberBoxItemPrefix: {
            description: 'string 배열',
            table: {
                category: 'Value',
            },
        },
        onClickLeft: {
            table: {
                category: 'Events',
            },
        },
        onClickRight: {
            table: {
                category: 'Events',
            },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2em' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof NumberText>;

const Template: ComponentStory<typeof NumberText> = (args) => {
    const [number, setNumber] = useState(new Date().getFullYear());
    const onClick = (type: 'up' | 'down') => () => {
        if (type === 'up') {
            setNumber((prev) => prev + 1);
            return;
        }
        setNumber((prev) => prev - 1);
    };
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <NumberText {...args} number={number} />
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
    lineHeight: 20,
    color: colors.grey[700],
};
