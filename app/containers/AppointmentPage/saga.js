import { delay } from 'redux-saga';
import { call, fork, put, takeLatest, all, select } from 'redux-saga/effects';
import moment from 'moment';
import axios from 'axios';
import getURLParam from 'utils/helper'
import request from 'utils/request';

import {
  SELECT_DAY,
  SELECT_DAY_CALENDAR,
  LOAD_MEMBERS,
  SET_DISPLAYED_MEMBERS,
  LOAD_APPOINTMENTS_BY_MEMBERS,
  LOAD_WAITING_APPOINTMENT,
  ASSIGN_APPOINTMENT,
  MOVE_APPOINTMENT,
  PUT_BACK_APPOINTMENT,
  UPDATE_STATUS_APPOINTMENT,
  CANCEL_APPOINTMENT,
  UPDATE_STATUS_APPOINTMENT_SUCCESS,
  UPDATE_CALENDAR_INTERVAL,
  UPDATE_APPOINTMENT_STATUS,
  ADD_CUSTOMER,
  CHECK_PHONE_ADD_CUSTOMER,
} from './constants';
import {
  selectDay,
  selectWeek,
  membersLoaded,
  memberLoadingError,
  setDisplayedMembers,
  waitingAppointmentsLoaded,
  waitingAppointmentLoadingError,
  loadAppointmentByMembers,
  appointmentByMembersLoaded,
  appointmentByMemberLoadingError,
  appointmentAssigned,
  appointmentAssigningError,
  appointmentMoved,
  appointmentMovingError,
  appointmentPutBack,
  appointmentPuttingBackError,
  deselectAppointment,
  appointmentCanceled,
  appointmentCancellingError,
  appointmentUpdatedStatus,
  appointmentUpdatingStatusError,
  updateAppointmentError,
  updateAppointmentSuccess,
  addCustomer,
  addCustomerSuccess,
  addCustomerError,
  checkPhoneNumberCustomer,
  checkPhoneNumberCustomerSuccess,
  checkPhoneNumberCustomerError,
  loadWaitingAppointments,
  loadingWaiting,
  loadingCalendar,
} from './actions';
import {
  makeCurrentDay,
  makeSelectCalendarAppointments,
  makeSelectDisplayedMembers,
  makeSelectFCEvent,
} from './selectors';

import {
  GET_MEMBERS_API,
  GET_WAITING_APPOINTMENTS_API,
  GET_APPOINTMENTS_BY_MEMBERS_DATE_API,
  POST_ASSIGN_APPOINTMENT_API,
  POST_MOVE_APPOINTMENT_API,
  // POST_PUT_BACK_APPOINTMENT_API
  // POST_CANCEL_APPOINTMENT_API
  POST_STATUS_APPOINTMENT_API,
  POST_UPDATE_APPOINTMENT_API,
  POST_CHECK_PHONE_CUSTOMER,
  POST_DETAIL_APPOINTMENT,
  POST_ADD_CUSTOMER,
  BASE_URL,
  API_BASE_URL,
  token,
  storeid,
  VAR_DEFAULT_AVATAR_PATH
} from '../../../app-constants';

// import { members as mockedMembers } from '../../assets/mocks/members';
// import { appointments as mockedAppointments } from '../../assets/mocks/appointments';
import { assignAppointment as mockedPostAppointment } from '../../assets/mocks/assignAppointment';
import {
  addEventsToCalendar,
  deleteEventFromCalendar,
  updateEventFromCalendar,
} from '../../components/Calendar/constants';

/* **************************** API Caller ********************************* */

const headers = {
  'Content-Type': 'application/json',
  Authorization: `Bearer ${token}`,
};

const statusConvertKey = {
  unconfirm: 'ASSIGNED',
  confirm: 'CONFIRMED',
  checkin: 'CHECKED_IN',
  paid: 'PAID',
  waiting: 'WAITING',
  cancel: 'CANCEL',
};

const appointmentAdapter = appointment => {
  const options = [];
  if (appointment.options && appointment.options.service) {
    appointment.options.service.forEach(service => {
      options.push({
        id: service.id,
        name: service.name,
        duration: service.duration,
        price: service.price,
      });
    });
  }
  // if (appointment.options && appointment.options.product) {
  //   appointment.options.product.forEach(service => {
  //     options.push(service.name);
  //   });
  // }
  // if (appointment.options && appointment.options.extra) {
  //   appointment.options.extra.forEach(service => {
  //     options.push(service.name);
  //   });
  // }
  // console.log(appointment);
  return {
    id: appointment.id,
    userFullName: appointment.userFullName,
    phoneNumber: appointment.phoneNumber,
    options,
    status: statusConvertKey[appointment.status],
    memberId: appointment.staffId,
    start: appointment.start,
    end: appointment.end,
  };
};

