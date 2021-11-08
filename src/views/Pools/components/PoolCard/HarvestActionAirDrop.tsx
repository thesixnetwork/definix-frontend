import React, { useState, useMemo, useCallback } from 'react'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { QuoteToken } from 'config/constants/types'
import { useSousHarvest } from 'hooks/useHarvest'
import useI18n from 'hooks/useI18n'
import useConverter from 'hooks/useConverter'
import styled from 'styled-components'
import { Button, Text, ButtonVariants, ButtonScales, Flex, Box, Label, ColorStyles } from 'definixswap-uikit'
import { useModal } from 'uikit-dev'
import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
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
  isMobile: boolean
  isOldSyrup?: boolean
  isBnbPool?: boolean
  sousId?: number
  pendingRewards?: any
  // bundleRewardLength?: BigNumber
  bundleRewards?: any
  earnings: BigNumber
  // tokenDecimals?: number
  needsApproval?: boolean
  // farm?: FarmWithStakedValue
  pool?: PoolWithApy
}

const HarvestActionAirdrop: React.FC<HarvestActionAirdropProps> = ({
  isMobile,
  isOldSyrup,
  isBnbPool,
  sousId,
  pendingRewards,
  bundleRewards,
  earnings,
  needsApproval,
  pool,
}) => {
  const TranslateString = useI18n()
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
  const [pendingTx, setPendingTx] = useState(false)

  const finixPrice = convertToPriceFromSymbol(QuoteToken.FINIX)
  const finixEarningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])
  const earningsPrice = useCallback(
    (value) => {
      return convertToUSD(new BigNumber(value).multipliedBy(finixPrice), 2)
    },
    [finixPrice, convertToUSD],
  )
  const toLocaleString = useCallback((value: number) => {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 })
  }, [])

  // const finixApy = pool.finixApy || new BigNumber(0)

  const AirDrop = ({ value, name, price }) => (
    <Flex>
      <Label type="token">{name}</Label>
      <Box className="ml-s16">
        <Text textStyle="R_18M" color={ColorStyles.BLACK}>
          {toLocaleString(value)}
        </Text>
        <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
          = {price}
        </Text>
      </Box>
    </Flex>
    // <div className="flex justify-space-between align-baseline mb-2">
    //   <div className="flex align-baseline flex-shrink" style={{ width: '150px' }}>
    //     <MiniLogo src={logo} alt="" className="align-self-center" />
    //     <Text color="textSubtle" textAlign="left" className="mr-2">
    //       {title}
    //     </Text>
    //     <Text textAlign="left" fontSize="14px !important" bold>
    //       {percent}
    //     </Text>
    //   </div>

    //   <Text color="textSubtle" fontSize="14px !important" style={{ width: '16px' }} className="flex-shrink">
    //     :
    //   </Text>

    //   <div className="flex align-baseline flex-grow">
    //     <Text fontSize="14px !important" bold className="mr-2" textAlign="left">
    //       {value} = {price}
    //     </Text>
    //     <Text color="textSubtle" textAlign="left">
    //       {name}
    //     </Text>
    //   </div>
    // </div>
  )

  return (
    <Box>
      <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY} className="mb-s8">
        Earned Token
      </Text>
      <Flex justifyContent="space-between" flexDirection={isMobile ? 'column' : 'row'}>
        <Box>
          <AirDrop
            // logo={miniLogo}
            // title="APR"
            // percent={`${numeral(finixApy.toNumber() || 0).format('0,0')}%`}
            value={finixEarningsValue}
            name="FINIX"
            price={earningsPrice(finixEarningsValue)}
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
                // logo={`/images/coins/${br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}.png`}
                // title="AAPR"
                // percent="0.0%"
                value={getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0}
                price={earningsPrice(getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0)}
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
        </Box>
        <Button
          variant={ButtonVariants.RED}
          md
          minWidth="100px"
          mr="8px"
          disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
          onClick={async () => {
            setPendingTx(true)
            await onReward()
            setPendingTx(false)
          }}
        >
          Harvest
        </Button>
      </Flex>
      {/* {false && (
        <Text color="textSubtle" textAlign="right" fontSize="12px" className="mb-4 mt-2">
          = ${numeral(earnings.toNumber() * finixPrice).format('0,0.0000')}
        </Text>
      )} */}
    </Box>
  )
}

export default HarvestActionAirdrop
