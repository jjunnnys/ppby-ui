import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import { toast } from '@field-share/utils';
// COMPONENTS

export default {
    title: 'Design System/Atoms/Toast',
    component: () => <></>,
    argTypes: {},
} as ComponentMeta<any>;

const Template: ComponentStory<any> = (args) => {
    const [value, setValue] = useState('');

    // useEffect(() => {
    //     let rafId = 0;
    //     function up() {
    //         setNumber((prev) => prev + 1);
    //         rafId = requestAnimationFrame(up);
    //     }
    //     up();
    //     if (rafId >= 10000) {
    //         cancelAnimationFrame(rafId);
    //     }
    // }, []);

    return (
        <button
            style={{
                borderStyle: 'solid',
                borderColor: 'blue',
                borderWidth: 1,
                padding: '20px 52px',
                borderRadius: 8,
                fontSize: 24,
                marginRight: 'auto',
            }}
            onClick={() => {
                toast.success('테스트입니다.');
            }}
        >
            open
        </button>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {};
