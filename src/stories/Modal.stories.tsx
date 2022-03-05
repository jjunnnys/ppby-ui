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
            <Modal
                {...args}
                isVisible={isVisible}
                onCancel={() => setIsVisible(false)}
                footer={
                    <Button.Group>
                        <Button type="cancel" fontWeight="700" onClick={onCancel}>
                            취소하기
                        </Button>
                        <Button type="primary" fontWeight="700">
                            저장하기
                        </Button>
                    </Button.Group>
                }
            >
                <p>모달...</p>
            </Modal>
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: '제목',
};
