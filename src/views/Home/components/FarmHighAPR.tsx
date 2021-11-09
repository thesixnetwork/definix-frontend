import React, { useState, useEffect } from "react";
import styled from "styled-components";
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { useFarms, usePriceFinixUsd, usePriceKethKusdt, usePriceKlayKusdt, usePriceSixUsd } from "state/hooks";
import { QuoteToken } from 'config/constants/types'
import { BLOCKS_PER_YEAR } from "config";
import { ColorStyles, Flex, Text } from "definixswap-uikit"
import { useTranslation } from "react-i18next";
import { Farm } from "state/types";

interface FarmState extends Farm {
  farmAPY: string;
}

const ColumnFlex = styled(Flex)`
  flex-direction: column;
`

const FarmHighAPR = () => {
  const { t } = useTranslation();
  const [highAprFarm, setHighAprFarm] = useState<FarmState>();

  const farmsLP = useFarms()
  const finixPrice = usePriceFinixUsd()
  const sixPrice = usePriceSixUsd()
  const klayPrice = usePriceKlayKusdt()
  const kethPriceUsd = usePriceKethKusdt()

  useEffect(() => {
    if (highAprFarm) return;
    if (finixPrice.isZero() || sixPrice.isZero() || klayPrice.isZero() || kethPriceUsd.isZero()) {
      return;
    }
    const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')
    const getFarmHighAPR = (farmsToDisplay) => {
      const finixPriceVsKlay = finixPrice
      return farmsToDisplay.map((farm) => {
        if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
          return farm
        }
        const klayApy = new BigNumber(0);
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        // const totalKlayRewardPerBlock = new BigNumber(KLAY_PER_BLOCK)
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        if (farm.quoteTokenSymbol === QuoteToken.KUSDT || farm.quoteTokenSymbol === QuoteToken.KDAI) {
          apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
          apy = finixPrice.div(klayPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.KETH) {
          apy = finixPrice.div(kethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
          apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const finixApy =
            farm && finixPriceVsKlay.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = finixApy && dualApy && finixApy.plus(dualApy)
        }

        return { ...farm, apy, finixApy: apy, klayApy, farmAPY: apy && numeral(apy.times(new BigNumber(100)).toNumber() || 0).format('0,0') }
      })
    };

    const farmData = getFarmHighAPR(activeFarms);
    const sortedFarmData = farmData.sort((a, b) => +a.farmAPY - +b.farmAPY).reverse();
    setHighAprFarm(sortedFarmData[0]);

  }, [farmsLP, finixPrice, highAprFarm, kethPriceUsd, klayPrice, sixPrice]);

  return highAprFarm ? <ColumnFlex width="100%">
    <Flex>image</Flex>
    <Flex mt="S_20" justifyContent="space-between" width="100%">
      <ColumnFlex justifyContent="flex-end">
        <Text textStyle="R_18B" color={ColorStyles.BLACK}>{highAprFarm.lpSymbol}</Text>
        <Flex mt="S_4">
          <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>{t("Total Liquidity")}</Text>
          <Text mr="S_8" textStyle="R_14B" color={ColorStyles.MEDIUMGREY}>$</Text>
        </Flex>
      </ColumnFlex>
      <ColumnFlex alignItems="flex-end">
        <Text textStyle="R_12M" color={ColorStyles.ORANGE}>{t("APR")}</Text>
        <Text textStyle="R_28B" color={ColorStyles.BLACK}>{highAprFarm.farmAPY} %</Text>
      </ColumnFlex>
    </Flex>
  </ColumnFlex> : <></>
}

export default FarmHighAPR;