import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import { Card } from 'uikit-dev'

const FinixStake = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;

  a {
    display: block;
  }
`

const CardMyNFT = () => {
  return (
    <div className="align-stretch mt-5">
      <FinixStake>CardMyNFT</FinixStake>
    </div>
  )
}

export default CardMyNFT
