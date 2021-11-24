import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import { Card, Text, Image } from '../../../uikit-dev'

const CardDetail = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  padding: 1.5rem !important;
  border-radius: 0px;

  a {
    display: block;
  }
`

const ListItem = () => {
  return (
    <div className="align-stretch mt-5">
      <CardDetail className="ml-5">
        <Text>CardMyNFT</Text>
        <Text className="mt-5">Not for sale : 5 results</Text>
      </CardDetail>
    </div>
  )
}

export default ListItem
