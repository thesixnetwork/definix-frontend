import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { useHarvest } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
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
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: block;
  flex-shrink: 0;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ pid, className = '' }) => {
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)
  const finixUsd = usePriceFinixUsd()
  const { onReward } = useHarvest(pid)
  const { earnings } = useFarmUser(pid)
  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <div className={`${className} flex justify-space-between`}>
      <div className="col-8 pr-3">
        <Text textAlign="left" className="flex align-center" color="textSubtle">
          <MiniLogo src={miniLogo} alt="" />
          {`FINIX ${t('Earned')}`}
        </Text>

        <Heading
          fontSize="24px !important"
          color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}
          className="my-3"
          textAlign="left"
        >
          {displayBalance}
        </Heading>

        <Text color="textSubtle" textAlign="left" fontSize="12px">
          = ${numeral(rawEarningsBalance * finixUsd.toNumber()).format('0,0.0000')}
        </Text>
      </div>
      <Button
        fullWidth
        disabled={rawEarningsBalance === 0 || pendingTx}
        className="col-4 align-self-center"
        radii="small"
        onClick={async () => {
          setPendingTx(true)
          await onReward()
          setPendingTx(false)
        }}
      >
        {t('Harvest')}
      </Button>
    </div>
  )
}

export default HarvestAction
