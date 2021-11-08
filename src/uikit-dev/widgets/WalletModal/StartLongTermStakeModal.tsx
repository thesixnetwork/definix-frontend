import React, { useState, useCallback, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Link, Button, Card, Skeleton, IconButton, ChevronRightIcon, Image } from 'uikit-dev'

import ModalStake from '../Modal/ModalStake'
import WalletCard from './WalletCard'
import config from './config'
import { Login } from './types'
import { Text } from '../../components/Text'
import StakePeriodButton from '../../../views/LongTermStake/components/StakePeriodButton'

interface Props {
  //   login: Login
  onDismiss?: () => void
}

// const HelpLink = styled(Link)`
//   display: flex;
//   align-self: center;
//   align-items: center;
//   margin-top: 24px;
// `

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
`

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const CardList = styled(Card)`
  width: 100%;
  //   height: 48px;
  background-color: '#FCFCFC';
  border-radius: 24px;
  align-items: center;
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-self: center;
`

const StyledFarmImages = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;

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

const Balance = styled.div`
  display: flex;
  width: 100%;
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

const Coins = styled.div`
  padding: 4px;
  //   width: 40%;
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

const FarmsAndPools = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .icon {
    padding-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &:last-child {
    border: none;
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

// const Coins = styled.div`
//   padding: 16px;
//   width: 40%;
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   justify-content: space-between;

//   img {
//     width: 48px;
//     flex-shrink: 0;
//   }
// `

const Summary = styled.div`
  padding: 12px 0;
  width: 60%;
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
    padding: 4px;
  }
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

const StartLongTermStakeModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedToken, setSelectedToken] = useState({})
  const [selectedTokenCount, setSelectedTokenCount] = useState(0)
  const [sousId, setSousId] = useState(0)
  const [pid, setPid] = useState(0)
  const [isBnbPool, setIsBnbPool] = useState(false)
  const [listView, setListView] = useState(false)

  const [period, setPeriod] = useState(0)

  return (
    <ModalStake title="Sorry, this feature is only for vFINIX holder" onDismiss={onDismiss}>
      <div className="flex flex-column w-100">
        <Text paddingTop="2" color="#737375">
          You have never lock in Long-term Stake. Do you want to start staking in the Long-term Stake to get this
          exclusive feature?
        </Text>
      </div>
      <Button as="a" fullWidth id="harvest-all" radii="small" className="ml-2 mt-3" href="/long-term-stake">
        Start Long-term Stake
      </Button>
    </ModalStake>
  )
}

export default StartLongTermStakeModal
