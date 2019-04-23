import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

import FCAgenda from './FCAgenda';
import FCDragZone from './FCDragZone';

import { MAIN_CALENDAR_OPTIONS } from './constants';
import axios from 'axios'

import {
  GET_WAITING_APPOINTMENTS_API,
  token,
  storeid
} from '../../../app-constants';
import WaitingLoading from './WaitingLoading'
import CalendarLoading from './CalendarLoading'


const CalendarWrapper = styled.div`
  display: flex;
  border-left: 2px solid #3883bb;
  border-right: 2px solid #3883bb;
  border-bottom: 2px solid #3883bb;
  height: calc(100% - 4rem - 4rem);
  overflow: hidden;
`;

const MainCalendar = styled.div`
  flex: 1 0;
  border-right: 1px solid #3883bb;
`;

const RightSideBar = styled.div`
  width: calc((100vw - 5.05rem) / 7);
  border-top: 2px solid #3883bb;
  position: relative;
`;

const SignInWrapper = styled.div`
  position: absolute;
  bottom: 0;
  width: calc((100vw - 5.05rem) / 7);
  background: #fafafa;
  height: 4rem;
  text-align: center;
  padding: 0.5rem;
`;

SignInWrapper.Button = styled.div`
  border-radius: 4px;
  background: #0071c5;
  color: #ffffff;
  width: 100%;
  font-size: 1rem;
  line-height: 2.8;
  height: 100%;
  cursor: pointer;
`;

class Calendar extends React.Component {

  constructor(){
    super();
    window.Calendar = this;
  }

  componentWillMount() {
    const { loadWaitingAppointments } = this.props;
    loadWaitingAppointments();
  }

  reloadComponent = (section) => {
    switch (section) {
      case 'calendar':
      this.props.updateCalendarInterval();
        break;
      case 'waitinglist':
      this.props.loadWaitingAppointments();
        break;
      default:
        break;
    }
  }

  // FIXME: This is hard code for real-time calendar
  // componentDidMount() {
  //   const { updateCalendarInterval } = this.props;
  //   setInterval(() => {
  //     updateCalendarInterval();
  //     // this.checkWaiting5s(this.props.waitingAppointments)
  //   }, 8000);
  // }

  // checkWaiting5s = (waitingAppointments) => {
  //   alert('check Waiting5s');
  //   var apiWaitingListStatusQuery = 'waiting';
  //   var requestURL = new URL(GET_WAITING_APPOINTMENTS_API);
  //   var currentDate = this.props.currentDay;
  //   // Query params for this api
  //   var apiDateQuery =
  //     currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

  //   var formDataWaitingListReload = new FormData();
  //   formDataWaitingListReload.set('date', apiDateQuery);
  //   formDataWaitingListReload.set('storeid', storeid);
  //   formDataWaitingListReload.set('status', apiWaitingListStatusQuery);

  //   axios.post(requestURL, formDataWaitingListReload, {
  //     headers: {
  //       Authorization: `Bearer ${token}`,
  //       'Content-Type': 'multipart/form-data'
  //     }
  //   }).then(result => {
  //     const WaitingList = result.data.data;
  //     if(waitingAppointments){
  //       if((WaitingList.length > waitingAppointments.length)){
  //         this.props.loadWaitingAppointments();
  //       }
  //     }
  //     if(!waitingAppointments){
  //       this.props.loadWaitingAppointments();
  //     }
  //   })
  // }

  render() {
    const {
      waitingAppointments,
      waitingIndex,
      openAddingAppointment,
      calendarMembers,
      disableCalendar
    } = this.props;
    console.log(disableCalendar);
    return (
      <CalendarWrapper>
        <MainCalendar>
         {calendarMembers.length === 0 && <CalendarLoading />}
          <FCAgenda 
          disableCalendar={disableCalendar}
          options={MAIN_CALENDAR_OPTIONS} />
        </MainCalendar>
        <RightSideBar id="drag-zone">
        {waitingAppointments.length === 0 && <WaitingLoading />}
          {!!waitingAppointments && !!waitingAppointments.length ? (
            <FCDragZone events={waitingAppointments} index={waitingIndex} />
          ) : (
              ''
            )}
          <SignInWrapper>
            <SignInWrapper.Button onClick={() => openAddingAppointment({})}>
              Sign in
            </SignInWrapper.Button>
          </SignInWrapper>
        </RightSideBar>
      </CalendarWrapper>
    );
  }
}

Calendar.propTypes = {
  waitingAppointments: PropTypes.any,
  loadWaitingAppointments: PropTypes.func,
  waitingIndex: PropTypes.number,
  openAddingAppointment: PropTypes.func,
  updateCalendarInterval: PropTypes.func,
};

export default Calendar;
