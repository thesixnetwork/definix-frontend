import BigNumber from 'bignumber.js'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import useFarmEarning from 'hooks/useFarmEarning'
import usePoolEarning from 'hooks/usePoolEarning'
import { usePriceFinixUsd } from 'state/hooks'
import EarningBoxTemplate from './EarningBoxTemplate'
// import UnlockButton from 'components/UnlockButton'
// import FinixHarvestAllBalance from './FinixHarvestTotalBalance'
// import FinixHarvestBalance from './FinixHarvestBalance'
// import FinixHarvestPool from './FinixHarvestPool'

const Earned: React.FC<{
  isMobile: boolean;
  isMain?: boolean;
  theme?: 'white' | 'dark'
}> = ({ isMobile, isMain = false, theme = 'white' }) => {
  const { t } = useTranslation()
  const { account } = useWallet()
  const finixPrice = usePriceFinixUsd()

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

  /**
   * total
   */
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
      // {
      //   title: t('Rebalancing'),
      //   value: '100,000,000.123456',
      //   price: '000000',
      // },
      // {
      //   title: t('Long-term Stake'),
      //   value: '100,000,000.123456',
      //   price: '000000',
      // },
    ]
  }, [t, farmEarningsSum, farmEarningBusd, poolEarningsSum, poolEarningsBusd])

  return (
    <EarningBoxTemplate
      theme={theme}
      isMain={isMain}
      isMobile={isMobile}
      hasAccount={!!account}
      total={{
        title: t('Total Finix Earned'),
        value: earnedList.reduce((result, item) => result + item.value, 0),
        price: earnedList.reduce((result, item) => result + item.price, 0),
      }}
      valueList={earnedList}
    />
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
