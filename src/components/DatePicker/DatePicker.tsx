import { useEffect } from "react";
// PAGES
// COMPONENTS
// HOOKS
// MODULES
// LIB
// TYPES

// STYLES
type DatePickerProps = {};

function DatePicker() {
  // useEffect(()=>{
  //     console.time('달 계산');
  //     const firstDay = currentMonth.startOf('month').day();
  //     const endDay = currentMonth.endOf('month').day();
  //     const startWeekIndex = 7 - (7 - firstDay);
  //     const endWeekIndex = 7 - endDay - 1;
  //     const prevMonth = currentMonth.startOf('month').subtract(1, 'month');
  //     const nextMonth = currentMonth.startOf('month').add(1, 'month');

  //     const prevMonthList = map(prevMonth.daysInMonth(), (i) =>
  //         prevMonth.add(prevMonth.daysInMonth() - (i + 1), 'days'),
  //     );
  //     const nextMonthList = map(nextMonth.daysInMonth(), (i) => nextMonth.add(i, 'days'));

  //     const daysInMonthList = [
  //         ...map(startWeekIndex, (i) => prevMonthList[i]).reverse(), // 이전 달
  //         ...map(currentMonth.daysInMonth(), (i) => dayjs(dateFormatMapping(currentMonth, i))), // 요번 달
  //         ...map(endWeekIndex, (i) => nextMonthList[i]), // 다음 달
  //     ];

  //     const weeksLength = Math.floor(daysInMonthList.length / 7);
  //     const weeksMapping = (i: number) => map(7, (j) => daysInMonthList[i * 7 + j]);
  //     setMonthList(map(weeksLength, weeksMapping));
  //     setMonthToScheduleList(daysInMonthList.map((v, i) => (i % 5 === 0 ? DUMMY_DATA : [])));
  //     console.timeEnd('달 계산');
  // },[])
  return <div>DatePicker</div>;
}

export default DatePicker;
