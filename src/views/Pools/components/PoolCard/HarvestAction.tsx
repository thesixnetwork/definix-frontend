import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Button } from '@mui/material'
import { useSousHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'

import { Flex, Heading, Text } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
import { HarvestActionProps } from './types'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
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

const HarvestAction: React.FC<HarvestActionProps> = ({
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
      <div>
        <Text textAlign="left" fontSize="0.75rem" className="mb-2 flex align-center" color="textSubtle">
          {`${TranslateString(1072, 'Earned Token')}`}
        </Text>
        <div className="flex align-center justify-space-between">
          <div className="flex">
            <LabelText>FINIX</LabelText>
            <div>
              <Heading fontSize="1.125rem !important" color="text" className="col-6 pr-3" textAlign="left">
                {/* {getBalanceNumber(earnings, tokenDecimals).toFixed(2)} */}
                {displayBalance}
              </Heading>

              <Text fontSize="0.875rem" color="textSubtle" textAlign="left" className="mt-1">
                = ${numeral(rawEarningsBalance * finixPrice.toNumber()).format('0,0.0000')}
                {/* {numeral(earnings.toNumber() * finixPrice.toNumber()).format('0,0.0000')} */}
              </Text>
            </div>
          </div>
        </div>
      </div>
      <HarvestButtonSectionInMyInvestment>
        <Button
          fullWidth
          color="secondary"
          disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {TranslateString(562, 'Harvest')}
        </Button>
      </HarvestButtonSectionInMyInvestment>
    </div>
  )
}

export default HarvestAction

const HarvestButtonSectionInMyInvestment = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  margin-top: 24px;
  width: 100%;
  @media screen and (min-width: 1280px) {
    flex-direction: row;
    width: 150px;
  }
`
