import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs, { Dayjs } from 'dayjs';
import { isArray, startEndDateList } from '@field-share/utils';
// COMPONENTS
import DatePicker from '../components/DatePicker';

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
    const [eventDateValue, setEventDateValue] = useState<[Dayjs | undefined, Dayjs | undefined]>([
        undefined,
        undefined,
    ]);
    const [eventDate, setEventDate] = useState<Dayjs[]>([]);
    const [disabledDateValue, setDisabledDateValue] = useState<Dayjs | undefined>();
    const [disabledDate, setDisabledDate] = useState<Dayjs | undefined>();
    const [hasPrevDateDisabled, setHasPrevDateDisalbed] = useState(false);
    const [value, setValue] = useState<Dayjs | [Dayjs | undefined, Dayjs | undefined] | undefined>();

    return (
        <div style={{ display: 'flex', width: '100%' }}>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingRight: 20,
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <h4>비활성화 날짜 선택</h4>
                    <input
                        id="today-check"
                        type="checkbox"
                        checked={hasPrevDateDisabled}
                        onChange={(e) => setHasPrevDateDisalbed(e.target.checked)}
                    />
                    <label htmlFor="today-check" style={{ fontSize: 12 }}>
                        이전 날짜 비활성화
                    </label>
                </div>
                <DatePicker
                    dateType="day"
                    type="button"
                    onChangeDate={(date) => {
                        if (!isArray(date)) {
                            console.log({ date: date?.format('YYYY-MM-DD HH:mm:ss') });
                            setValue(undefined);
                            setDisabledDateValue(date?.startOf('date'));
                            setDisabledDate(date?.startOf('date'));
                        }
                    }}
                    value={disabledDateValue}
                    isShowToday
                />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    paddingRight: 20,
                    borderRight: '1px solid black',
                }}
            >
                <h4>이벤트 날짜 설정</h4>
                <DatePicker
                    dateType="day"
                    type="button"
                    onChangeDate={(dates) => {
                        if (Array.isArray(dates)) {
                            setValue(undefined);
                            setEventDateValue(dates);
                            setEventDate(startEndDateList(dates));
                        }
                    }}
                    isOnlyOneDateSelect={false}
                    value={eventDateValue}
                    isShowToday
                />
            </div>
            <div style={{ margin: '0 20px', display: 'flex', flexDirection: 'column' }}>
                <h4>결과 확인</h4>
                <h6 style={{ marginBottom: 5, marginTop: 0 }}>
                    {isArray(value)
                        ? `${value[0]?.format('YYYY-MM-DD HH:mm:ss')} ~ ${value[1]?.format('YYYY-MM-DD HH:mm:ss')}`
                        : value?.format('YYYY-MM-DD HH:mm:ss')}
                </h6>
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
            <h3 style={{ textAlign: 'right', flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
                type : {args.type}
            </h3>
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
