import BigNumber from 'bignumber.js'
import { useHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
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
  const TranslateString = useI18n()
  const finixUsd = usePriceFinixUsd()
  const { onReward } = useHarvest(pid)
  const { earnings } = useFarmUser(pid)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const finixApy = farm.finixApy || new BigNumber(0)

  return (
    <div className={`${className} flex flex-grow ${isHorizontal ? 'flex-row' : 'flex-column justify-space-between'}`}>
      <div className={isHorizontal ? 'col-8 pr-6' : ''}>
        <Text textAlign="left" className="flex align-center mb-3" color="textSubtle">
          Earned
        </Text>

        <div className="flex justify-space-between align-baseline mb-2">
          <div className="flex align-baseline">
            <MiniLogo src={miniLogo} alt="" className="align-self-start" />
            <Text color="textSubtle" className="mr-2" textAlign="left">
              APR
            </Text>
            <Heading
              fontSize="20px !important"
              color={finixApy.toNumber() === 0 ? 'textDisabled' : 'text'}
              textAlign="left"
            >
              {`${numeral(finixApy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}%`}
            </Heading>
          </div>

          <div className="flex align-baseline">
            <Heading
              fontSize="22px !important"
              color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}
              className="mr-2"
              textAlign="left"
            >
              {displayBalance}
            </Heading>
            <Text color="textSubtle" textAlign="left">
              FINIX
            </Text>
          </div>
          {false && (
            <Text color="textSubtle" textAlign="right" fontSize="12px">
              = ${numeral(rawEarningsBalance * finixUsd.toNumber()).format('0,0.0000')}
            </Text>
          )}
        </div>
        {(bundleRewards || []).map((br, bundleId) => {
          let apy = new BigNumber(0)
          if (br.rewardTokenInfo.name === QuoteToken.WKLAY || br.rewardTokenInfo.name === QuoteToken.KLAY) {
            apy = farm.klayApy
          }
          return (
            <div className="flex justify-space-between align-baseline mb-2">
              <div className="flex align-baseline">
                <MiniLogo
                  src={`/images/coins/${br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}.png`}
                  alt=""
                  className="align-self-start"
                />
                <Text color="textSubtle" className="mr-2" textAlign="left">
                  AAPR
                </Text>
                <Heading
                  fontSize="20px !important"
                  color={apy.toNumber() === 0 ? 'textDisabled' : 'text'}
                  textAlign="left"
                >
                  {`${numeral(apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}%`}
                </Heading>
              </div>

              <div className="flex align-baseline">
                <Heading
                  fontSize="22px !important"
                  color={rawEarningsBalance === 0 ? 'textDisabled' : 'text'}
                  className="mr-2"
                  textAlign="left"
                >
                  {getBalanceNumber((pendingRewards[bundleId] || {}).reward).toLocaleString()}
                </Heading>
                <Text color="textSubtle" textAlign="left">
                  {br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
                </Text>
              </div>
              {false && (
                <Text color="textSubtle" textAlign="right" fontSize="12px">
                  = $
                  {numeral(getBalanceNumber((pendingRewards[bundleId] || {}).reward) * finixUsd.toNumber()).format(
                    '0,0.0000',
                  )}
                </Text>
              )}
            </div>
          )
        })}

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