const memberAdapter = member => ({
  id: member.id,
  title: `${member.first_name} ${member.last_name}`,
  imageUrl:
    (member.imageurl && `${BASE_URL}/${member.imageurl}`) ||
    `${BASE_URL}/${VAR_DEFAULT_AVATAR_PATH}`,
  orderNumber: member.orderNumber,
});

const statusConvertData = {
  ASSIGNED: 'unconfirm',
  CONFIRMED: 'confirm',
  CHECKED_IN: 'checkin',
  PAID: 'paid',
  WAITING: 'waiting',
  CANCEL: 'cancel',
};

const statusAdapter = status => statusConvertData[status]



export function* getMembers() {
  try {
    /* |||||||||||||||||||||| MOCKED DATA BLOCK |||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    // yield delay(200);
    // const members = mockedMembers;
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

    /* ------------------ REAL DATA FROM API BLOCK ------------------- */
    /* --------------------------------------------------------------- */

    const requestURL = new URL(`${GET_MEMBERS_API}/${storeid}`);
    const response = yield call(request, requestURL.toString(), {
      method: 'POST',
      headers,
    });
    const members =
      response &&
      response.data &&
      response.data.map(member => memberAdapter(member));
    /* --------------------------------------------------------------- */
    /* --------------------------------------------------------------- */
    yield put(membersLoaded(members));
    yield put(setDisplayedMembers(members.slice(0, 6)));
  } catch (err) {
    yield put(memberLoadingError(err));
  }
}

export function* getWaitingAppointments() {
  // Query params for this api
  const apiWaitingListStatusQuery = 'waiting';

  try {
    /* |||||||||||||||||||||| MOCKED DATA BLOCK |||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    // yield delay(200);
    // const appointments = mockedAppointments.filter(
    //   app => app.status === apiWaitingListStatusQuery,
    // );
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

    /* ------------------ REAL DATA FROM API BLOCK ------------------- */
    /* --------------------------------------------------------------- */
    yield put(loadingWaiting(true))
    const requestURL = new URL(GET_WAITING_APPOINTMENTS_API);
    const currentDate = yield select(makeCurrentDay());
    const apiDateQuery =
      currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');

    let formDataWaitingListSaga = new FormData();
    formDataWaitingListSaga.append("date", apiDateQuery);
    formDataWaitingListSaga.append("storeid", storeid);
    formDataWaitingListSaga.append("status", apiWaitingListStatusQuery);

    const response = yield call(request, requestURL.toString(), {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formDataWaitingListSaga
    });
    if(response){
      yield put(loadingWaiting(false))
    }

    const appointments =
      response &&
      response.data &&
      response.data.map(appointment => appointmentAdapter(appointment));
    yield put(waitingAppointmentsLoaded(appointments));
  } catch (err) {
    yield put(waitingAppointmentLoadingError(err));
  }
}

export function* getAppointmentsByMembersAndDate() {
  const displayedMembers = yield select(makeSelectDisplayedMembers());
  const currentDate = yield select(makeCurrentDay());
  let apiDateQuery =
    currentDate.format('YYYY-MM-DD') || moment().format('YYYY-MM-DD');
  const apiMemberIdsQuery = displayedMembers.map(member => member.id);
  try {

    const requestURL = new URL(GET_APPOINTMENTS_BY_MEMBERS_DATE_API);
    const requestBody = JSON.stringify({
      date: apiDateQuery,
      memberId: apiMemberIdsQuery,
    });

    const response = yield call(request, requestURL.toString(), {
      method: 'POST',
      headers,
      body: requestBody,
    });
    if(response){
     yield put(loadingCalendar(false))
    }

    const appointments =
      response &&
      response.data &&
      response.data.map(appointment => appointmentAdapter(appointment));

    /* --------------------------------------------------------------- */
    /* --------------------------------------------------------------- */
    const appointmentsMembers = displayedMembers.map(member => ({
      memberId: member.id,
      appointments: appointments.filter(
        appointment => appointment.memberId === member.id && appointment.status !== 'CANCEL',
      ),
    }));

    yield put(appointmentByMembersLoaded(appointmentsMembers));
    // Update main calendar
    addEventsToCalendar(currentDate, appointmentsMembers);
  } catch (err) {
    yield put(appointmentByMemberLoadingError(err));
  }
}

