import React, { useState, useEffect, useCallback } from 'react'
import Lottie from 'react-lottie'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import moment from 'moment'

import definixLongTerm from 'uikit-dev/images/for-ui-v2/long-term-stake-opacity.png'
import badgeLock from 'uikit-dev/images/for-ui-v2/badge-lock.png'
import * as klipProvider from '../../../hooks/klipProvider'
import { useBalances, useAllowance, useLock, useApprove, useAllLock, useApr } from '../../../hooks/useLongTermStake'

const Balance = styled.div`
  display: flex;
  flex-flow: row nowrap;
  // flex-wrap: wrap;
  align-items: center;
  justify-content: flex-end;
  padding: 0.75rem 0.75rem 0.75rem 0.75rem;
  background-color: ${'#E4E4E425'};
  margin-top: 0.5rem !important;
  border: ${({ theme }) => !theme.isDark && '1px solid #ECECEC'};
  box-shadow: unset;
  border-radius: ${({ theme }) => theme.radii.default};

  a {
    display: block;
  }
`

const Coin = styled.div`
  min-width: 80px;
  display: flex;
  align-items: center;
  margin: 4px 0;
  justify-content: end;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const APRBOX = styled.div`
  position: relative;
  text-align: center;
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000000')};
  // width: 45%;
  -webkit-flex: 1 1 auto;
  padding: 0px;
`

const CardMarketplace = () => {
  return <div className="align-stretch mt-5">CardMarketplace</div>
}

export default CardMarketplace
