import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Modal from '../components/Modal';

export default {
    title: 'Design System/Components/Modal',
    component: Modal,
    argTypes: {
        type: {
            control: { type: 'radio' },
            table: { category: 'Value' },
        },
        title: {
            table: { category: 'Value' },
        },
        cancelText: {
            table: { category: 'Value' },
        },
        okText: {
            table: { category: 'Value' },
        },
        isVisible: {
            control: { type: null },
            table: { category: 'Value' },
        },
        onOk: {
            table: { category: 'Event' },
        },
        onCancel: {
            table: { category: 'Event' },
        },
    },
    decorators: [
        (Story) => (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2em' }}>
                <Story />
            </div>
        ),
    ],
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <>
            <button
                type="button"
                style={{
                    padding: '10px 30px',
                    borderStyle: 'solid',
                    borderColor: 'blue',
                    borderWidth: 1,
                    borderRadius: 4,
                }}
                onClick={() => setIsVisible(true)}
            >
                open
            </button>
            <Modal {...args} isVisible={isVisible} onCancel={() => setIsVisible(false)} onOk={() => {}} />
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: '제목',
    cancelText: '취소하기',
    okText: '저장하기',
    type: 'primary',
};
