import BigNumber from 'bignumber.js'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { useFarmUser, usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import Flex from 'uikitV2/components/Box/Flex'
import { Button, Heading, Text } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  className?: string
}

const MiniLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: block;
  flex-shrink: 0;
`

const HarvestButtonSectionInMyInvestment = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 100%;
  @media screen and (max-width: 1280px) {
    margin-top: 24px;
    flex-direction: row;
  }
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

const HarvestAction: React.FC<FarmCardActionsProps> = ({ pid, className = '' }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const finixUsd = usePriceFinixUsd()
  const { onReward } = useHarvest(pid)
  const { earnings } = useFarmUser(pid)

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
                = ${numeral(rawEarningsBalance * finixUsd.toNumber()).format('0,0.0000')}
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
          disabled={rawEarningsBalance === 0 || pendingTx}
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
