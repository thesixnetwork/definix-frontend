import { useWallet } from '@binance-chain/bsc-use-wallet'
import BigNumber from 'bignumber.js'
import { useSousHarvest } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Text, useModal } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import klay from 'uikit-dev/images/Logo-Klaytn.png'
import { getBalanceNumber } from 'utils/formatBalance'
import AirDropHarvestModal from './AirDropHarvestModal'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

interface HarvestActionAirdropProps {
  sousId?: number
  isBnbPool?: boolean
  earnings?: BigNumber
  tokenDecimals?: number
  needsApproval?: boolean
  isOldSyrup?: boolean
  className?: string
  isHorizontal?: boolean
}

const HarvestActionAirdrop: React.FC<HarvestActionAirdropProps> = ({
  sousId,
  isBnbPool,
  earnings,
  tokenDecimals,
  needsApproval,
  isOldSyrup,
  className = '',
  isHorizontal,
}) => {
  const { t } = useTranslation()

  const [pendingTx, setPendingTx] = useState(false)

  const finixPrice = usePriceFinixUsd()
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)

  const AirDrop = ({ logo, title, percent, value, name }) => (
    <div className="flex justify-space-between align-baseline mb-2">
      <div className="flex align-baseline flex-shrink" style={{ width: '120px' }}>
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

        <AirDrop logo={miniLogo} title="APR" percent="120%" value="12,300.75" name="FINIX" />
        <AirDrop logo={klay} title="AAPR" percent="20%" value="0.0" name="KLAY" />

        <div className="flex align-center justify-space-between">
          <Text color="textSubtle">Claim Ended Bonus</Text>

          <Button onClick={onPresentAirDropHarvestModal} variant="primary" size="sm">
            {t('Claim')}
          </Button>
        </div>
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
          {t('Harvest')}
        </Button>

        <Text color="textSubtle" textAlign="right" fontSize="12px" className="mb-4 mt-2">
          = ${numeral(earnings.toNumber() * finixPrice.toNumber()).format('0,0.0000')}
        </Text>
      </div>
    </div>
  )
}

export default HarvestActionAirdrop
