import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUnlockDate } from 'state/hooks'
import styled from 'styled-components'
import { AddIcon, Button, Heading, MinusIcon, Text } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { getBalanceNumber } from 'utils/formatBalance'
import { provider } from 'web3-core'
import numeral from 'numeral'
import { FarmWithStakedValue } from './types'

interface FarmStakeActionProps {
  farm: FarmWithStakedValue
  klaytn?: provider
  account?: string
  // addLiquidityUrl?: string
  className?: string
  onPresentDeposit?: any
  onPresentWithdraw?: any
  isApproved: boolean
  stakedBalance: BigNumber
  stakedBalanceValueFormated: any
}

const IconButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  svg {
    width: 20px;
  }
`

const StakeAction: React.FC<FarmStakeActionProps> = ({
  isApproved,
  stakedBalance,
  stakedBalanceValueFormated,
  farm,
  klaytn,
  account,
  className = '',
  onPresentDeposit,
  onPresentWithdraw,
}) => {
  console.groupCollapsed('FARM')
  console.log('farm: ', farm)
  console.groupEnd()
  const [requestedApproval, setRequestedApproval] = useState(false)

  const TranslateString = useI18n()
  const { lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const lpAddress = getAddress(lpAddresses)
  const farmUnlockDate = useFarmUnlockDate()

  const balanceValue = useMemo(() => {
    try {
      return numeral(getBalanceNumber(stakedBalance) || 0).format('0,0.0[0000000000]')
    } catch (error) {
      // TODO
      console.groupCollapsed('balance value error')
      console.log(error)
      console.groupEnd()
      return '-'
    }
  }, [stakedBalance])

  const lpContract = useMemo(() => {
    return getContract(klaytn as provider, lpAddress)
  }, [klaytn, lpAddress])

  const { onApprove } = useApprove(lpContract)

  const handleApprove = useCallback(async () => {
    try {
      setRequestedApproval(true)
      await onApprove()
      setRequestedApproval(false)
    } catch (e) {
      console.error(e)
    }
  }, [onApprove])

  const renderStakingButtons = () => {
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
          <Button variant="secondary" className="btn-secondary-disable col-6 ml-1" onClick={onPresentDeposit}>
            <AddIcon color="primary" />
          </Button>
        )}
      </IconButtonWrapper>
    )
  }

  return (
    <div className={className}>
      {account ? (
        <>
          {isApproved ? (
            <div>
              <Text color="textSubtle">My Liquidity</Text>
              <Heading fontSize="20px !important" textAlign="left" color="text" className="col-6 pr-3">
                {balanceValue}
              </Heading>
              <Text color="textSubtle">= {stakedBalanceValueFormated}</Text>

              <div className="col-6">{renderStakingButtons()}</div>
            </div>
          ) : (
            <Button fullWidth radii="small" disabled={requestedApproval} onClick={handleApprove}>
              {TranslateString(758, 'Approve Contract')}
            </Button>
          )}
        </>
      ) : (
        <UnlockButton fullWidth radii="small" />
      )}
    </div>
  )
}

export default StakeAction
