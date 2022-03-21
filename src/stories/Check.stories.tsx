import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
// COMPONENTS
import Checkbox from '../components/Checkbox';
import Radio from '../components/Radio';
import Switch from '../components/Switch';

export default {
    title: 'Design System/Atoms/Check',
    component: Checkbox,
    argTypes: {
        label: {
            table: {
                category: 'Value',
            },
        },
        checked: {
            control: {
                type: null,
            },
            table: {
                category: 'Value',
            },
        },
        value: {
            control: {
                type: null,
            },
            table: {
                category: 'Value',
            },
        },
        disabled: {
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
} as ComponentMeta<typeof Checkbox>;

const CheckboxTemplate: ComponentStory<typeof Checkbox> = (args) => {
    const [checked, setChecked] = useState(true);

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h4 style={{}}>checked: {`${checked}`}</h4>
            <Checkbox
                {...args}
                checked={checked}
                onChange={(isChecked) => {
                    setChecked(isChecked);
                }}
            />
        </div>
    );
};

const RadioTemplate: ComponentStory<typeof Radio> = (args) => {
    const [value, setValue] = useState<string | undefined>();
    const [disabled, setDisabled] = useState(false);
    const [direction, setDirection] = useState<'column' | 'row'>('column');

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', columnGap: 12 }}>
                <Switch
                    checked={direction === 'row'}
                    label={direction}
                    onChange={(checked) => setDirection(checked ? 'row' : 'column')}
                />
                <Checkbox
                    checked={disabled}
                    onChange={(isChecked) => {
                        setDisabled(isChecked);
                    }}
                    label="비활성화"
                />
                <h4 style={{}}>value: {value ? `${value}` : ''}</h4>{' '}
            </div>
            <Radio.Group disabled={disabled} value={value} onChange={(v) => setValue(v)} direction={direction}>
                <Radio value="1" label={`${args.label}1`} />
                <Radio value="2" label={`${args.label}2`} />
                <Radio value="3" label={`${args.label}3`} />
            </Radio.Group>
        </div>
    );
};

const SwitchTemplate: ComponentStory<typeof Switch> = (args) => {
    const [checked, setChecked] = useState(true);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h4 style={{}}>checked: {`${checked}`}</h4>
            <Switch
                {...args}
                checked={checked}
                onChange={(isChecked) => {
                    setChecked(isChecked);
                }}
            />
        </div>
    );
};

export const CheckboxSb = CheckboxTemplate.bind({});
CheckboxSb.storyName = 'Checkbox';
CheckboxSb.args = {
    label: '체크박스',
    disabled: false,
};

export const RadioSb = RadioTemplate.bind({});
RadioSb.storyName = 'Radio';
RadioSb.args = {
    label: '라디오',
};

export const SwitchSb = SwitchTemplate.bind({});
SwitchSb.storyName = 'Switch';
SwitchSb.args = {
    label: '',
    disabled: false,
};
