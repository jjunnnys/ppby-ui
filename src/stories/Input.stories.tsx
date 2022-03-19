import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import colors from '@field-share/styles';
// COMPONENTS
import Input, { HTMLInputTypeAttribute } from '../components/Input';
import Icons from '../components/Icons';

export default {
    title: 'Design System/Atoms/Input',
    component: Input,
    argTypes: {
        type: {
            options: ['email', 'number', 'password', 'search', 'tel', 'text', 'url'] as HTMLInputTypeAttribute[],
            control: { type: 'select' },
            table: {
                category: 'Value',
            },
        },
        placeholder: {
            table: {
                category: 'Value',
            },
        },
        afterIcon: {
            options: Object.keys(Icons.svgs).map((v) => v),
            control: {
                type: 'select',
            },
            table: {
                category: 'Value',
            },
        },
        beforeIcon: {
            options: Object.keys(Icons.svgs).map((v) => v),
            control: {
                type: 'select',
            },
            table: {
                category: 'Value',
            },
        },
        loading: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        bordered: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        size: {
            options: ['default', 'large'],
            control: { type: 'radio' },
            table: {
                category: 'Value',
            },
        },
        afterIconColor: {
            control: { type: 'color' },
            table: {
                category: 'Value',
            },
        },
        beforeIconColor: {
            control: { type: 'color' },
            table: {
                category: 'Value',
            },
        },
        onClickAfterIcon: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        onClickBeforeIcon: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        onChange: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
    },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = (args) => {
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
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{}}>type: {args.type}</h4>
            <Input {...args} value={value} onChange={(v: string) => setValue(v)} />
        </div>
    );
};

export const Default = Template.bind({});
Default.storyName = '기본';
Default.args = {
    placeholder: 'placeholder',
    afterIconColor: colors.grey[300],
    beforeIconColor: colors.grey[300],
    type: 'text',
    loading: false,
    size: 'default',
};
