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
import { QuoteToken } from 'config/constants/types'
import AirDropHarvestModal from './AirDropHarvestModal'
import { FarmWithStakedValue } from './types'

interface FarmCardActionsProps {
  pendingRewards?: any
  bundleRewardLength?: BigNumber
  bundleRewards?: any
  earnings?: BigNumber
  pid?: number
  className?: string
  isHorizontal?: boolean
  farm?: FarmWithStakedValue
}

const MiniLogo = styled.img`
  width: 24px;
  height: 24px;
  margin-right: 8px;
  display: block;
  flex-shrink: 0;
`

const HarvestAction: React.FC<FarmCardActionsProps> = ({
  bundleRewardLength,
  pendingRewards,
  bundleRewards,
  pid,
  className = '',
  isHorizontal,
  farm,
}) => {
  const [pendingTx, setPendingTx] = useState(false)
  const { t } = useTranslation()
  const finixUsd = usePriceFinixUsd()
  const { onReward } = useHarvest(pid)
  const { earnings } = useFarmUser(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const finixApy = farm.finixApy || new BigNumber(0)

  const AirDrop = ({ logo, title, percent, value, name }) => (
    <div className="flex justify-space-between align-baseline mb-2">
      <div className="flex align-baseline flex-shrink" style={{ width: '160px' }}>
        <MiniLogo src={logo} alt="" className="align-self-center" />
        <Text color="textSubtle" textAlign="left" className="mr-2">
          {title}
        </Text>
        <Text textAlign="left" fontSize="14px !important" bold>
          {percent}
        </Text>
      </div>

      <Text color="textSubtle" fontSize="14px !important" style={{ width: '16px' }} className="flex-shrink">
        :
      </Text>

      <div className="flex align-baseline flex-grow">
        <Text fontSize="14px !important" bold className="mr-2" textAlign="left">
          {value}
        </Text>
        <Text color="textSubtle" textAlign="left">
          {name}
        </Text>
      </div>
    </div>
  )

  return (
    <div className={`${className} flex flex-grow ${isHorizontal ? 'flex-row' : 'flex-column justify-space-between'}`}>
      <div className={isHorizontal ? 'col-8 pr-4' : ''}>
        <Text textAlign="left" className="flex align-center mb-3" color="textSubtle">
          {t('Earned')}
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
              percent={`${numeral(apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}%`}
              value={(getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0).toLocaleString()}
              name={br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
            />
          )
        })}

        {false && (
          <div className="flex align-center justify-space-between">
            <Text color="textSubtle">{t('Claim Ended Bonus')}</Text>

            <Button onClick={onPresentAirDropHarvestModal} variant="primary" size="sm">
              {t('Claim')}
            </Button>
          </div>
        )}
      </div>
      <div
        className={`flex  ${
          isHorizontal ? 'flex-column col-4 align-center justify-center' : 'flex-column-reverse align-start'
        }`}
      >
        <Button
          fullWidth
          disabled={rawEarningsBalance === 0 || pendingTx}
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
    </div>
  )
}

export default HarvestAction
