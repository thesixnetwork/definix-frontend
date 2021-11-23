import _ from 'lodash'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import useConverter from 'hooks/useConverter'
import { Button, Skeleton, Text, Box, ColorStyles, Flex, Grid, DoubleArrowButtons, FireIcon } from 'definixswap-uikit'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/CurrencyText'
import BalanceText from 'components/BalanceText'
// import FinixHarvestAllBalance from './FinixHarvestTotalBalance'
// import FinixHarvestBalance from './FinixHarvestBalance'
// import FinixHarvestPool from './FinixHarvestPool'

const StatSkeleton = () => {
  return (
    <>
      <Skeleton animation="pulse" variant="rect" height="26px" />
      <Skeleton animation="pulse" variant="rect" height="21px" />
    </>
  )
}

interface ValueList {
  title: string
  value?: number
  price: number
}
const EarningBoxTemplate: React.FC<{
  isMobile: boolean
  hasAccount: boolean
  total: ValueList
  valueList: ValueList[]
}> = ({ isMobile, hasAccount, total, valueList }) => {
  const { t } = useTranslation()
  const { convertToBalanceFormat, convertToPriceFormat } = useConverter()
  const [pendingTx, setPendingTx] = useState(false)

  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))

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

  const hasTotalValue = useMemo(() => typeof _.get(total, 'value') === 'number', [total])

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" className="mx-s40 mt-s28 mb-s40">
        <Box>
          <Flex alignItems="flex-end" className="mb-s8">
            <FireIcon style={{ marginLeft: '-8px' }} />
            <Text textStyle="R_18M" color={ColorStyles.MEDIUMGREY} ml={4}>
              {total.title}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            {hasTotalValue ? (
              <BalanceText textStyle="R_32B" color={ColorStyles.BLACK} value={hasAccount ? total.value : 0} />
            ) : (
              <CurrencyText textStyle="R_32B" color={ColorStyles.BLACK} value={hasAccount ? total.price : 0} />
            )}
            {hasTotalValue && (
              <CurrencyText
                value={hasAccount ? total.price : 0}
                prefix="="
                textStyle="R_16M"
                color={ColorStyles.DEEPGREY}
                className="ml-s16"
              />
            )}
          </Flex>
        </Box>
        <Box width={186}>
          {hasAccount ? (
            <Button
              // id="harvest-all"
              md
              width="100%"
              disabled={balancesWithValue.length <= 0 || pendingTx}
              onClick={harvestAllFarms}
            >
              {pendingTx ? t('Collecting...') : t('Harvest')}
            </Button>
          ) : (
            <UnlockButton />
          )}
        </Box>
        
      </Flex>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        backgroundColor={ColorStyles.LIGHTGREY_20}
        className="pr-s40"
      >
        <Grid gridTemplateColumns={`repeat(${isMobile ? 2 : 4}, 1fr)`} style={{ flex: 1 }}>
          {valueList.map((valueItem, index) => (
            <Box
              className={`mt-s20 mb-s24 pr-s32 ${index > 0 ? 'pl-s32' : 'pl-s40'}`}
              borderLeft={index > 0 && '1px solid'}
              borderColor={ColorStyles.LIGHTGREY}
            >
              <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY} className="mb-s8">
                {valueItem.title}
              </Text>
              {typeof _.get(valueItem, 'value') === 'number' ? (
                <BalanceText textStyle="R_16M" color={ColorStyles.BLACK} value={hasAccount ? valueItem.value : 0} />
              ) : (
                <CurrencyText textStyle="R_16M" color={ColorStyles.BLACK} value={hasAccount ? valueItem.price : 0} />
              )}

              {typeof _.get(valueItem, 'value') === 'number' && (
                <CurrencyText
                  textStyle="R_14M"
                  color={ColorStyles.DEEPGREY}
                  value={hasAccount ? valueItem.price : 0}
                  prefix="="
                />
              )}
            </Box>
          ))}
        </Grid>
        <DoubleArrowButtons
          disableLeftArrow
          disableRightArrow
          onClickLeftArrow={() => alert('click left')}
          onClickRightArrow={() => alert('click right')}
        />
      </Flex>
    </Box>
  )
}

export default EarningBoxTemplate
