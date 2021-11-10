import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { ColorStyles, Flex, Text } from 'definixswap-uikit'
import { usePriceFinixUsdToNumber, useRebalances } from 'state/hooks'
import { Rebalance } from 'state/types'

interface ExtendRebalance extends Rebalance {
  apr: number;
}

const ColumnFlex = styled(Flex)`
  flex-direction: column;
`

const ExploreHighAPR: React.FC = () => {
  const { t } = useTranslation()
  const [highAprRebalance, setHighAprRebalance] = useState<ExtendRebalance>();
  const rebalances = useRebalances()
  const finixPrice = usePriceFinixUsdToNumber()

  useEffect(() => {
    if (finixPrice === 0) return;
    const maxAprRebalance = rebalances.reduce<ExtendRebalance>((acc, rebalance) => {
      const temp = {
        ...rebalance,
        apr: (new BigNumber(finixPrice))
          .times(_.get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
          .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
          .times(100)
          .toNumber()
      }

      if (!acc.apr || acc.apr < temp.apr) {
        // eslint-disable-next-line no-param-reassign
        acc = temp;
      }

      return acc;
    }, {} as ExtendRebalance);

    setHighAprRebalance(maxAprRebalance);
  }, [finixPrice, rebalances]);

  return highAprRebalance ? (
    <ColumnFlex width="100%">
      <Flex>image</Flex>
      <Flex mt="S_20" justifyContent="space-between" width="100%">
        <ColumnFlex justifyContent="flex-end">
          <Text textStyle="R_18B" color={ColorStyles.BLACK}>
            {highAprRebalance.title}
          </Text>
          <Flex mt="S_4">
            <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
              {t("Total Asset Value")}
            </Text>
            <Text mr="S_8" textStyle="R_14B" color={ColorStyles.MEDIUMGREY}>
              $
            </Text>
          </Flex>
        </ColumnFlex>
        <ColumnFlex alignItems="flex-end">
          <Text textStyle="R_12M" color={ColorStyles.ORANGE}>
            {t("APR")}
          </Text>
          <Text textStyle="R_28B" color={ColorStyles.BLACK}>
            {highAprRebalance.apr} %
          </Text>
        </ColumnFlex>
      </Flex>
    </ColumnFlex>
  ) : (
    <></>
  )
}

export default React.memo(ExploreHighAPR)
