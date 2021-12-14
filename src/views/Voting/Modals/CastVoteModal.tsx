import React, { useState, useCallback, useEffect } from 'react'
import _ from 'lodash'
import Lottie from 'react-lottie'
import moment from 'moment'
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import useTheme from 'hooks/useTheme'
import { Card, Text } from 'uikit-dev'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

import {
  useHarvest as useHarvestLongterm,
  usePrivateData,
  useSuperHarvest,
  useSousHarvest,
  useBalances,
  useLockTopup,
  useAllDataLock,
  useAllLock,
} from 'hooks/useLongTermStake'
import { useLockPlus } from 'hooks/useTopUp'
import vFinix from 'uikit-dev/images/for-ui-v2/vFinix.png'
import success from 'uikit-dev/animation/complete.json'
import loadings from 'uikit-dev/animation/farmPool.json'
import ModalCastVote from 'uikit-dev/widgets/Modal/ModalCastVote'
import ModalResponses from 'uikit-dev/widgets/Modal/ModalResponses'


const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const options = {
  loop: true,
  autoplay: true,
  animationData: loadings,
}

interface Props {
  onDismiss?: () => void
}

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

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

const CastVoteModal: React.FC<Props> = ({ onDismiss = () => null }) => {
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { allLockPeriod } = useAllLock()
  const balanceOf = useBalances()
  const { handleHarvest } = useHarvestLongterm()
  const { isDark } = useTheme()
  const { levelStake, allLock } = useAllDataLock()
  const lockTopUp = useLockTopup()
  const [selectedToken, setSelectedToken] = useState({})
  // const [sousId, setSousId] = useState(0)
  const [period, setPeriod] = useState(0)
  const [idLast, setIdLast] = useState(0)
  const [lengthSelect, setLengthSelect] = useState(0)
  const [harvestProgress, setHarvestProgress] = useState(-1)
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('-')
  const [sumpendingReward, setSumPendingReward] = useState('0')
  const [value, setValue] = useState('0')
  const [isBnbPool, setIsBnbPool] = useState(false)
  const [showLottie, setShowLottie] = useState(false)
  const [pendingTx, setPendingTx] = useState(false)
  const [harvested, setHarvested] = useState(false)
  const [keyDown, setKeyDown] = useState(false)
  const realPenaltyRate = _.get(allLockPeriod, '0.realPenaltyRate')
  const { onLockPlus, status } = useLockPlus(period - 1 !== 3 ? period - 1 : 2, idLast, amount)
  const { onReward } = useSousHarvest()
  const [vFINIX, setVFINIX] = useState(0)
  const [vFinixEarn, setVFinixEarn] = useState(0)
  const [loading, setLoading] = useState('')

  
  const CardResponse = () => {
    return (
      <ModalResponses title="" onDismiss={onDismiss} className="">
        <div className="pb-6 pt-2">
          <Lottie options={SuccessOptions} height={155} width={185} />
        </div>
      </ModalResponses>
    )
  }

  const lenghtOrvalue = lengthSelect === 0 && value === ''

  return (
    <>
      {showLottie ? (
        <CardResponse />
      ) : (
        <ModalCastVote
          title="Confirm Vote"
          onDismiss={onDismiss}
          hideCloseButton
        >
          <Text fontSize="12px" color="textSubtle">Voting for</Text>
          <Text fontSize="16px" color="text" bold paddingTop="6px">Yes, agree with you.</Text>
          {/* <Text fontSize="16px" color="text" bold paddingTop="6px>No, I’m not agree with you.</Text> */}

        </ModalCastVote>
       
      )}
    </>
  )
}

export default CastVoteModal
