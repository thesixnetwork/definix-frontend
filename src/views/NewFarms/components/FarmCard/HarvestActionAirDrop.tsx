import React, { useState, useMemo } from 'react'
import BigNumber from 'bignumber.js'
import { Button, Text, useModal, Heading } from 'uikit-dev'
import useI18n from 'hooks/useI18n'
import { useHarvest } from 'hooks/useHarvest'
import { usePriceFinixUsd } from 'state/hooks'
import { getBalanceNumber } from 'utils/formatBalance'
import { convertToUsd } from 'utils/formatPrice'
import AirDropHarvestModal from './AirDropHarvestModal'

interface FarmCardActionsProps {
  isHorizontal?: boolean
  className?: string
  pid?: number
  earnings: BigNumber
}

const HarvestAction: React.FC<FarmCardActionsProps> = ({ className = '', isHorizontal, pid, earnings }) => {
  const TranslateString = useI18n()
  const [pendingTx, setPendingTx] = useState(false)
  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const { onReward } = useHarvest(pid)

  const finixUsdPrice = usePriceFinixUsd()
  const earningsBalance = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])
  const earningsValueFormated = useMemo(() => {
    return new BigNumber(earningsBalance).multipliedBy(finixUsdPrice).toNumber()
  }, [earningsBalance, finixUsdPrice])

  return (
    <div className={`${className} flex flex-grow ${isHorizontal ? 'flex-row' : 'flex-column justify-space-between'}`}>
      <div className={isHorizontal ? 'col-8 pr-4' : ''}>
        <Text textAlign="left" className="flex align-center mb-3" color="textSubtle">
          Finix Earned
        </Text>
        <Heading fontSize="20px !important" textAlign="left" color="text" className="col-6 pr-3">
          {earningsBalance.toLocaleString()}
        </Heading>
        <Text color="textSubtle">= {convertToUsd(earningsValueFormated, 2)}</Text>

        {false && (
          <div className="flex align-center justify-space-between">
            <Text color="textSubtle">Claim Ended Bonus</Text>

            <Button onClick={onPresentAirDropHarvestModal} variant="primary" size="sm">
              Claim
            </Button>
          </div>
        )}
      </div>
      <Button
        disabled={earningsBalance === 0 || pendingTx}
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
  )
}

export default HarvestAction
