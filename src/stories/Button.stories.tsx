import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { range } from '@field-share/utils';
// COMPONENTS
import Button from '../components/Button';
import Input from '../components/Input';

export default {
    title: 'Design System/Atoms/Button',
    component: Button,
    argTypes: {
        type: {
            options: ['default', 'primary', 'secondary', 'cancel', 'goast', 'danger'],
            control: { type: 'select' },
            description: '버튼 타입',
            defaultValue: 'default',
            table: {
                category: 'Value',
                defaultValue: { summary: 'default' },
            },
        },
        size: {
            options: ['large', 'small', 'medium'],
            control: { type: 'select' },
            description: '버튼 사이즈',
            defaultValue: 'medium',
            table: {
                category: 'Value',
                defaultValue: { summary: 'medium' },
            },
        },
        shape: {
            options: ['default', 'circle', 'ellipse', 'round'],
            control: { type: 'select' },
            description: '버튼 모양',
            defaultValue: 'round',
            table: {
                category: 'Value',
                defaultValue: { summary: 'round' },
            },
        },
        fontWeight: {
            options: ['reagular', 'bold'],
            control: {
                type: 'select',
            },
            table: {
                category: 'Value',
            },
        },
        block: {
            control: {
                type: 'boolean',
            },
            table: {
                category: 'Value',
            },
        },
        enalbledShadow: {
            control: {
                type: 'boolean',
            },
            table: {
                category: 'Value',
            },
        },
        htmlType: {
            control: { type: null },
            table: {
                category: 'Value',
            },
        },
    },
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => {
    const [value, setValue] = useState('Button');

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            {/* <h4 style={{}}>type: {args.type}</h4> */}
            <div style={{ marginBottom: 24 }}>
                <Input value={value} onChange={(v: string) => setValue(v)} />
            </div>
            <div>
                <Button {...args}>{value}</Button>
            </div>
        </div>
    );
};

const GroupTemplate: ComponentStory<typeof Button> = (args) => {
    const [value, setValue] = useState('Button');
    const [number, setNumber] = useState(2);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
            }}
        >
            {/* <h4 style={{}}>type: {args.type}</h4> */}
            <div style={{ display: 'flex', alignItems: 'center', columnGap: 12, marginBottom: 24 }}>
                <div>
                    <Input value={value} onChange={(v: string) => setValue(v)} />
                </div>
                <h4 style={{ margin: 0 }}>버튼수: {number}</h4>
                <Button.Group size="small" shape="ellipse">
                    <Button
                        type="cancel"
                        fontWeight="bold"
                        disabled={number <= 2}
                        onClick={() => setNumber((prev) => (prev < 2 ? 2 : prev - 1))}
                    >
                        -
                    </Button>
                    <Button type="secondary" fontWeight="bold" onClick={() => setNumber((prev) => prev + 1)}>
                        +
                    </Button>
                </Button.Group>
            </div>
            <div>
                <Button.Group {...args}>
                    {range(number, (i) => (
                        <Button key={i.toString()} {...args}>{`${i + 1}-${value}`}</Button>
                    ))}
                </Button.Group>
            </div>
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    type: 'default',
    size: 'medium',
    shape: 'round',
    block: false,
};

export const Group = GroupTemplate.bind({});
Group.storyName = '그룹';
Group.args = {
    type: 'default',
    size: 'medium',
    shape: 'round',
    block: true,
};
