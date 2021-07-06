import BigNumber from 'bignumber.js'
import { useHarvest } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
import numeral from 'numeral'
import React, { useState } from 'react'
import { useFarmUser, usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Heading, Text, useModal } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
import AirDropHarvestModal from './AirDropHarvestModal'

interface FarmCardActionsProps {
  earnings?: BigNumber
  pid?: number
  className?: string
  isHorizontal?: boolean
}

const MiniLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: block;
  flex-shrink: 0;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({ pid, className = '', isHorizontal }) => {
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const finixUsd = usePriceFinixUsd()
  const { onReward } = useHarvest(pid)
  const { earnings } = useFarmUser(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)

  return (
    <div className={`${className} flex flex-grow ${isHorizontal ? 'flex-row' : 'flex-column justify-space-between'}`}>
      <div className={isHorizontal ? 'col-8 pr-6' : ''}>
        <Text textAlign="left" className="flex align-center mb-3" color="textSubtle">
          Earned
        </Text>

        <div className="flex justify-space-between align-baseline mb-2">
          <div className="flex align-baseline">
            <MiniLogo src={miniLogo} alt="" className="align-self-start" />
            <Heading
              fontSize="24px !important"
              color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}
              className="mr-2"
              textAlign="left"
            >
              300.75
            </Heading>
            <Text color="textSubtle" textAlign="left">
              FINIX
            </Text>
          </div>

          <Text color="textSubtle" textAlign="right" fontSize="12px">
            = ${numeral(rawEarningsBalance * finixUsd.toNumber()).format('0,0.0000')}
          </Text>
        </div>

        <div className="flex align-center justify-space-between">
          <Text color="textSubtle">Claim Ended Bonus</Text>

          <Button onClick={onPresentAirDropHarvestModal} variant="primary" size="sm">
            Claim
          </Button>
        </div>
      </div>
      <Button
        fullWidth
        disabled={rawEarningsBalance === 0 || pendingTx}
        className={isHorizontal ? 'col-4 align-self-center' : 'mt-4'}
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
