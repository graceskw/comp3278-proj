import * as React from 'react';
// import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
// import LinearProgress from '@mui/material/LinearProgress';
import {
  ViewState,
} from '@devexpress/dx-react-scheduler';
import {
  Scheduler,
  WeekView,
  DayView,
  Appointments,
  Toolbar,
  DateNavigator,
  ViewSwitcher,
  AppointmentForm,
  AppointmentTooltip,
  TodayButton,
} from '@devexpress/dx-react-scheduler-material-ui';

// dummy data
const schedulerData = [
  { startDate: '2023-11-06T14:30', endDate: '2023-11-06T15:20', title: 'COMP3278'},
  { startDate: '2023-11-09T13:30', endDate: '2023-11-09T15:20', title: 'COMP3278'},
];

export default () => {
  return (
    <Paper>
      <Scheduler
        // data={data}
        data={schedulerData}
        height={500}
        firstDayOfWeek={1}
        // data={appointments}
      >
        <ViewState

        />
          <WeekView
            startDayHour={7.5}
            endDayHour={20}
          />
        <DayView
          startDayHour={7.5}
          endDayHour={17.5}
        />
        <Appointments />
        <Toolbar/>
        <DateNavigator />
        <TodayButton />
        <ViewSwitcher />
        <AppointmentTooltip
          // showOpenButton           // edit appointment
          showCloseButton
        />
        {/* <AppointmentForm  />  // edit appointment */}
        {/* <AppointmentForm readOnly /> */}
      </Scheduler>
    </Paper>
  );
};
