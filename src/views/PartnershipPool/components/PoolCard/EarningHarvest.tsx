import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useVeloHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit-dev'

import { getBalanceNumber } from 'utils/formatBalance'
import { HarvestActionProps } from './types'

const MiniLogo = styled.img`
  width: 14px;
  height: auto;
  margin-left: 8px;
  display: inline-block;
`

const LabelText = styled.p`
  margin-right: 6px;
  width: 58px;
  height: 20px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: normal;
  line-height: 20px;
  text-align: center;
  background-color: rgb(180, 169, 168);
  color: rgb(255, 255, 255);
`

const EarningHarvest: React.FC<HarvestActionProps> = ({
  earnings,
  tokenDecimals,
  needsApproval,
  isOldSyrup,
  className = '',
  veloAmount,
  pairPrice,
  veloId,
}) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const finixPrice = usePriceFinixUsd()
  const { account } = useWallet()
  const { onRewardVelo } = useVeloHarvest(veloId)

  const rawEarningsBalance = getBalanceNumber(earnings, 5)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <div className={className}>
      <Text textAlign="left" fontSize="0.75rem" className="mb-2 flex align-center" color="textSubtle">
        {`${TranslateString(1072, 'Earned Token')}`}
        <MiniLogo src="/images/coins/velo.png" alt="" />
      </Text>

      <div className="flex align-center ">
        <Heading fontSize="1.125rem !important" color="text" className="pr-1" textAlign="left">
          {/* {getBalanceNumber(earnings, tokenDecimals).toFixed(2)} */}
          {displayBalance}
        </Heading>
        <Text style={{ alignSelf: 'flex-end' }} fontSize="0.75rem" fontWeight="500" color="rgb(102, 102, 102)">
          VELO
        </Text>
      </div>

      <div style={{ display: 'flex', marginTop: 6 }}>
        <Text fontSize="0.75rem" color="textSubtle" textAlign="left" className="col-6">
          Total VELO Rewards
        </Text>
        <Text  fontSize="0.75rem" color="textSubtle" textAlign="right" className="col-6">
          {numeral(veloAmount).format('0,0')}/300,000 VELO
        </Text>
      </div>
    </div>
  )
}

export default EarningHarvest
