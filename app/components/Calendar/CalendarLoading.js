import React, { Component } from 'react'
import styled from 'styled-components'

const LoadingCalendar = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    z-index: 99;
    opacity: 0.9;
    padding-top: 20%;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    color: #61859f;
    font-size: 26px;
`


export default class CalendarLoading extends Component {
  render() {
    return (
     <LoadingCalendar>
         ...Loading Calendar
     </LoadingCalendar>
    )
  }
}
