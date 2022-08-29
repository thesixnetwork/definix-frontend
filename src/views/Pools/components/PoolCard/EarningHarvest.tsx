import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useSousHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
import { HarvestActionProps } from './types'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

const EarningHarvest: React.FC<HarvestActionProps> = ({
  sousId,
  isBnbPool,
  earnings,
  tokenDecimals,
  needsApproval,
  isOldSyrup,
  className = '',
}) => {
  const TranslateString = useI18n()

  const [pendingTx, setPendingTx] = useState(false)
  const finixPrice = usePriceFinixUsd()
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <div className={className}>
      <Text fontSize="0.75rem" textAlign="left" className="mb-2 flex align-center" color="textSubtle">
        {`${TranslateString(1072, 'Earned')}  `}
        <MiniLogo style={{ marginLeft: 2 }} src={miniLogo} alt="" />
      </Text>

      <div className="flex align-center">
        <Heading fontSize="1.125rem !important" color="text" className="pr-1" textAlign="left">
          {/* {getBalanceNumber(earnings, tokenDecimals).toFixed(2)} */}
          {displayBalance}
        </Heading>
        <Text style={{ alignSelf: 'flex-end' }} fontSize="0.75rem" fontWeight="500" color="rgb(102, 102, 102)">
          FINIX
        </Text>
      </div>
    </div>
  )
}

export default EarningHarvest
