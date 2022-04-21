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
          if (br.rewardTokenInfo.name === QuoteToken.FAVOR || br.rewardTokenInfo.name === QuoteToken.FAVOR) {
            apy = farm.favorApy
          }

          const reward = getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0
          // const allocate = br.rewardPerBlock || new BigNumber(0)
          const allocate = new BigNumber(0)

          // ${numeral(apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')} percent airdrop
          return reward !== 0 || allocate.toNumber() !== 0 ? (
            <AirDrop
              logo={`/images/coins/${br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name.toLowerCase()}.png`}
              title="AAPR"
              percent={`${numeral(apy.times(new BigNumber(100)).toNumber() || 0).format('0,0')}%`}
              value={(getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0).toLocaleString()}
              name={br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
            />
          ) : (
            <></>
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
          {TranslateString(562, 'Harvest')}
        </Button>
      </div>
    </div>
  )
}

export default HarvestAction
