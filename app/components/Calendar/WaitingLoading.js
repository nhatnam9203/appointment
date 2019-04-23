import React, { Component } from 'react'
import styled from 'styled-components';
const Loading = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    display: block;
    background: #fff;
    z-index: 99;
    opacity: 0.9;
    padding-top: 80%;
    text-align: center;
    font-weight: bold;
    font-style: italic;
    color: #61859f;
    font-size: 14px;
`

export default class WaitingLoading extends Component {
  render() {
    return (
      <Loading>
          ...Loading
      </Loading>
    )
  }
}
