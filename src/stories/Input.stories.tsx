import React, { useCallback, useEffect, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/colors';
// COMPONENTS
import Input from '../components/Input';

export default {
    title: 'Design System/Atoms/Input',
    component: Input,
    argTypes: {
        // number: {
        //     control: { type: null },
        //     table: {
        //         category: 'Value',
        //     },
        // },
        // fontSize: {
        //     table: {
        //         category: 'Value',
        //     },
        // },
        // color: {
        //     table: {
        //         category: 'Value',
        //     },
        // },
        onChange: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
    },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
    // const [number, setNumber] = useState<number>(isNaN(Number(args.number)) ? 0 : Number(args.number));
    // const onClick = (type: 'up' | 'down') => () => {
    //     if (type === 'up') {
    //         setNumber((prev) => prev + 1);
    //         return;
    //     }
    //     setNumber((prev) => prev);
    // };

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
        <div>
            <Input
                {...args}
                // type="number"
                // min={0}
                // placeholder="값 입력"
                // value={number}
                // loading={false}
                // onChange={(value) => {
                //     if (typeof value === 'number') {
                //         setNumber(value);
                //     }
                // }}
            />
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    type: 'text',
    placeholder: 'placeholder',
};
