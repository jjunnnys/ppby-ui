import React, { useEffect, useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs, { Dayjs } from 'dayjs';
// COMPONENTS
import DatePicker, { DateRangeValue, DateValueType } from '../components/DatePicker';
import Checkbox from '../components/Checkbox';
import WDSButton from '../components/Button';

export default {
    title: 'Design System/Molecules/DatePicker',
    component: DatePicker,
    argTypes: {
        type: {
            control: false,
            table: {
                category: 'Value',
            },
        },
        value: {
            control: false,
            table: {
                category: 'Value',
            },
        },
        inputFormat: {
            table: {
                category: 'Value',
            },
        },
        dateType: {
            table: {
                category: 'Value',
            },
        },
        isOnlyOneDateSelect: {
            table: {
                category: 'Value',
            },
        },
        isShowToday: {
            table: {
                category: 'Value',
            },
        },
        inputTypeSize: {
            table: {
                category: 'Value',
            },
        },
        onChangeDate: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        disabledDate: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
        eventDate: {
            control: { type: null },
            table: {
                category: 'Event',
            },
        },
    },
} as ComponentMeta<typeof DatePicker>;

const Template: ComponentStory<typeof DatePicker> = (args) => {
    const [eventDateValue, setEventDateValue] = useState<DateRangeValue>(null);
    const [eventDate, setEventDate] = useState<Dayjs[]>([]);
    const [disabledDateValue, setDisabledDateValue] = useState<DateEventValue>(null);
    const [disabledDate, setDisabledDate] = useState<DateEventValue>(null);
    const [hasPrevDateDisabled, setHasPrevDateDisalbed] = useState(false);
    const [value, setValue] = useState<DateValueType>(null);

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    paddingRight: 20,
                }}
            >
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                    <div style={{ display: 'flex', columnGap: 8 }}>
                        <h4 style={{ marginTop: 0, marginBottom: 8 }}>???????????? ?????? ??????</h4>
                        <Checkbox
                            label="?????? ?????? ????????????"
                            checked={hasPrevDateDisabled}
                            onChange={(checked) => setHasPrevDateDisalbed(checked)}
                        />
                    </div>
                    <DatePicker
                        dateType="day"
                        type="button"
                        onChangeDate={(date) => {
                            if (!isArray(date)) {
                                setValue(null);
                                setDisabledDateValue(date?.startOf('date') || null);
                                setDisabledDate(date?.startOf('date') || null);
                            }
                        }}
                        value={disabledDateValue}
                        isShowToday
                    />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', rowGap: 8 }}>
                    <h4 style={{ marginTop: 32, marginBottom: 8 }}>????????? ?????? ??????</h4>
                    <DatePicker
                        dateType="day"
                        type="button"
                        onChangeDate={(dates) => {
                            if (Array.isArray(dates)) {
                                setValue(null);
                                setEventDateValue(dates);
                                setEventDate(startEndDateList(dates));
                            }
                        }}
                        isOnlyOneDateSelect={false}
                        value={eventDateValue}
                        isShowToday
                    />
                </div>
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingRight: 20,
                    borderRight: '1px solid black',
                }}
            />
            <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', columnGap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', columnGap: 16 }}>
                        <h4 style={{ marginTop: 0, marginBottom: 8 }}>?????? ??????</h4>
                        <WDSButton size="small" onClick={() => setValue(null)}>
                            reset
                        </WDSButton>
                    </div>
                    <h6 style={{ marginBottom: 5, marginTop: 0 }}>
                        {isArray(value)
                            ? `${value[0]?.format('YYYY-MM-DD HH:mm:ss')} ~ ${value[1]?.format('YYYY-MM-DD HH:mm:ss')}`
                            : value?.format('YYYY-MM-DD HH:mm:ss')}
                    </h6>
                </div>
                <div>
                    <DatePicker
                        {...args}
                        eventDate={eventDate}
                        disabledDate={(date) => {
                            if (date.isSame(disabledDate)) return true;
                            return hasPrevDateDisabled ? date.isBefore(dayjs()) : false;
                        }}
                        value={value}
                        onChangeDate={(date) => setValue(date)}
                    />
                </div>
            </div>
        </div>
    );
};

export const Button = Template.bind({});
Button.storyName = 'button';
Button.args = {
    type: 'button',
    dateType: 'day',
    isOnlyOneDateSelect: true,
    isShowToday: true,
};

export const Input = Template.bind({});
Input.storyName = 'input';
Input.args = {
    type: 'input',
    dateType: 'day',
    isOnlyOneDateSelect: true,
    isShowToday: true,
    inputTypeSize: 'default',
};

export const Fixed = Template.bind({});
Fixed.storyName = 'fixed';
Fixed.args = {
    type: 'fixed',
    dateType: 'day',
    isOnlyOneDateSelect: true,
    isShowToday: true,
};