export function* assignAppointment(action) {
  yield put(loadingWaiting(true));
  const displayedMembers = yield select(makeSelectDisplayedMembers());
  const assignedMember = displayedMembers[action.resourceId];
  const appointment = {
    ...action.eventData,
    memberId: assignedMember.id,
  };
  try {
    const { id, memberId, start, end } = appointment;
    let formdt = new FormData();
    formdt.append('id', id)
    const kq = yield detail_Appointment(POST_DETAIL_APPOINTMENT + '/id', formdt);
    var totalduration = 0;
    const servicesUpdate = kq.data.data.bookingServices2;
    for (let i = 0; i < servicesUpdate.length; i++) {
      const index = servicesUpdate[i].search('@');
      totalduration += parseInt(servicesUpdate[i].charAt(index + 1) + servicesUpdate[i].charAt(index + 2));
    }
    const requestURL = new URL(POST_STATUS_APPOINTMENT_API);
    put(loadWaitingAppointments());
    const result = yield drag_Appointment(requestURL.toString(), {
      id,
      Staff_id: memberId,
      StoreId: storeid,
      FromTime: start,
      ToTime: moment(start).add(totalduration, 'minutes').format().substr(0, 19),
      total: 0,
      duration: 0,
      CheckinStatus: "checkin",
      PaidStatus: true,
      Status: 1,
      CreateDate: new Date().toString().substring(0, 15),
      User_id: kq.data.data.user_id
    });

    if (result) {
      yield put(loadingWaiting(false));
      yield put(appointmentAssigned(appointment));
    } else {
      yield put(appointmentAssigningError(result));
    }
  } catch (err) {
    yield put(appointmentAssigningError(err));
  }
}

export function* moveAppointment(action) {
  const displayedMembers = yield select(makeSelectDisplayedMembers());
  const calendarMembers = yield select(makeSelectCalendarAppointments());
  const assignedMember = displayedMembers[action.newPositionIndex];

  const oldMemberPosition = calendarMembers.find(member =>
    member.appointments.find(
      appointment => appointment.id === action.appointmentId,
    ),
  );
  if (!oldMemberPosition) {
    yield put(appointmentMovingError('Cannot find previous position.'));
  }

  const movedAppointment = oldMemberPosition.appointments.find(
    appointment => appointment.id === action.appointmentId,
  );
  if (!movedAppointment) {
    yield put(appointmentMovingError('Cannot find moved appointment.'));
  }

  const appointment = {
    ...movedAppointment,
    start: action.newTime,
    end: action.newEndTime,
    memberId: assignedMember.id,
  };

  let formdt = new FormData();
  formdt.append('id', movedAppointment.id);
  var start = movedAppointment.start;
  var end = movedAppointment.end;
  var newTime = (Date.parse(end) - Date.parse(start));
  var minutes = Math.floor(newTime / 60000);
  var ToTime = moment(appointment.start).add(minutes, 'minutes').format();
  try {
    /* |||||||||||||||||||||| MOCKED DATA BLOCK |||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    // yield delay(200);
    // const result = mockedPostAppointment;
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

    /* ------------------ REAL DATA FROM API BLOCK ------------------- */
    /* --------------------------------------------------------------- */
    // const requestURL = new URL(POST_MOVE_APPOINTMENT_API);
    // const formData = new FormData();
    // formData.append('FromTime', appointment.start);
    // formData.append('staff_id', appointment.memberId);
    // formData.append('appointment_id', appointment.id);
    // const result = dragAppointment(requestURL.toString(), formData);
    /* --------------------------------------------------------------- */
    /* --------------------------------------------------------------- */


    const kq = yield detail_Appointment(POST_DETAIL_APPOINTMENT + '/id', formdt);
    const requestURL = new URL(POST_STATUS_APPOINTMENT_API);
    const result = yield update_Appointment(requestURL.toString(), {
      id: appointment.id,
      Staff_id: appointment.memberId,
      StoreId: storeid,
      FromTime: appointment.start,
      ToTime: ToTime.substr(0, 19),
      total: kq.data.data.total,
      duration: kq.data.data.duration,
      CheckinStatus: kq.data.data.checkinStatus,
      PaidStatus: true,
      Status: 1,
      CreateDate: new Date().toString().substring(0, 15),
      BookingServices2: kq.data.data.bookingServices2,
      User_id: kq.data.data.user_id,
    });

    if (result) {
      yield put(appointmentMoved(appointment));
    } else {
      yield put(appointmentMovingError(result));
    }
  } catch (err) {
    yield put(appointmentMovingError(err));
  }
}

