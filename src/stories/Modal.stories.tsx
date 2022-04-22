import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Modal from '../components/Modal';
import Button from '../components/Button';

export default {
    title: 'Design System/Components/Modal',
    component: Modal,
    argTypes: {
        title: {
            table: { category: 'Value' },
        },
        isVisible: {
            control: { type: null },
            table: { category: 'Value' },
        },
        onCancel: {
            control: { type: null },
            table: { category: 'Event' },
        },
        footer: {
            control: { type: null },
            table: { category: 'ReactNode' },
        },
    },
} as ComponentMeta<typeof Modal>;

const Template: ComponentStory<typeof Modal> = (args) => {
    const [isVisible, setIsVisible] = useState(false);

    const onCancel = () => setIsVisible(false);

    return (
        <>
            <Button onClick={() => setIsVisible(true)} shape="round">
                모달 열기
            </Button>
            <Modal {...args} isVisible={isVisible} onCancel={() => setIsVisible(false)}>
                <p>모달...</p>
            </Modal>
        </>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    title: '제목',
};
