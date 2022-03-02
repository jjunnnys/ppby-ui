import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Modal from '../components/Modal';
import Alert from '../components/Alert';

export default {
    title: 'Design System/Components/Alert',
    component: Alert,
    argTypes: {
        type: {
            control: { type: 'radio' },
            table: { category: 'Value' },
        },
        title: {
            table: { category: 'Value' },
        },
        subTitle: {
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
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleAlert, setIsVisibleAlert] = useState(false);

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
            <Modal
                isVisible={isVisible}
                onCancel={() => setIsVisible(false)}
                onOk={() => setIsVisibleAlert(true)}
                title="테스트"
                cancelText="취소"
                type="danger"
                okText="삭제"
            >
                <div style={{ padding: 24 }}>삭제 버튼을 누르면 Alert이 뜹니다.</div>
            </Modal>
            <Alert {...args} isVisible={isVisibleAlert} onCancel={() => setIsVisibleAlert(false)} onOk={() => {}} />
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: '해당 이용권 예약을 삭제하시겠습니까?',
    subTitle: '이용권 예약을 삭제할시 취소할 수 없습니다.',
    cancelText: '취소하기',
    okText: '삭제하기',
    type: 'danger',
};