export function* putBackAppointment(action) {
  try {
    /* |||||||||||||||||||||| MOCKED DATA BLOCK |||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    yield delay(200);
    // const result = mockedPostAppointment;

    const { id, memberId, start, end } = action.appointment;
    let formdt = new FormData();
    formdt.append('id', id)
    const kq = yield detail_Appointment(POST_DETAIL_APPOINTMENT + '/id', formdt);
    const requestURL = new URL(POST_STATUS_APPOINTMENT_API);
    const result = drag_Appointment(requestURL.toString(), {
      id,
      Staff_id: memberId,
      StoreId: 1,
      FromTime: start,
      ToTime: end,
      total: 0,
      duration: 0,
      CheckinStatus: "waiting",
      PaidStatus: true,
      Status: 1,
      CreateDate: new Date().toString().substring(0, 15),
      User_id: kq.data.data.user_id,
    })

    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

    /* ------------------ REAL DATA FROM API BLOCK ------------------- */
    /* --------------------------------------------------------------- */
    // const requestURL = new URL(POST_PUT_BACK_APPOINTMENT_API);
    // const options = {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     appointmentId: action.appointment.id,
    //   }),
    // };
    // const result = yield call(request, requestURL.toString(), options);
    /* --------------------------------------------------------------- */
    /* --------------------------------------------------------------- */
    if (result) {
      yield put(appointmentPutBack(action.appointment));
    } else {
      yield put(appointmentPuttingBackError(result));
    }
  } catch (err) {
    yield put(appointmentPuttingBackError(err));
  }
}

export function* cancelAppointment(action) {
  const fcEvent = yield select(makeSelectFCEvent());

  if (!fcEvent) {
    yield put(appointmentCancellingError('Cannot find selected fcEvent'));
  }

  try {
    /* |||||||||||||||||||||| MOCKED DATA BLOCK |||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    yield delay(200);
    const result = mockedPostAppointment;
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

    /* ------------------ REAL DATA FROM API BLOCK ------------------- */
    /* --------------------------------------------------------------- */
    // const requestURL = new URL(POST_CANCEL_APPOINTMENT_API);
    // const options = {
    //   method: 'POST',
    //   body: JSON.stringify({
    //     appointmentId: action.appointmentId,
    //   }),
    // };
    // const result = yield call(request, requestURL.toString(), options);
    /* --------------------------------------------------------------- */
    /* --------------------------------------------------------------- */
    if (result) {
      yield put(appointmentCanceled(action.appointmentId));
      /* eslint no-underscore-dangle: ["error", { "allow": ["_id"] }] */
      deleteEventFromCalendar(fcEvent._id);
      yield put(deselectAppointment());
    } else {
      yield put(appointmentCancellingError(result));
    }
  } catch (err) {
    yield put(appointmentCancellingError(err));
  }
}

