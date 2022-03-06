import React, { useState } from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import dayjs, { Dayjs } from 'dayjs';
import { startEndDateList } from '@field-share/utils';
// COMPONENTS
import DatePicker from '../components/DatePicker';

export default {
    title: 'Design System/Molecules/DatePicker',
    component: DatePicker,
    argTypes: {
        type: {
            control: { type: null },
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
        dateType: {
            control: { type: 'radio' },
            table: {
                category: 'Value',
            },
        },
        isOnlyOneDateSelect: {
            control: { type: 'boolean' },
            table: {
                category: 'Value',
            },
        },
        isShowToday: {
            control: { type: 'boolean' },
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
                    type="fixed"
                    onChangeDate={(date) => {
                        if (!Array.isArray(date)) {
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
                    type="fixed"
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
            <div style={{ marginLeft: 20, display: 'flex', flexDirection: 'column' }}>
                <h4>결과 확인</h4>
                <h6 style={{ marginBottom: 5, marginTop: 0 }}>
                    {Array.isArray(value)
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
        </div>
    );
};

export const Button = Template.bind({});
Button.storyName = '버튼';
Button.args = {
    type: 'button',
    dateType: 'day',
    isOnlyOneDateSelect: true,
    isShowToday: true,
};

export const Fixed = Template.bind({});
Fixed.storyName = '고정';
Fixed.args = {
    type: 'fixed',
    dateType: 'day',
    isOnlyOneDateSelect: true,
    isShowToday: true,
};
