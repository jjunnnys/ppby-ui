import React, { useEffect, useRef, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Modal from '../components/Modal';
import Alert from '../components/Alert';
import Button from '../components/Button';
import { Icons } from '..';

export default {
    title: 'Design System/Components/Alert',
    component: Alert,
    argTypes: {
        title: {
            table: { category: 'Value' },
        },
        subTitle: {
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
} as ComponentMeta<typeof Alert>;

const Template: ComponentStory<typeof Alert> = (args) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isVisibleAlert, setIsVisibleAlert] = useState(false);

    return (
        <>
            <Button onClick={() => setIsVisible(true)} shape="round">
                <Icons icon="add" />
            </Button>
            <Modal
                isVisible={isVisible}
                onCancel={() => setIsVisible(false)}
                title="제목"
                footer={
                    <Button.Group size="large" block>
                        <Button type="cancel" fontWeight="700" onClick={() => setIsVisible(false)}>
                            취소하기
                        </Button>
                        <Button type="secondary" fontWeight="700" onClick={() => setIsVisibleAlert(true)}>
                            삭제하기
                        </Button>
                    </Button.Group>
                }
            >
                <p>삭제 버튼을 누르면 Alert이 뜹니다.</p>
            </Modal>
            <Alert
                {...args}
                isVisible={isVisibleAlert}
                onCancel={() => setIsVisibleAlert(false)}
                footer={
                    <Button.Group size="large" block>
                        <Button type="cancel" fontWeight="700" onClick={() => setIsVisibleAlert(false)}>
                            취소하기
                        </Button>
                        <Button type="secondary" fontWeight="700">
                            삭제하기
                        </Button>
                    </Button.Group>
                }
            />
        </>
    );
};

export const Default = Template.bind({});
Default.args = {
    title: '해당 이용권 예약을 삭제하시겠습니까?',
    subTitle: '이용권 예약을 삭제할시 취소할 수 없습니다.',
};
