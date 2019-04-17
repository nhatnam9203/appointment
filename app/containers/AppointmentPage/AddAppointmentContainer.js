import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { compose } from 'redux';

import AddAppointment from 'components/AddAppointment';

import { makeAddingAppointment,makeCheckPhoneSuccess,makeCheckPhoneError } from './selectors';
import { closeAddingAppointment,checkPhoneNumberCustomer,addCustomer,checkPhoneNumberCustomerSuccess,checkPhoneNumberCustomerError } from './actions';

export function mapDispatchToProps(dispatch) {
  return {
    closeAddingAppointment: () => dispatch(closeAddingAppointment()),
    checkPhoneNumberCustomer:(phone)=>dispatch(checkPhoneNumberCustomer(phone)),
    checkPhoneNumberCustomerSuccess:(phone)=>dispatch(checkPhoneNumberCustomerSuccess(phone)),
    checkPhoneNumberCustomerError:(error)=>dispatch(checkPhoneNumberCustomerError(error)),
    addCustomer:(customer)=>dispatch(addCustomer(customer))
  };
}

const mapStateToProps = createStructuredSelector({
  appointment: makeAddingAppointment(),
  checkPhoneSuccess : makeCheckPhoneSuccess(),
  checkPhoneError : makeCheckPhoneError(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  //
  withConnect,
)(AddAppointment);
