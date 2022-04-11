import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Input, { HTMLInputTypeAttribute } from '../components/Input';
import Icons from '../components/Icons';

export default {
    title: 'Design System/Atoms/Input',
    component: Input,
    argTypes: {
        type: {
            options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'] as HTMLInputTypeAttribute[],
            control: { type: 'select' },
            description: 'input type',
            table: {
                category: 'Value',
            },
        },
        placeholder: {
            table: {
                category: 'Value',
            },
        },
        afterIcon: {
            options: Object.keys(Icons.svgs).map((v) => v),
            control: {
                type: 'select',
            },
            table: {
                category: 'Value',
            },
        },
        beforeIcon: {
            options: Object.keys(Icons.svgs).map((v) => v),
            control: {
                type: 'select',
            },
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
        afterIconColor: {
            control: { type: 'color' },
            table: {
                category: 'Value',
            },
        },
        beforeIconColor: {
            control: { type: 'color' },
            table: {
                category: 'Value',
            },
        },
        onClickAfterIcon: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        onClickBeforeIcon: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        validate: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        onChange: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
    },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
    const [value, setValue] = useState('');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
            <h4>type: {args.type}</h4>
            <Input {...args} value={value} onChange={(v: string) => setValue(v)} validate={(v) => !!v} />
            <Input {...args} value={value} onChange={(v: string) => setValue(v)} />
            <Input {...args} value={value} onChange={(v: string) => setValue(v)} />
            <Input {...args} value={value} onChange={(v: string) => setValue(v)} />
            <Input {...args} value={value} onChange={(v: string) => setValue(v)} />
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    placeholder: 'placeholder',
    type: 'text',
    loading: false,
    size: 'default',
    disabled: false,
};
