import React, { useEffect, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Select from '../components/Select';

export default {
    title: 'Design System/Atoms/Select',
    component: Select,
    argTypes: {
        options: {
            table: {
                category: 'Value',
            },
        },
        placeholder: {
            table: {
                category: 'Value',
            },
        },
        loading: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        disabled: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        bordered: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        size: {
            options: ['default', 'large'],
            control: { type: 'radio' },
            table: {
                category: 'Value',
            },
        },
        clearOption: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        onChange: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
    },
} as ComponentMeta<typeof Select>;

const Template: ComponentStory<typeof Select> = (args) => {
    const [value, setValue] = useState<string>('');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
            <Select {...args} value={value} onChange={(v) => setValue(v)}>
                {['기본1', '기본2', '기본3', '기본4'].map((v, i) => (
                    <Select.Option key={i.toString()} value={v} label={v} />
                ))}
            </Select>
            <Select {...args} value={value} onChange={(v) => setValue(v)}>
                {['A1', 'A2', 'A3', 'A4'].map((v, i) => (
                    <Select.Option key={i.toString()} value={v} label={v} />
                ))}
            </Select>
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    placeholder: '선택',
    loading: false,
    bordered: true,
    size: 'default',
    clearOption: false,
    disabled: false,
};
