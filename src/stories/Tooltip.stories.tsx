import React, { useEffect, useState } from 'react';
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
        zIndex: {
            control: { type: 'number' },
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

    // useEffect(() => {
    //     setTimeout(() => {
    //         setIsShow(true);
    //     }, 300);
    // }, []);

    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 200 }}>
            <Tooltip {...args}>
                <div className="123" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>툴팁~~~</span>
                </div>
            </Tooltip>
            <div
                style={{
                    width: 100,
                    height: 100,
                    position: 'absolute',
                    top: 200,
                    right: 500,
                    backgroundColor: 'red',
                }}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    title: '변경하시려는 시설을 선택해주세요.',
    placement: 'top',
};
