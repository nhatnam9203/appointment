import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Popup from 'reactjs-popup';
import moment from 'moment';
import { FaTimesCircle } from 'react-icons/fa';
import Enter from '../../images/enter.png';
import axios from 'axios'
import {token,POST_DETAIL_APPOINTMENT} from '../../../app-constants'


const AppPopup = styled(Popup)`
  border-radius: 1.5rem;
  padding: 0 !important;
  border: none !important;
  overflow-y: scroll;
  height: 450px;
`;

const AppPopupWrapper = styled.div`
  position: relative;
`;

AppPopupWrapper.Header = styled.div`
  height: 3rem;
  font-size: 26px;
  font-weight: bold;
  background: ${props => props.backgroundColor};
  color: #ffffff;
  width: 100%;
  padding: 0.5rem 1rem;
  line-height: 1.5;
  text-align: center;
`;

AppPopupWrapper.Close = styled.div`
  position: absolute;
  right: 0.5rem;
  top: 0.25rem;
  line-height: 1;
  font-size: 2rem;
  color: #ffffff;
  cursor: pointer;
`;

AppPopupWrapper.Body = styled.div`
  background: #ffffff;
  width: 100%;
  padding: 1rem 1rem 0 1rem;
`;

AppPopupWrapper.Footer = styled.div`
  display: flex;
  padding: 0.5rem 1rem 1rem 1rem;
  & > div {
    width: 50%;
    text-align: center;
  }
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //

const AppointmentPopup = styled(AppPopup)`
  width: 50rem !important;
`;

const AppointmentWrapper = styled(AppPopupWrapper)`
  //
`;

AppointmentWrapper.Header = styled(AppPopupWrapper.Header)`
  //
`;

AppointmentWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

AppointmentWrapper.Body = styled(AppPopupWrapper.Body)`
  //
`;

AppointmentWrapper.Footer = styled(AppPopupWrapper.Footer)`
  //
`;

const UserInformation = styled.div`
  display: flex;
  padding: 0.5rem;
  & > div {
    width: 50%;
    display: flex;
    justify-content: space-between;
    padding-right: 1rem;
  }
`;

const AdjustButton = styled.button`
  background: ${props => (props.active ? '#0071c5' : '#dddddd')};
  color: #ffffff;
  padding: 2px 15px;
  margin: 0 10px;
  border-radius: 6px;
  cursor: ${props => (props.active ? 'pointer' : 'initial')};
`;

const NoteWrapper = styled.div`
  border: 1px solid #dddddd;
  background: #eeeeee;
  padding: 0.5rem;
  overflow-x: scroll;
  height: 10rem;
`;

NoteWrapper.Form = styled.form`
  display: flex;
  & > input {
    flex: 1;
    background: #ffffff;
    border: 1px solid #dddddd;
    border-right: none;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    padding: 0 1rem;
  }
  & > button {
    width: 5rem;
    border-top-right-radius: 4px;
    border-bottom-right-radius: 4px;
    background: #0071c5;
    color: #ffffff;
    line-height: 2.8;
    cursor: pointer;
    text-align: center;
  }
`;

const NoteInformation = styled.div`
  display: flex;
  padding: 0.5rem;
  & > div:nth-child(1),
  & > div:nth-child(2) {
    width: 20%;
  }
  & > div:last-child {
    width: 60%;
  }
`;

const AppointmentInformation = styled.div`
  display: flex;
  padding: 0.5rem;
  & > div {
    width: 30%;
    display: flex;
    justify-content: space-between;
    padding-right: 1rem;
  }
`;

const Button = styled.button`
  border-radius: 4px;
  background: ${props => (props.primary ? '#0071c5' : '#eeeeee')};
  color: ${props => (props.primary ? '#ffffff' : '#333333')};
  border: 1px solid #dddddd;
  font-size: 1rem;
  line-height: 2.8;
  height: 100%;
  cursor: pointer;
  text-align: center;
  padding: 0 2rem;
`;

const Img = styled.img`
  filter: invert(100%);
`;

// ************************************************* //
// ************************************************* //
// ************************************************* //

const ConfirmationPopup = styled(AppPopup)`
  width: 30rem !important;
`;

const ConfirmationWrapper = styled(AppPopupWrapper)`
  //
`;

ConfirmationWrapper.Header = styled(AppPopupWrapper.Header)`
  //
`;

ConfirmationWrapper.Body = styled(AppPopupWrapper.Body)`
  text-align: center;
`;

ConfirmationWrapper.Close = styled(AppPopupWrapper.Close)`
  //
