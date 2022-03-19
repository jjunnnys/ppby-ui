import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import TimePicker from '../components/TimePicker';
import { TimePickerValueType } from '../components/TimePicker/TimePicker';

export default {
    title: 'Design System/Molecules/TimePicker',
    component: TimePicker,
    argTypes: {
        size: {
            table: {
                category: 'Value',
            },
        },
        minuteList: {
            table: {
                category: 'Value',
            },
        },
        hourList: {
            table: {
                category: 'Value',
            },
        },
        value: {
            control: { type: null },
            table: {
                category: 'Value',
            },
        },
        onChange: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
    },
} as ComponentMeta<typeof TimePicker>;

const Template: ComponentStory<typeof TimePicker> = (args) => {
    const [value, setValue] = useState<TimePickerValueType | undefined>();

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{}}>time: {value}</h4>
            <TimePicker {...args} value={value} onChange={(time) => setValue(time)} />
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    size: 'default',
    minuteList: ['00', '15', '30', '45'],
};