export function* updateStatusAppointment(action) {
  const fcEvent = yield select(makeSelectFCEvent());

  if (!fcEvent) {
    yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
  }

  try {
    /* |||||||||||||||||||||| MOCKED DATA BLOCK |||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    // yield delay(200);
    // const result = mockedPostAppointment;
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */
    /* ||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||| */

    /* ------------------ REAL DATA FROM API BLOCK ------------------- */
    /* --------------------------------------------------------------- */
    const requestURL = new URL(POST_STATUS_APPOINTMENT_API);
    // const formData = new FormData();
    // formData.append('id', fcEvent.data.id);
    // formData.append('Staff_id', fcEvent.data.memberId);
    // formData.append('StoreId', 1);
    // formData.append('FromTime', fcEvent.data.start);
    // formData.append('ToTime', fcEvent.data.end);
    // formData.append('TipPercent', 1);
    // formData.append('User_id', 1);
    // formData.append('total', 1);
    // formData.append('duration', 1);
    // formData.append('waitingtime', 1);
    // formData.append('CheckinStatus', statusAdapter(fcEvent.data.status));
    // formData.append('PaidStatus', 'false');
    // formData.append('Status', 1);
    // formData.append('CreateDate', fcEvent.data.start);
    // formData.append(
    //   'BookingServices2',
    //   `[${action.bookingServices.join(', ')}]`,
    // );
    // const result = dragAppointment(requestURL.toString(), formData);

    let status = statusAdapter(fcEvent.data.status);

    if (status == 'UnConfirm') {
      status = 'Confirm';
    } else if (status == 'Confirm') {
      status = 'CheckIn';
    } else if (status == 'CheckIn') {
      status = 'Paid';
    }

    const options = {
      method: 'POST',
      headers,
      body: JSON.stringify({
        id: fcEvent.data.id,
        Staff_id: fcEvent.data.memberId,
        StoreId: storeid,
        FromTime: fcEvent.data.start,
        ToTime: fcEvent.data.end,
        TipPercent: null,
        User_id: null,
        total: 1,
        duration: 1,
        waitingtime: 1,
        CheckinStatus: status,
        PaidStatus: false,
        Status: 1,
        CreateDate: fcEvent.data.start,
        BookingServices2: action.bookingServices,
      }),
    };
    const result = yield call(request, requestURL.toString(), options);
    /* --------------------------------------------------------------- */
    /* --------------------------------------------------------------- */
    if (result) {
      yield put(appointmentUpdatedStatus(action.appointmentId));
      updateEventFromCalendar(fcEvent);
      yield put(deselectAppointment());
    } else {
      yield put(appointmentUpdatingStatusError(result));
    }
  } catch (err) {
    yield put(appointmentUpdatingStatusError(err));
  }
}

export function* upddateAppointment(action) {
  try {
    const fcEvent = yield select(makeSelectFCEvent());
    if (!fcEvent) {
      yield put(appointmentUpdatingStatusError('Cannot find selected fcEvent'));
    }

    const { appointment, total, duration, BookingServices2, status, old_duration } = action.appointment;
    const { memberId, start, end, id } = appointment;

    if (status === 'unconfirm') {
      fcEvent.data.status = 'ASSIGNED';
    } else if (status === 'confirm') {
      fcEvent.data.status = 'CONFIRMED';
    } else if (status === 'checkin') {
      fcEvent.data.status = 'CHECKED_IN';
    }
    let formdt = new FormData();
    formdt.append('id', id);
    var newDate;
    //status to update
    if (status === 'checkin' || status === 'confirm') {
      if (parseInt(old_duration) > parseInt(duration)) {
        const newDuration = parseInt(old_duration) - parseInt(duration);
        newDate = moment(end).subtract(newDuration, 'minutes').format();
      } else {
        const newDuration = parseInt(duration) - parseInt(old_duration);
        newDate = moment(end).add(newDuration, 'minutes').format();
      }
    } else {
      newDate = moment(end).add(duration, 'minutes').format();
    }
    yield put(appointmentUpdatedStatus(appointment.id));
    updateEventFromCalendar(fcEvent);

    const kq = yield detail_Appointment(POST_DETAIL_APPOINTMENT + '/id', formdt);
    const requestURL = new URL(POST_STATUS_APPOINTMENT_API);
    const result = yield update_Appointment(requestURL.toString(), {
      id,
      Staff_id: memberId,
      StoreId: storeid,
      FromTime: start,
      ToTime: newDate.substr(0, 19),
      total: total,
      duration: duration,
      CheckinStatus: action.appointment.status,
      PaidStatus: true,
      Status: 1,
      CreateDate: new Date().toString().substring(0, 15),
      BookingServices2: BookingServices2,
      User_id: kq.data.data.user_id,
    });
    if (result) {
      yield put(updateAppointmentSuccess(result))
    } else {
      yield put(updateAppointmentError(error))
    }
  }
  catch (error) {
    yield put(updateAppointmentError(error))
  }
}


export function* addNewCustomer(action) {
  try {
    const { first_name, last_name, phoneNumber } = action.customer;
    const result = yield axios.post(POST_ADD_CUSTOMER, {
      first_name, last_name, phone: phoneNumber
    }, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      }
    );
    if (result.data.codeStatus === 1) {
      const id = result.data.data
      window.postMessage(JSON.stringify({
        consumerId: id,
        action: 'newAppointment'
      }))
      yield put(addCustomerSuccess(true))
    } else {
      yield put(addCustomerSuccess(true))
    }
  } catch (error) {
    yield put(addCustomerError(error))
  }
}