`;

ConfirmationWrapper.Footer = styled(AppPopupWrapper.Footer)`
  //
`;


class Appointment extends React.Component {
  state = {
    noteValue: '',
    confirmationModal: false,
    services: [],
    products: [],
    prices: [],
    old_total_duration : 0,
    notes: [
      {
        name: 'Rickie Da Vinci',
        date: '05/22/2018',
        content: "Note about customer's service",
      },
      {
        name: 'Rickie Da Vinci',
        date: '03/14/2018',
        content: "Note about customer's service",
      },
    ],
  };

  subtractService(index) {
    this.setState(state => {
      const { services, prices } = state;
      if (services[index].duration >= 15) {
        services[index].duration -= 15;
        // prices[index] = (services[index].price * (services[index].duration / 10))
      }
      return {
        services,
        //  prices
      };
    });
  }

  addService(index) {
    this.setState(state => {
      const { services, prices } = state;
      services[index].duration += 15;
      // prices[index] = (services[index].price * (services[index].duration / 10))
      return {
        services,
        // prices
      };
    });
  }

  subtractProduct(index) {
    this.setState(state => {
      const { products } = state;
      if (products[index].amount >= 1) {
        products[index].amount -= 1;
      }
      return {
        products,
      };
    });
  }

  addProduct(index) {
    this.setState(state => {
      const { products } = state;
      products[index].amount += 1;
      return {
        products,
      };
    });
  }

  handleSubmit(e) {
    const { notes, noteValue } = this.state;
    e.preventDefault();
    this.setState({
      noteValue: '',
      notes: [
        {
          name: 'Rickie Da Vinci',
          date: moment().format('DD/MM/YYYY'),
          content: noteValue,
        },
        ...notes,
      ],
    });
  }

  handleChange(e) {
    this.setState({ noteValue: e.target.value });
  }

  getTotalPrice() {
    const { services, products } = this.state;
    let total = 0;
    // services.forEach(service => {
    //   total += service.price * (service.duration / 10);
    // });
    this.state.prices.forEach(price => {
      total += parseInt(price)
    })
    products.forEach(product => {
      total += product.price * product.amount;
    });
    return total;
  }

  getTotalDuration() {
    const { services } = this.state;
    let total = 0;
    services.forEach(service => {
      total += service.duration;
    });
    return total;
  }

  closeModal() {
    const { deselectAppointment,disableCalendar } = this.props;
    deselectAppointment();
    disableCalendar(false);
  }

  async componentWillReceiveProps(nextProps) {
    if (nextProps.appointment) {
      await this.setState({
        services: nextProps.appointment.options,
      });
      var {services} = this.state
      let formdt = new FormData();
      formdt.append('id',nextProps.appointment.id)
      axios.post(POST_DETAIL_APPOINTMENT+'/id',formdt,{
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }).then((result) => {
        const servicesUpdate =  result.data.data.bookingServices2;
        var old_duration  = 0;
        for(let i = 0 ; i<services.length;i++){
          services[i].duration = parseInt(servicesUpdate[i].split('@')[1]);
          old_duration += parseInt(services[i].duration);
        }
        this.setState({
          services ,
          old_total_duration : old_duration,
        })
      })

      await this.setState({prices : []})
      for (let i = 0; i < nextProps.appointment.options.length; i++) {
        const price = nextProps.appointment.options[i].price;
        this.setState({
          prices: [...this.state.prices, price]
        })
      }
    }
  }

  openConfirmationModal() {
    this.setState({
      confirmationModal: true,
    });
  }

  closeConfirmationModal() {
    this.setState({
      confirmationModal: false,
    });
  }

  confirmCancelAppointment() {
    this.closeConfirmationModal();
    const { appointment, cancelAppointment,disableCalendar } = this.props;
    const { services } = this.state;
    cancelAppointment(appointment.id);
    const servicesUpdate = services.map(
      service => `${service.id}@${service.duration}@${appointment.memberId}`,
    );
    this.updateStatus("cancel", servicesUpdate);
    disableCalendar(false);
  }

  nextStatus() {
    const { appointment, nextStatus } = this.props;
    const { services } = this.state;
    const servicesUpdate = services.map(
      service => `${service.id}@${service.duration}@${appointment.memberId}`,
    );
    if (appointment.status === "ASSIGNED") {
      this.updateStatus("confirm", servicesUpdate)
    } else if (appointment.status === "CONFIRMED") {
      this.updateStatus("checkin", servicesUpdate)
    } else if (appointment.status === "CHECKED_IN") {
      this.updateStatusPaid(appointment.id);
    } else{
      alert(`status appointment ${appointment.status} id appointment ${appointment.id}`);
    }
    this.closeModal();
    // nextStatus(appointment.id, servicesUpdate);
  }

  updateStatusPaid = (idAppointment) => {
    window.postMessage(JSON.stringify({
      appointmentId: idAppointment,
      action: 'checkout'
    }));
  }


  updateStatus(status, servicesUpdate) {
    const { appointment, updateAppointment } = this.props;
    updateAppointment({
      appointment,
      total: this.getTotalPrice(),
      duration: this.getTotalDuration(),
      BookingServices2: servicesUpdate,
      status,
      old_duration : this.state.old_total_duration
    })
  }

  renderHeader() {
    const { appointment } = this.props;
    if (appointment.status === 'ASSIGNED') {
      return (
        <AppointmentWrapper.Header backgroundColor="#ffe400">
          Unconfirmed Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'CONFIRMED') {
      return (
        <AppointmentWrapper.Header backgroundColor="#98e6f8">
          Confirmed Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'CHECKED_IN') {
      return (
        <AppointmentWrapper.Header backgroundColor="#00b4f7">
          Checked-in Appointment
        </AppointmentWrapper.Header>
      );
    }
    if (appointment.status === 'PAID') {
      return (
        <AppointmentWrapper.Header backgroundColor="#00dc00">
          Paid Appointment
        </AppointmentWrapper.Header>
      );
    }
    return (
      <AppointmentWrapper.Header backgroundColor="#00dc00">
        Appointment
      </AppointmentWrapper.Header>
    );
  }

  renderBody() {
    const { appointment } = this.props;
    return (
      <AppointmentWrapper.Body>
        <UserInformation>
          <div>
            <span>Customer name: </span>
            <strong>{appointment.userFullName}</strong>
          </div>
          <div>
            <span>Phone number: </span>
            <strong>{appointment.phoneNumber}</strong>
          </div>
        </UserInformation>
        {this.renderServices()}
        {this.renderProducts()}
        {this.renderNotes()}
        <AppointmentInformation>
          <div>
            <span>Arriving in: </span>
            <strong>{moment(appointment.start).fromNow()}</strong>
          </div>
          <div>&nbsp;&nbsp;</div>
          <div>
            <span>Total: </span>
            <strong>${this.getTotalPrice()}</strong>
          </div>
        </AppointmentInformation>
      </AppointmentWrapper.Body>
    );
  }


  onChangePrice = (index, e) => {
    const { prices } = this.state;
    if(e.target.value === ''){
      prices[index] = 0;
    }else{
      var newPrice = e.target.value;
      if(e.target.value.charAt(0) === '0' ){
        newPrice = e.target.value.substr(1);
      }
      prices[index] = newPrice;
    }
    this.setState({ prices })
  }

  renderService(service, index) {
    const { appointment } = this.props;
    return (
      <tr key={index}>
        <td>{service.name}</td>
        <td style={{ textAlign: 'center' }}>
          <AdjustButton
            active={appointment.status !== 'PAID' && service.duration > 15}
            disabled={appointment.status === 'PAID' || service.duration <= 15}
            onClick={() => this.subtractService(index)}
          >
            -15&#39;
          </AdjustButton>
          {service.duration}
          <AdjustButton
            active={appointment.status !== 'PAID' && service.duration < 90}
            disabled={appointment.status === 'PAID' || service.duration >= 90}
            onClick={() => this.addService(index)}
          >
            +15&#39;
          </AdjustButton>
        </td>
        <td style={{ textAlign: 'center' }}>
          {/* {service.price * (service.duration / 10)} */}
          <input
            value={this.state.prices[index] || 30}
            style={{ textAlign: 'center' }}
            type="number"
            min="0"
            onChange={(e) => this.onChangePrice(index, e)}
          />
        </td>
      </tr>
    );
  }

  renderServices() {
    const { services } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <th width="50%">Selected Services</th>
            <th width="30%" style={{ textAlign: 'center' }}>
              Duration (ms)
            </th>
            <th style={{ textAlign: 'center' }}>Price ($)</th>
          </tr>
        </thead>
        <tbody>{services.map((s, i) => this.renderService(s, i))}</tbody>
      </table>
    );
  }

  renderProduct(product, index) {
    const { appointment } = this.props;
    return (
      <tr key={index}>
        <td>{product.name}</td>
        <td style={{ textAlign: 'center' }}>
          <AdjustButton
            active={appointment.status !== 'PAID' && product.amount > 1}
            disabled={appointment.status === 'PAID' || product.amount <= 1}
            onClick={() => this.subtractProduct(index)}
          >
            -
          </AdjustButton>
          {product.amount}
          <AdjustButton
            active={appointment.status !== 'PAID' && product.amount < 5}
            disabled={appointment.status === 'PAID' || product.amount >= 5}
            onClick={() => this.addProduct(index)}
          >
            +
          </AdjustButton>
        </td>
        <td style={{ textAlign: 'center' }}>
          {product.price * product.amount}
        </td>
      </tr>
    );
  }

  renderProducts() {
    const { products } = this.state;
    return (
      <table>
        <thead>
          <tr>
            <th width="50%">Selected Products</th>
            <th width="30%" style={{ textAlign: 'center' }}>
              Amount
            </th>
            <th style={{ textAlign: 'center' }}>Price ($)</th>
          </tr>
        </thead>
        <tbody>{products.map((p, i) => this.renderProduct(p, i))}</tbody>
      </table>
    );
  }

  renderNote = (note, index) => (
    <NoteInformation key={index}>
      <div>
        <strong>{note.date}</strong>
      </div>
      <div>{note.name}</div>
      <div>
        <i>{note.content}</i>
      </div>
    </NoteInformation>
  );

  renderNotes() {
    const { notes } = this.state;
    return (
      <NoteWrapper>
        <NoteWrapper.Form onSubmit={e => this.handleSubmit(e)}>
          <input
            value={this.state.noteValue}
            onChange={e => this.handleChange(e)}
          />
          <button type="submit">
            <Img src={Enter} alt="icon" />
          </button>
        </NoteWrapper.Form>
        {notes.map(this.renderNote)}
      </NoteWrapper>
    );
  }

  renderNextStatusButton() {
    const { appointment } = this.props;
    if (appointment.status === 'ASSIGNED')
      return (
        <Button onClick={() => this.nextStatus()} primary="true">
          Confirm
        </Button>
      );
    if (appointment.status === 'CONFIRMED')
      return (
        <Button onClick={() => this.nextStatus()} primary="true">
          Check In
        </Button>
      );
    if (appointment.status === 'CHECKED_IN')
      return (
        <Button onClick={() => this.nextStatus()} primary="true">
          Check out
        </Button>
      );
    return '';
  }

  render() {
    const { appointment } = this.props;
    if (!appointment) return '';
    return (
      <div>
        <AppointmentPopup
          closeOnDocumentClick
          open
          onOpen={() => this.openModal()}
          onClose={() => this.closeModal()}
          
        >
          <AppointmentWrapper>
            <AppointmentWrapper.Close onClick={() => this.closeModal()}>
              <FaTimesCircle />
            </AppointmentWrapper.Close>
            {this.renderHeader()}
            {this.renderBody()}
            <AppointmentWrapper.Footer>
              <div>
                <Button onClick={() => this.openConfirmationModal()}>
                  Cancel
                </Button>
              </div>
              <div>{this.renderNextStatusButton()}</div>
            </AppointmentWrapper.Footer>
          </AppointmentWrapper>
        </AppointmentPopup>
        <ConfirmationPopup open={this.state.confirmationModal}>
          <ConfirmationWrapper>
            <ConfirmationWrapper.Close
              onClick={() => this.closeConfirmationModal()}
            >
              <FaTimesCircle />
            </ConfirmationWrapper.Close>
            <ConfirmationWrapper.Header backgroundColor="#00b4f7">
              Confirmation
            </ConfirmationWrapper.Header>
            <ConfirmationWrapper.Body>
              Do you want to Cancel this Appointment?
            </ConfirmationWrapper.Body>
            <ConfirmationWrapper.Footer>
              <div>
                <Button onClick={() => this.confirmCancelAppointment()}>
                  Yes
                </Button>
              </div>
              <div>
                <Button primary onClick={() => this.closeConfirmationModal()}>
                  No
                </Button>
              </div>
            </ConfirmationWrapper.Footer>
          </ConfirmationWrapper>
        </ConfirmationPopup>
      </div>
    );
  }
}

Appointment.propTypes = {
  appointment: PropTypes.any,
  deselectAppointment: PropTypes.func,
  cancelAppointment: PropTypes.func,
  nextStatus: PropTypes.func,
  // services: PropTypes.any,
  // products: PropTypes.any,
};

export default Appointment;
