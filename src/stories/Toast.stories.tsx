import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { useToast } from '@field-share/utils';
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
        <button
            style={{
                borderStyle: 'solid',
                borderColor: 'blue',
                borderWidth: 1,
                padding: '10px 32px',
                borderRadius: 8,
                fontSize: 18,
                marginRight: 'auto',
            }}
            onClick={() => {
                (toast as any)[args.type || 'info'](args.text);
            }}
        >
            open
        </button>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    text: '예약이 등록되었습니다.',
    type: 'info',
};
