import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import DetailAppointment from 'components/DetailAppointment';

import { makeSelectAppointment } from './selectors';
import {
  cancelAppointment,
  deselectAppointment,
  updateStatusAppointment,
  updateAppointment
} from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    deselectAppointment: () => dispatch(deselectAppointment()),
    cancelAppointment: id => dispatch(cancelAppointment(id)),
    nextStatus: (id, services) =>
      dispatch(updateStatusAppointment(id, services)),
    updateAppointment:(appointment)=>{
      dispatch(updateAppointment(appointment))
    }
  };
}

const mapStateToProps = createStructuredSelector({
  appointment: makeSelectAppointment(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(DetailAppointment);
