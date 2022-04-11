import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Tooltip from '../components/Tooltip';
import Button from '../components/Button';

export default {
    title: 'Design System/Atoms/Tooltip',
    component: Tooltip,
    argTypes: {
        title: {
            table: {
                category: 'Value',
            },
        },
        isVisible: {
            table: {
                category: 'Value',
            },
        },
        placement: {
            options: ['top', 'left', 'right', 'bottom'],
            control: { type: 'select' },
            table: {
                category: 'Value',
            },
        },
        onCancel: {
            control: false,
            table: {
                category: 'Event',
            },
        },
        // isComma: {
        //     table: {
        //         category: 'Value',
        //     },
        // },
    },
} as ComponentMeta<typeof Tooltip>;

const Template: ComponentStory<typeof Tooltip> = (args) => {
    const [isShow, setIsShow] = useState(true);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
                <p style={{ color: 'gray', fontSize: 12, marginTop: 0 }}>
                    * 버튼 클릭 시 닫히는 건 사용하는 쪽에서 구현
                </p>
                <Button onClick={() => setIsShow((prev) => !prev)}>on</Button>
            </div>
            <Tooltip {...args} isVisible={isShow} onCancel={() => setIsShow(false)}>
                <div className="123" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>툴팁~~~</span>
                </div>
            </Tooltip>
            <div style={{ width: 500 }} />
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    title: '변경하시려는 시설을 선택해주세요.',
    placement: 'top',
};
