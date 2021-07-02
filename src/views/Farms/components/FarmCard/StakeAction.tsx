import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUnlockDate, useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, Text } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { getBalanceNumber } from 'utils/formatBalance'
import { provider } from 'web3-core'
import numeral from 'numeral'
import { FarmWithStakedValue } from './types'
import { KlipModalContext } from '../../../../KlipModal'

interface FarmStakeActionProps {
  farm: FarmWithStakedValue
  klaytn?: provider
  account?: string
  addLiquidityUrl?: string
  className?: string
  onPresentDeposit?: any
  onPresentWithdraw?: any
  connector?: string
}

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmStakeActionProps> = ({
  farm,
  klaytn,
  account,
  className = '',
  onPresentDeposit,
  onPresentWithdraw,
  connector,
}) => {
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { setShowModal } = React.useContext(KlipModalContext)
  const TranslateString = useI18n()
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { allowance, stakedBalance } = useFarmUser(pid)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const farmUnlockDate = useFarmUnlockDate()

  const rawStakedBalance = getBalanceNumber(stakedBalance)
  const displayBalance = numeral(rawStakedBalance || 0).format('0,0.0[0000000000]')

  const lpContract = useMemo(() => {
    return getContract(klaytn as provider, lpAddress)
  }, [klaytn, lpAddress])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove(connector, setShowModal)
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove, connector, setShowModal])

  const renderStakingButtons = () => {
    if (rawStakedBalance === 0) {
      return (
        <Button
          disabled={farmUnlockDate instanceof Date && new Date().getTime() < farmUnlockDate.getTime()}
          onClick={onPresentDeposit}
          fullWidth
          radii="small"
        >
          {TranslateString(999, 'Stake LP')}
        </Button>
      )
    }

    return (
      <IconButtonWrapper>
        <Button
          variant="secondary"
          disabled={stakedBalance.eq(new BigNumber(0))}
          onClick={onPresentWithdraw}
          className="btn-secondary-disable col-6 mr-1"
        >
          <MinusIcon color="primary" />
        </Button>
        {(typeof farmUnlockDate === 'undefined' ||
          (farmUnlockDate instanceof Date && new Date().getTime() > farmUnlockDate.getTime())) && (
          <Button variant="secondary" onClick={onPresentDeposit} className="btn-secondary-disable col-6 ml-1">
            <AddIcon color="primary" />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  const renderApprovalOrStakeButton = () => {
    if (!isApproved) {
      return (
        <Button fullWidth radii="small" disabled={requestedApproval} onClick={handleApprove}>
          {TranslateString(758, 'Approve Contract')}
        </Button>
      )
    }

    return (
      <div className="flex align-center">
        <Heading
          fontSize="20px !important"
          textAlign="left"
          color={rawStakedBalance === 0 ? 'textDisabled' : 'text'}
          className="col-6 pr-3"
        >
          {displayBalance}
        </Heading>

        <div className="col-6">{renderStakingButtons()}</div>
      </div>
    )
  }

  return (
    <div className={className}>
      <Text textAlign="left" className="mb-2" color="textSubtle">{`${lpName} ${TranslateString(1074, 'Staked')}`}</Text>
      {!account ? <UnlockButton fullWidth radii="small" /> : renderApprovalOrStakeButton()}
    </div>
  )
}

export default StakeAction
