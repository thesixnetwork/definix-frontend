import BigNumber from 'bignumber.js'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { useFarmUser, usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'

const MiniLogo = styled.img`
  width: 14px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  className?: string
}

const EarningHarvest: React.FC<FarmCardActionsProps> = ({ pid, className = '' }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
  const finixUsd = usePriceFinixUsd()
  const { onReward } = useHarvest(pid)
  const { earnings } = useFarmUser(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <div className={className}>
      <Text fontSize="0.75rem" textAlign="left" className="mb-2 flex align-center" color="textSubtle">
        {`${TranslateString(1072, 'Earned')}`}
        <MiniLogo style={{ marginLeft: 6 }} src={miniLogo} alt="" />
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
