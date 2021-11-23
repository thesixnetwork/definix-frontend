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

const THEME = {
  white: {
    totalTitleColor: ColorStyles.MEDIUMGREY,
    totalBalanceColor: ColorStyles.BLACK,
    totalCurrencyColor: ColorStyles.BLACK,
    itemTitleColor: ColorStyles.MEDIUMGREY,
    itemBalanceColor: ColorStyles.BLACK,
    itemCurrencyColor: ColorStyles.DEEPGREY,
    borderColor: ColorStyles.LIGHTGREY,
    bottomBg: ColorStyles.LIGHTGREY_20,
  },
  dark: {
    totalTitleColor: ColorStyles.WHITE,
    totalBalanceColor: ColorStyles.WHITE,
    totalCurrencyColor: ColorStyles.WHITE,
    itemTitleColor: ColorStyles.MEDIUMGREY,
    itemBalanceColor: ColorStyles.WHITE,
    itemCurrencyColor: 'white80',
    borderColor: ColorStyles.BROWN,
    bottomBg: 'black20',
  },
}

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
  theme?: 'white' | 'dark'
}> = ({ isMobile, hasAccount, total, valueList, theme = 'white' }) => {
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
  const curTheme = useMemo(() => THEME[theme], [theme])

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" className="mx-s40 mt-s28 mb-s40">
        <Box>
          <Flex alignItems="flex-end" className="mb-s8">
            <FireIcon style={{ marginLeft: '-8px' }} />
            <Text textStyle="R_18M" color={curTheme.totalTitleColor} ml={4}>
              {total.title}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            {hasTotalValue ? (
              <BalanceText textStyle="R_32B" color={curTheme.totalBalanceColor} value={hasAccount ? total.value : 0} />
            ) : (
              <CurrencyText textStyle="R_32B" color={curTheme.totalBalanceColor} value={hasAccount ? total.price : 0} />
            )}
            {hasTotalValue && (
              <CurrencyText
                value={hasAccount ? total.price : 0}
                prefix="="
                textStyle="R_16M"
                color={curTheme.totalCurrencyColor}
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
      <Flex justifyContent="space-between" alignItems="center" backgroundColor={curTheme.bottomBg} className="pr-s40">
        <Grid gridTemplateColumns={`repeat(${isMobile ? 2 : 4}, 1fr)`} style={{ flex: 1 }}>
          {valueList.map((valueItem, index) => (
            <Box
              className={`mt-s20 mb-s24 pr-s32 ${index > 0 ? 'pl-s32' : 'pl-s40'}`}
              borderLeft={index > 0 && '1px solid'}
              borderColor={curTheme.borderColor}
            >
              <Text textStyle="R_14R" color={curTheme.itemTitleColor} className="mb-s8">
                {valueItem.title}
              </Text>
              {typeof _.get(valueItem, 'value') === 'number' ? (
                <BalanceText
                  textStyle="R_16M"
                  color={curTheme.itemBalanceColor}
                  value={hasAccount ? valueItem.value : 0}
                />
              ) : (
                <CurrencyText
                  textStyle="R_16M"
                  color={curTheme.itemBalanceColor}
                  value={hasAccount ? valueItem.price : 0}
                />
              )}

              {typeof _.get(valueItem, 'value') === 'number' && (
                <CurrencyText
                  textStyle="R_14M"
                  color={curTheme.itemCurrencyColor}
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
