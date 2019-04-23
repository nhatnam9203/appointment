import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Calendar from 'components/Calendar';

import {
  loadWaitingAppointments,
  openAddingAppointment,
  updateCalendarInterval,
  updateWaitingAppointment,
  loadingCalendar,
  loadingWaiting,
} from './actions';
import {
  makeSelectWaitingAppointments,
  makeSelectWaitingIndexAppointments,
  makeCurrentDay,
  makeSelectCalendarAppointments,
  makeDisableCalendar,
  makeLoadCalendar,
  makeLoadWaiting,
} from './selectors';

export function mapDispatchToProps(dispatch) {
  return {
    loadWaitingAppointments: day => dispatch(loadWaitingAppointments(day)),
    openAddingAppointment: app => dispatch(openAddingAppointment(app)),
    updateCalendarInterval: app => dispatch(updateCalendarInterval(app)),
    updateWaitingAppointment : appointment => dispatch(updateWaitingAppointment(appointment)),
    loadingCalendar: status=>dispatch(loadingCalendar(status)),
    loadingWaiting: status=>dispatch(loadingWaiting(status)),
  };
}

const mapStateToProps = createStructuredSelector({
  waitingAppointments: makeSelectWaitingAppointments(),
  currentDay: makeCurrentDay(),
  waitingIndex: makeSelectWaitingIndexAppointments(),
  calendarMembers: makeSelectCalendarAppointments(),
  disableCalendar : makeDisableCalendar(),
  isLoadWaiting : makeLoadWaiting(),
  isLoadCalendar : makeLoadCalendar(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(Calendar);
