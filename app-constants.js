export const API_PORT = 8010;
export const DEV_API_BASE_URL = `https://hp-api-dev.azurewebsites.net/api`;
export const PROD_API_BASE_URL = `https://hp-api-dev.azurewebsites.net/api`;

export const API_BASE_URL =
  process.env.NODE_ENV === 'production' ? PROD_API_BASE_URL : DEV_API_BASE_URL;

export const GET_MEMBERS_API = `${API_BASE_URL}/Staff`;
export const GET_WAITING_APPOINTMENTS_API = `${API_BASE_URL}/Appointments/Waiting`;
export const GET_APPOINTMENTS_BY_MEMBERS_DATE_API = `${API_BASE_URL}/Appointments/Member`;
export const POST_ASSIGN_APPOINTMENT_API = `${API_BASE_URL}/AppointmentV2/DragDrop`;
export const POST_MOVE_APPOINTMENT_API = `${API_BASE_URL}/AppointmentV2/DragDrop`;
export const POST_PUT_BACK_APPOINTMENT_API = `${API_BASE_URL}/appointments/back`;
export const POST_CANCEL_APPOINTMENT_API = `${API_BASE_URL}/appointments/cancel`;
export const POST_STATUS_APPOINTMENT_API = `${API_BASE_URL}/AppointmentV2/Update`;
export const POST_UPDATE_STATUS_APPOINTMENT_API = `${API_BASE_URL}/AppointmentV2/UpdateStatus`;
export const POST_CHECK_PHONE_CUSTOMER = `${API_BASE_URL}/AppointmentV2/FindUserByPhone`;
export const POST_DETAIL_APPOINTMENT = `${API_BASE_URL}/AppointmentV2`;


