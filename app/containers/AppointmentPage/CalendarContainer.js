import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import Calendar from 'components/Calendar';

import {
  loadWaitingAppointments,
  openAddingAppointment,
  updateCalendarInterval,
  updateWaitingAppointment
} from './actions';
import {
  makeSelectWaitingAppointments,
  makeSelectWaitingIndexAppointments,
  makeCurrentDay
} from './selectors';

export function mapDispatchToProps(dispatch) {
  return {
    loadWaitingAppointments: day => dispatch(loadWaitingAppointments(day)),
    openAddingAppointment: app => dispatch(openAddingAppointment(app)),
    updateCalendarInterval: app => dispatch(updateCalendarInterval(app)),
    updateWaitingAppointment : appointment => dispatch(updateWaitingAppointment(appointment))
  };
}

const mapStateToProps = createStructuredSelector({
  waitingAppointments: makeSelectWaitingAppointments(),
  currentDay: makeCurrentDay(),
  waitingIndex: makeSelectWaitingIndexAppointments(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(Calendar);
