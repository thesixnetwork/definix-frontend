import BigNumber from 'bignumber.js'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useState } from 'react'
import { useFarmUser } from 'state/hooks'
import styled from 'styled-components'
import { Button, Text, useModal } from 'uikit-dev'
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

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  pendingRewards,
  bundleRewards,
  pid,
  className = '',
  isHorizontal,
  farm,
}) => {
  const [pendingTx, setPendingTx] = useState(false)
  const TranslateString = useI18n()
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

        <AirDrop
          logo={miniLogo}
          title="APR"
          percent={`${numeral(finixApy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}%`}
          value={displayBalance}
          name="FINIX"
        />
        {(bundleRewards || []).map((br, bundleId) => {
          let apy = new BigNumber(0)
          if (br.rewardTokenInfo.name === QuoteToken.WKLAY || br.rewardTokenInfo.name === QuoteToken.KLAY) {
            apy = farm.klayApy
          }
          return (
            <AirDrop
              logo={`/images/coins/${br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}.png`}
              title="AAPR"
              percent={`${numeral(apy.times(new BigNumber(100)).toNumber() || 0).format('0,0.0')}%`}
              value={(getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0).toLocaleString()}
              name={br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
            />
          )
        })}

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
        {TranslateString(562, 'Harvest')}
      </Button>
    </div>
  )
}

export default HarvestAction
