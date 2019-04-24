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
import { loadingWaiting } from '../../containers/AppointmentPage/actions';


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
    const { loadWaitingAppointments,loadingCalendar } = this.props;
    loadWaitingAppointments();
    loadingCalendar(true)
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

  render() {
    const {
      waitingAppointments,
      waitingIndex,
      openAddingAppointment,
      calendarMembers,
      disableCalendar,
      isLoadWaiting,
      isLoadCalendar
    } = this.props;
    return (
      <CalendarWrapper>
        <MainCalendar>
         {isLoadCalendar === true && <CalendarLoading />}
          <FCAgenda 
          disableCalendar={disableCalendar}
          options={MAIN_CALENDAR_OPTIONS} />
        </MainCalendar>
        <RightSideBar id="drag-zone">
        {isLoadWaiting === true && <WaitingLoading />}
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
