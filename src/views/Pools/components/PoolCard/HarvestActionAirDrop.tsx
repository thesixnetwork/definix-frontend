import React, { useState, useMemo } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import { useSousHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Text, useModal } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
// import { QuoteToken } from 'config/constants/types'
import AirDropHarvestModal from './AirDropHarvestModal'
import { FarmWithStakedValue } from '../../../Farms/components/FarmCard/types'
import { PoolWithApy } from './types'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

interface HarvestActionAirdropProps {
  pendingRewards?: any
  bundleRewardLength?: BigNumber
  bundleRewards?: any
  sousId?: number
  isBnbPool?: boolean
  earnings: BigNumber
  tokenDecimals?: number
  needsApproval?: boolean
  isOldSyrup?: boolean
  className?: string
  isHorizontal?: boolean
  farm?: FarmWithStakedValue
  pool?: PoolWithApy
}

const HarvestActionAirdrop: React.FC<HarvestActionAirdropProps> = ({
  pendingRewards,
  bundleRewards,
  sousId,
  isBnbPool,
  earnings,
  needsApproval,
  isOldSyrup,
  className = '',
  isHorizontal,
  pool,
}) => {
  const TranslateString = useI18n()

  const [pendingTx, setPendingTx] = useState(false)

  const finixPrice = usePriceFinixUsd()
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)

  const displayEarnings = useMemo(() => {
    return getBalanceNumber(earnings).toLocaleString()
  }, [earnings])
  const finixApy = pool.finixApy || new BigNumber(0)

  const AirDrop = ({ logo, title, percent, value, name }) => (
    <div className="flex justify-space-between align-baseline mb-2">
      <div className="flex align-baseline flex-shrink" style={{ width: '150px' }}>
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
          percent={`${numeral(finixApy.toNumber() || 0).format('0,0')}%`}
          value={displayEarnings}
          name="FINIX"
        />
        {(bundleRewards || []).map((br, bundleId) => {
          // let apy = new BigNumber(0)
          // if (br.rewardTokenInfo.name === QuoteToken.WKLAY || br.rewardTokenInfo.name === QuoteToken.KLAY) {
          //   apy = pool.klayApy
          // }
          const reward = getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0
          const allocate = br.rewardPerBlock || new BigNumber(0)
          // ${numeral(apy.toNumber() || 0).format('0,0')} percent airdrop
          return reward !== 0 || allocate.toNumber() !== 0 ? (
            <AirDrop
              logo={`/images/coins/${br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}.png`}
              title="AAPR"
              percent="0.0%"
              value={(getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0).toLocaleString()}
              name={br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
            />
          ) : (
            ''
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
          disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
          radii="small"
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          {TranslateString(562, 'Harvest')}
        </Button>

        {false && (
          <Text color="textSubtle" textAlign="right" fontSize="12px" className="mb-4 mt-2">
            = ${numeral(earnings.toNumber() * finixPrice.toNumber()).format('0,0.0000')}
          </Text>
        )}
      </div>
    </div>
  )
}

export default HarvestActionAirdrop
