import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import Button from '../components/Button';
import toast from '../components/Toast';
// COMPONENTS

export default {
    title: 'Design System/Atoms/Toast',
    argTypes: {
        text: {
            control: { type: 'text' },
            table: { category: 'Value' },
        },
        duration: {
            description: 'ms단위',
            defaultValue: 3000,
            type: 'number',
            control: { type: 'number' },
            table: { category: 'Value' },
        },
        type: {
            options: ['info', 'success', 'error', 'warn', 'loading'],
            control: { type: 'select' },
            table: { category: 'Value' },
        },
    },
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8, alignItems: 'flex-start', marginRight: 'auto' }}>
        <Button
            shape="round"
            onClick={() => {
                (toast as any)[args.type || 'info'](args.text, args.duration);
            }}
        >
            open
        </Button>
        <Button
            shape="round"
            onClick={() => {
                toast.clean();
                (toast as any)[args.type || 'info'](args.text, args.duration);
            }}
        >
            clean open
        </Button>
        <Button size="small" onClick={() => toast.clean()}>
            remove
        </Button>
    </div>
);

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    text: '예약이 등록되었습니다.',
    type: 'info',
    duration: 3000,
};
