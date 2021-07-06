import { useWallet } from 'klaytn-use-wallet'
import { useSousHarvest } from 'hooks/useHarvest'
import { useTranslation } from 'contexts/Localization'
import numeral from 'numeral'
import React, { useState } from 'react'
import { usePriceFinixUsd } from 'state/hooks'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
import { HarvestActionProps } from './types'

const MiniLogo = styled.img`
  width: 20px;
  height: auto;
  margin-right: 8px;
  display: inline-block;
`

const HarvestAction: React.FC<HarvestActionProps> = ({
  sousId,
  isBnbPool,
  earnings,
  tokenDecimals,
  needsApproval,
  isOldSyrup,
  className = '',
}) => {
  const { t } = useTranslation()

  const [pendingTx, setPendingTx] = useState(false)
  const finixPrice = usePriceFinixUsd()
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)

  const rawEarningsBalance = getBalanceNumber(earnings)
  const displayBalance = rawEarningsBalance.toLocaleString()

  return (
    <div className={className}>
      <Text textAlign="left" className="mb-2 flex align-center" color="textSubtle">
        <MiniLogo src={miniLogo} alt="" />
        {`FINIX ${t('Earned')}`}
      </Text>

      <div className="flex align-center justify-space-between">
        <Heading
          fontSize="24px !important"
          color={getBalanceNumber(earnings, tokenDecimals) === 0 ? 'textDisabled' : 'text'}
          className="col-6 pr-3"
          textAlign="left"
        >
          {/* {getBalanceNumber(earnings, tokenDecimals).toFixed(2)} */}
          {displayBalance}
        </Heading>

        <Button
          fullWidth
          disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
          className="col-6"
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

      <Text color="textSubtle" textAlign="left" className="mt-1">
        = ${numeral(rawEarningsBalance * finixPrice.toNumber()).format('0,0.0000')}
        {/* {numeral(earnings.toNumber() * finixPrice.toNumber()).format('0,0.0000')} */}
      </Text>
    </div>
  )
}

export default HarvestAction
