import React, { useState, useMemo, useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { QuoteToken } from 'config/constants/types'
import { useSousHarvest } from 'hooks/useHarvest'
import useConverter from 'hooks/useConverter'
import { Button, Text, ButtonVariants, Flex, Box, Label, ColorStyles } from 'definixswap-uikit'
// import { useModal } from 'uikit-dev'
// import miniLogo from 'uikit-dev/images/finix-coin.png'
import { getBalanceNumber } from 'utils/formatBalance'
// import AirDropHarvestModal from './AirDropHarvestModal'
// import { PoolWithApy } from './types'

interface HarvestActionAirdropProps {
  componentType?: string
  isMobile: boolean
  isOldSyrup?: boolean
  isBnbPool?: boolean
  sousId?: number
  pendingRewards?: any
  bundleRewards?: any
  earnings: BigNumber
  needsApproval?: boolean
}

const HarvestActionAirdrop: React.FC<HarvestActionAirdropProps> = ({
  componentType = 'pool',
  isMobile,
  isOldSyrup,
  isBnbPool,
  sousId,
  pendingRewards,
  bundleRewards,
  earnings,
  needsApproval,
}) => {
  const navigate = useHistory()
  const isInPool = useMemo(() => componentType === 'pool', [componentType])
  const { account } = useWallet()
  const { onReward } = useSousHarvest(sousId, isBnbPool)
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  // const [onPresentAirDropHarvestModal] = useModal(<AirDropHarvestModal />)
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

  const AirDrop = ({ value, name }) => (
    <Flex>
      <Label type="token">{name}</Label>
      <Box className="ml-s16">
        <Text textStyle="R_18M" color={ColorStyles.BLACK}>
          {toLocaleString(value)}
        </Text>
        <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
          = {earningsPrice(value)}
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

  const handleGoToDetail = useCallback(() => {
    navigate.push('/pool')
  }, [navigate])

  const HarvestButton = () => (
    <Button
      variant={ButtonVariants.RED}
      md
      minWidth="100px"
      disabled={!account || (needsApproval && !isOldSyrup) || !earnings.toNumber() || pendingTx}
      onClick={async () => {
        setPendingTx(true)
        await onReward()
        setPendingTx(false)
      }}
    >
      Harvest
    </Button>
  )

  return (
    <>
      <Box>
        <Flex flexDirection={isInPool ? 'column' : 'row'} justifyContent="space-between" >
          <Box>
            <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY} className="mb-s8">
              Earned Token
            </Text>
            <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between">
              <Box>
                <AirDrop
                  name="FINIX"
                  value={finixEarningsValue}
                />
                {(bundleRewards || []).map((br, bundleId) => {
                  const reward = getBalanceNumber((pendingRewards[bundleId] || {}).reward) || 0
                  const allocate = br.rewardPerBlock || new BigNumber(0)
                  // ${numeral(apy.toNumber() || 0).format('0,0')} percent airdrop
                  return reward !== 0 || allocate.toNumber() !== 0 ? (
                    <AirDrop
                      // logo={`/images/coins/${br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}.png`}
                      // title="AAPR"
                      // percent="0.0%"
                      name={br.rewardTokenInfo.name === 'WKLAY' ? 'KLAY' : br.rewardTokenInfo.name}
                      value={reward}
                    />
                  ) : null
                })}
                {/* {false && (
                  <div className="flex align-center justify-space-between">
                    <Text color="textSubtle">Claim Ended Bonus</Text>
                    <Button onClick={onPresentAirDropHarvestModal} variant="primary" size="sm">
                      Claim
                    </Button>
                  </div>
                )} */}
              </Box>
              {isInPool && <HarvestButton />}
            </Flex>
          </Box>
          {isInPool ? null : (
            <Flex flexDirection="column" justifyContent="center">
              <HarvestButton />
              <Button variant={ButtonVariants.BROWN} md minWidth="100px" onClick={handleGoToDetail} className="mt-s8">
                Detail
              </Button>
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  )
}

export default HarvestActionAirdrop
