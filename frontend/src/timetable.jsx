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
// const schedulerData = [
//   // { startDate: '2023-11-16T14:30', endDate: '2023-11-16T15:20', title: 'COMP3278'},
//   // { startDate: '2023-11-14T13:30', endDate: '2023-11-14T15:20', title: 'COMP3278'},
// ];

// appointments = [{
//   title: 'Website Re-Design Plan',
//   startDate: new Date(2018, 5, 25, 9, 35),
//   endDate: new Date(2018, 5, 25, 11, 30),
//   id: 0,
//   rRule: 'FREQ=DAILY;COUNT=3',
// }, {
//   title: 'Book Flights to San Fran for Sales Trip',
//   startDate: new Date(2018, 5, 25, 12, 11),
//   endDate: new Date(2018, 5, 25, 13, 0),
//   id: 1,
//   rRule: 'FREQ=DAILY;COUNT=4',
//   exDate: '20180627T091100Z',
// }, {
//   title: 'Install New Router in Dev Room',
//   startDate: new Date(2018, 5, 25, 13, 30),
//   endDate: new Date(2018, 5, 25, 14, 35),
//   id: 2,
//   rRule: 'FREQ=DAILY;COUNT=5',
// }];

export default () => {
//  const data = [
//    { startDate: '2023-11-16T14:30', endDate: '2023-11-16T15:20', title: 'COMP3278'},
//  ]
  const [schedulerData, setschedulerData] = React.useState([]);
  
  React.useEffect(() => {
    fetchData();
  }, []);
  
  function fetchData() {
    fetch(`http://localhost:5000/course_schedule/${sessionStorage.getItem('user')}`, {
      method: 'GET',
    })
    .then((response) => response.json()).then((responseJson) => {
      let data = []

      let date = new Date()
        responseJson.forEach(element => {
          let temp = {}
          let tmpstart = `2023-09-04T${element.start_time}`
          let tmpend = `2023-09-04T${element.end_time}`
          temp.title = `${element.course_code} ${element.class_type}`
          if(element.weekday == 2){
            tmpstart = `2023-09-05T${element.start_time}`
            tmpend = `2023-09-05T${element.end_time}`
          }
          else if(element.weekday == 3){
            tmpstart = `2023-09-06T${element.start_time}`
            tmpend = `2023-09-06T${element.end_time}`
          }
          else if(element.weekday == 4){
            tmpstart = `2023-09-07T${element.start_time}`
            tmpend = `2023-09-07T${element.end_time}`
          }
          else if(element.weekday == 5){
            tmpstart = `2023-09-01T${element.start_time}`
            tmpend = `2023-09-01T${element.end_time}`
          }
          temp.startDate = tmpstart;
          temp.endDate = tmpend;
          temp.rRule = 'FREQ=WEEKLY;UNTIL=20231201',

          data.push(temp)
          console.log('data', data)
        });
        setschedulerData(data)
    })
    .catch(function(error) {
      console.error('Error getting timetable: ', error);
    });
  };


    
  return (
    <Paper>
      {schedulerData.length != 0 ?
        // <div>{schedulerData}</div>
        <Scheduler
        data={schedulerData}
        // height={500}
        sx={{ display: "absolute", left:0, right:0, height: "100vh", width: "100vw" }}
        firstDayOfWeek={0}
        >
        {/* <view>
        {console.log('return schedulerData', schedulerData)}
        </view> */}
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
        {/* <AppointmentForm  />  // edit appointment
        <AppointmentForm readOnly /> */}
      </Scheduler>
      : <div>Loading timetable</div>
      }
      {/* <div>{schedulerData[0]}</div> */}
      
    </Paper>
  );
};