export function* checkPhoneCustomer(action) {
  try {
    let formdt = new FormData();
    formdt.append('phone', action.phone);
    const result = yield axios.post(POST_CHECK_PHONE_CUSTOMER, formdt, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    });
    if (result.data.data === "{}") {
      yield put(checkPhoneNumberCustomerSuccess(true))
    } else {
      window.postMessage(JSON.stringify({
        consumerId: result.data.data.user_id,
        action: 'newAppointment'
      }));
      yield put(checkPhoneNumberCustomerError(true));
    }
  } catch (error) {
    yield put(checkPhoneNumberCustomerError(error))
  }
}





/* **************************** Subroutines ******************************** */

export function* selectDayAndWeek(action) {
  yield put(selectDay(action.day));
  yield put(selectWeek(action.day));
}

export function* getDisplayedMembers() {
  yield put(loadAppointmentByMembers());
}

/* ************************************************************************* */
/* ****************************** WATCHERS ********************************* */
/* ************************************************************************* */

export function* selectDayOnCalendar() {
  yield takeLatest(SELECT_DAY_CALENDAR, selectDayAndWeek);
}


export function* membersData() {
  yield takeLatest(LOAD_MEMBERS, getMembers);
}

export function* waitingAppointmentsData() {
  yield takeLatest(LOAD_WAITING_APPOINTMENT, getWaitingAppointments);
}

export function* appointmentsByMembersData() {
  yield takeLatest(
    LOAD_APPOINTMENTS_BY_MEMBERS,
    getAppointmentsByMembersAndDate,
  );
  // yield takeLatest(
  //   UPDATE_STATUS_APPOINTMENT_SUCCESS,
  //   getAppointmentsByMembersAndDate,
  // );
  yield takeLatest(SELECT_DAY, getAppointmentsByMembersAndDate);

  // FIXME: This is hard code for real-time calendar
  // yield takeLatest(UPDATE_CALENDAR_INTERVAL, getAppointmentsByMembersAndDate);
}

export function* displayedMembersData() {
  yield takeLatest(SET_DISPLAYED_MEMBERS, getDisplayedMembers);
}

export function* assignAppointmentData() {
  yield takeLatest(ASSIGN_APPOINTMENT, assignAppointment);
}

export function* moveAppointmentData() {
  yield takeLatest(MOVE_APPOINTMENT, moveAppointment);
}

export function* putBackAppointmentData() {
  yield takeLatest(PUT_BACK_APPOINTMENT, putBackAppointment);
}

export function* updateStatusAppointmentData() {
  yield takeLatest(UPDATE_STATUS_APPOINTMENT, updateStatusAppointment);
}

export function* cancelAppointmentData() {
  yield takeLatest(CANCEL_APPOINTMENT, cancelAppointment);
}

export function* updateAppointmentStatus() {
  yield takeLatest(UPDATE_APPOINTMENT_STATUS, upddateAppointment)
}
export function* add_Customer() {
  yield takeLatest(ADD_CUSTOMER, addNewCustomer)
}
export function* check_Phone() {
  yield takeLatest(CHECK_PHONE_ADD_CUSTOMER, checkPhoneCustomer)
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* root() {
  yield all([
    fork(selectDayOnCalendar),
    fork(membersData),
    fork(waitingAppointmentsData),
    fork(displayedMembersData),
    fork(appointmentsByMembersData),
    fork(assignAppointmentData),
    fork(moveAppointmentData),
    fork(putBackAppointmentData),
    fork(updateStatusAppointmentData),
    fork(cancelAppointmentData),
    fork(updateAppointmentStatus),
    fork(add_Customer),
    fork(check_Phone),

  ]);
}

async function dragAppointment(api, formData) {
  return axios({
    method: 'POST',
    url: api,
    data: formData,
    headers,
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  });
}

async function drag_Appointment(api, data) {
  return axios({
    method: 'POST',
    url: api,
    data: data,
    headers,
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });
}


async function update_Appointment(api, data) {
  return axios({
    method: 'POST',
    url: api,
    data: data,
    headers,
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    },
  });
}

async function detail_Appointment(api, data) {
  return axios({
    method: 'POST',
    url: api,
    data: data,
    headers,
    config: {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  });
}



