import React, { useState, useCallback, useEffect } from 'react'
import _ from 'lodash'
import Lottie from 'react-lottie'
import moment from 'moment'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import { Button, Card } from '../../../uikit-dev'
import ModalResponses from '../../../uikit-dev/widgets/Modal/ModalResponses'

import success from '../../../uikit-dev/animation/complete.json'
import loadings from '../../../uikit-dev/animation/farmPool.json'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const LoadingOptions = {
  loop: true,
  autoplay: true,
  animationData: loadings,
}

const options = {
  loop: true,
  autoplay: true,
  animationData: loadings,
}

interface Props {
  onDismiss?: () => void
  isLoading?: any
}

const CardList = styled(Card)`
  width: 100%;
  background-color: ${({ theme }) => (theme.isDark ? '#000000' : '#FCFCFC')};
  border-radius: 24px;
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-self: center;
`

const Balance = styled.div`
  display: flex;
  width: 100%;
  flex-flow: row nowrap;
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

const Coins = styled.div`
  padding: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img {
    width: 37px;
    flex-shrink: 0;
  }

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
  }
`

const NumberInput = styled.input`
  border: none;
  background-color: #ffffff00;
  font-size: 22px;
  outline: none;
  color: ${({ theme }) => (theme.isDark ? '#fff' : '#000')};
  -webkit-flex: 1 1 auto;
  padding: 0px;
`

const CustomCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: ${({ theme }) => theme.colors.success} !important;
  }

  &.MuiCheckbox-root {
    color: #fcfcfc;
  }
`

const BpIcons = styled.span`
  border-radius: 2px;
  width: 0.65em;
  height: 0.65em;
  background-color: ${({ theme }) => (theme.isDark ? '#FFFFFF' : '#E3E6EC')} !important;
  border: 1.5px solid #979797;
  margin-left: 2px;
  &.Mui-focusVisible {
    outline: 2px auto rgba(19, 124, 189, 0.6);
    outline-offset: 2;
  }
`

const CardLodaings: React.FC<Props> = ({ onDismiss = () => null, isLoading }) => {
  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss} className="">
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const CardLoading = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss}>
        <div className="pb-6 pt-2">
          <Lottie options={LoadingOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }
  console.log('isLoading=', isLoading)

  return <>{isLoading === 'loading' ? <CardLoading /> : isLoading === 'success' && <CardResponse />}</>
}

export default CardLodaings
