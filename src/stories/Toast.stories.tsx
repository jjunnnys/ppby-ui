import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useToast } from '@field-share/utils';
import Button from '../components/Button';
// COMPONENTS

export default {
    title: 'Design System/Atoms/Toast',
    component: () => <></>,
    argTypes: {
        text: {
            control: { type: 'text' },
            table: { category: 'Value' },
        },
        type: {
            options: ['info', 'success', 'error', 'warn'],
            control: { type: 'select' },
            table: { category: 'Value' },
        },
    },
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args) => {
    const toast = useToast();

    return (
        <div style={{ marginRight: 'auto' }}>
            <Button
                shape="round"
                onClick={() => {
                    (toast as any)[args.type || 'info'](args.text);
                }}
            >
                open
            </Button>
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    text: '예약이 등록되었습니다.',
    type: 'info',
};
