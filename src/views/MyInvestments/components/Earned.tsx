import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'

import { useAllHarvest } from 'hooks/useHarvest'
import useFarmEarning from 'hooks/useFarmEarning'
import usePoolEarning from 'hooks/usePoolEarning'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { usePoolsIsFetched, useFarmsIsFetched, usePriceFinixUsd } from 'state/hooks'

import { Button, Heading, Skeleton, Text, Box, ColorStyles, Flex, Grid } from 'definixswap-uikit'
import UnlockButton from 'components/UnlockButton'
import FinixHarvestAllBalance from './FinixHarvestTotalBalance'
import FinixHarvestBalance from './FinixHarvestBalance'
import FinixHarvestPool from './FinixHarvestPool'

const StatSkeleton = () => {
  return (
    <>
      <Skeleton animation="pulse" variant="rect" height="26px" />
      <Skeleton animation="pulse" variant="rect" height="21px" />
    </>
  )
}

const Earned = ({ isMobile }) => {
  const { t } = useTranslation()
  const [pendingTx, setPendingTx] = useState(false)

  const { account } = useWallet()
  const finixPrice = usePriceFinixUsd()
  const farmsWithBalance = useFarmsWithBalance()

  /**
   * farm
   */
  const farmEarnings = useFarmEarning()
  const farmEarningsSum = useMemo(() => {
    return farmEarnings.reduce((accum, earning) => {
      return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    }, 0)
  }, [farmEarnings])
  const farmEarningBusd = useMemo(() => {
    return new BigNumber(farmEarningsSum).multipliedBy(finixPrice).toNumber()
  }, [farmEarningsSum, finixPrice])
  // const earningsSum = farmEarnings.reduce((accum, earning) => {
  //   return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  // }, 0)
  // const earningsBusd = new BigNumber(earningsSum).multipliedBy(usePriceFinixUsd()).toNumber()

  /**
   * pool
   */
  const poolEarnings = usePoolEarning()
  const poolEarningsSum = useMemo(() => {
    return poolEarnings.reduce((accum, earning) => {
      return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
    }, 0)
  }, [poolEarnings])
  const poolEarningsBusd = useMemo(() => {
    return new BigNumber(poolEarningsSum).multipliedBy(finixPrice).toNumber()
  }, [poolEarningsSum, finixPrice])

  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

  const isPoolFetched = usePoolsIsFetched()
  const isFarmFetched = useFarmsIsFetched()

  const harvestAllFarms = useCallback(async () => {
    setPendingTx(true)
    try {
      await onReward()
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [onReward])

  const earnedList = useMemo(() => {
    return [
      {
        title: t('Farm'),
        value: farmEarningsSum,
        price: farmEarningBusd,
      },
      {
        title: t('Pool'),
        value: poolEarningsSum,
        price: poolEarningsBusd,
      },
      {
        title: t('Rebalancing'),
        value: '100,000,000.123456',
        price: '000000',
      },
      {
        title: t('Long-term Stake'),
        value: '100,000,000.123456',
        price: '000000',
      },
    ]
  }, [t, farmEarningsSum, farmEarningBusd, poolEarningsSum, poolEarningsBusd])

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" className="mx-s40 mt-s28 mb-s40">
        <Box>
          <Text textStyle="R_18M" color={ColorStyles.MEDIUMGREY}>
            {t('Total Finix Earned')}
          </Text>
          <Flex alignItems="flex-end">
            <Text textStyle="R_32B" color={ColorStyles.BLACK}>
              100,000,000.123456
            </Text>
            <Text textStyle="R_16M" color={ColorStyles.DEEPGREY} className="ml-s16">
              = $1303.32
            </Text>
          </Flex>
        </Box>
        {account ? (
          <Button
            // id="harvest-all"
            md
            width={186}
            disabled={balancesWithValue.length <= 0 || pendingTx}
            onClick={harvestAllFarms}
          >
            {pendingTx ? t('Collecting...') : t('Harvest')}
          </Button>
        ) : (
          <UnlockButton />
        )}
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        backgroundColor={ColorStyles.LIGHTGREY_20}
        className="pr-s40"
      >
        <Grid gridTemplateColumns={`repeat(${isMobile ? 2 : 4}, 1fr)`}>
          {earnedList.map((earned, index) => (
            <Box
              className={`mt-s20 mb-s24 pr-s32 ${index > 0 ? 'pl-s32' : 'pl-s40'}`}
              borderLeft={index > 0 && '1px solid'}
              borderColor={ColorStyles.LIGHTGREY}
            >
              <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                {earned.title}
              </Text>
              <Text textStyle="R_16M" color={ColorStyles.BLACK} className="mt-s8">
                {numeral(earned.value).format('0,0.[000000]')}
              </Text>
              <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                = ${numeral(earned.price).format('0,0.[00]')}
              </Text>
            </Box>
          ))}
        </Grid>
        <Box>button</Box>
      </Flex>
    </Box>
    // <div className="flex">
    //   <StatAll>
    //     <Heading color="textSubtle">Total Finix Earned</Heading>
    //     <Heading fontSize="24px !important" color="textInvert">
    //       <FinixHarvestAllBalance />
    //     </Heading>
    //     {account ? (
    //       <Button
    //         className="ml-2"
    //         id="harvest-all"
    //         size="sm"
    //         disabled={balancesWithValue.length <= 0 || pendingTx}
    //         onClick={harvestAllFarms}
    //       >
    //         {pendingTx ? TranslateString(548, 'Collecting FINIX') : TranslateString(532, `Harvest`)}
    //       </Button>
    //     ) : (
    //       <UnlockButton />
    //     )}
    //   </StatAll>
    //   <div className="flex">
    //     <StatAll>
    //       <Text color="textSubtle">Farm</Text>
    //       {isFarmFetched ? (
    //         <>
    //           <Heading fontSize="24px !important" color="textInvert">
    //             <FinixHarvestBalance />
    //           </Heading>
    //         </>
    //       ) : (
    //         <StatSkeleton />
    //       )}
    //     </StatAll>
    //     <StatAll>
    //       <Text color="textSubtle">Pool</Text>
    //       {isPoolFetched ? (
    //         <>
    //           <Heading fontSize="24px !important" color="textInvert">
    //             <FinixHarvestPool />
    //           </Heading>
    //         </>
    //       ) : (
    //         <StatSkeleton />
    //       )}
    //     </StatAll>
    //   </div>
    // </div>
  )
}

export default Earned
