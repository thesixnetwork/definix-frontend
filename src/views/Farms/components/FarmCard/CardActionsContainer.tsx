import BigNumber from 'bignumber.js'
import UnlockButton from 'components/UnlockButton'
import { useApprove } from 'hooks/useApprove'
import useI18n from 'hooks/useI18n'
import React, { useCallback, useMemo, useState } from 'react'
import { useFarmFromSymbol, useFarmUser } from 'state/hooks'
import { Farm } from 'state/types'
import styled from 'styled-components'
import { Button, Text } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { getContract } from 'utils/erc20'
import { provider } from 'web3-core'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import HarvestAction from './HarvestAction'
import StakeAction from './StakeAction'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

export interface FarmWithStakedValue extends Farm {
  apy?: BigNumber
}

interface FarmCardActionsProps {
  farm: FarmWithStakedValue
  ethereum?: provider
  account?: string
  addLiquidityUrl?: string
}

const CardActions: React.FC<FarmCardActionsProps> = ({ farm, ethereum, account, addLiquidityUrl }) => {
  const TranslateString = useI18n()
  const [requestedApproval, setRequestedApproval] = useState(false)
  const { pid, lpAddresses } = useFarmFromSymbol(farm.lpSymbol)
  const { allowance, tokenBalance, stakedBalance, earnings } = useFarmUser(pid)
  const lpAddress = getAddress(lpAddresses)
  const lpName = farm.lpSymbol.toUpperCase()
  const isApproved = account && allowance && allowance.isGreaterThan(0)

  const lpContract = useMemo(() => {
    return getContract(ethereum as provider, lpAddress)
  }, [ethereum, lpAddress])

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

  const renderApprovalOrStakeButton = () => {
    return isApproved ? (
      <StakeAction
        stakedBalance={stakedBalance}
        tokenBalance={tokenBalance}
        tokenName={lpName}
        pid={pid}
        addLiquidityUrl={addLiquidityUrl}
      />
    ) : (
      <Button fullWidth radii="small" disabled={requestedApproval} onClick={handleApprove}>
        {TranslateString(758, 'Approve Contract')}
      </Button>
    )
  }

  return (
    <div className="pa-5">
      <Text textAlign="left" className="mb-2" color="textSubtle">{`${lpName} ${TranslateString(1074, 'Staked')}`}</Text>
      <div className="mb-5">{!account ? <UnlockButton fullWidth radii="small" /> : renderApprovalOrStakeButton()}</div>

      <Text textAlign="left" className="mb-1 flex align-center" color="textSubtle">
        <MiniLogo src={miniLogo} alt="" />
        {`FINIX ${TranslateString(1072, 'Earned')}`}
      </Text>
      <HarvestAction earnings={earnings} pid={pid} />
    </div>
  )
}

export default CardActions
