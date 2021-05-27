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

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  className?: string
}

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
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
      <Text textAlign="left" className="mb-2 flex align-center" color="textSubtle">
        <MiniLogo src={miniLogo} alt="" />
        {`FINIX ${TranslateString(1072, 'Earned')}`}
      </Text>

      <div className="flex align-center justify-space-between">
        <Heading
          fontSize="24px !important"
          color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}
          className="col-6 pr-3"
          textAlign="left"
        >
          {displayBalance}
        </Heading>

        <Button
          fullWidth
          disabled={rawEarningsBalance === 0 || pendingTx}
          className="col-6"
          radii="small"
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {TranslateString(562, 'Harvest')}
        </Button>
      </div>

      <Text color="textSubtle" textAlign="left" className="mt-1">
        = ${numeral(rawEarningsBalance * finixUsd.toNumber()).format('0,0.0000')}
      </Text>
    </div>
  )
}

export default HarvestAction
