import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import useConverter from 'hooks/useConverter'
import { Button, Skeleton, Text, Box, ColorStyles, Flex, Grid, DoubleArrowButtons, FireIcon } from 'definixswap-uikit'
import UnlockButton from 'components/UnlockButton'
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
  title: string;
  value: number;
  price: number;
}
const EarningBoxTemplate: React.FC<{
  isMobile: boolean;
  hasAccount: boolean;
  title: string;
  valueList: ValueList[]
}> = ({ isMobile, hasAccount, title, valueList }) => {
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

  return (
    <Box>
      <Flex justifyContent="space-between" alignItems="center" className="mx-s40 mt-s28 mb-s40">
        <Box>
          <Flex alignItems="flex-end" className="mb-s8">
            <FireIcon style={{ marginLeft: '-8px' }}/>
            <Text textStyle="R_18M" color={ColorStyles.MEDIUMGREY} ml={4}>
              {title}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            <Text textStyle="R_32B" color={ColorStyles.BLACK}>
              {hasAccount ? convertToBalanceFormat(valueList.reduce((result, item) => {
                return result + item.value
              }, 0)) : 0}
            </Text>
            <Text textStyle="R_16M" color={ColorStyles.DEEPGREY} className="ml-s16">
              = ${hasAccount ? convertToPriceFormat(valueList.reduce((result, item) => {
                return result + item.price
              }, 0)) : 0}
            </Text>
          </Flex>
        </Box>
        {hasAccount ? (
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
        <Grid gridTemplateColumns={`repeat(${isMobile ? 2 : 4}, 1fr)`} style={{ flex: 1 }}>
          {valueList.map((valueItem, index) => (
            <Box
              className={`mt-s20 mb-s24 pr-s32 ${index > 0 ? 'pl-s32' : 'pl-s40'}`}
              borderLeft={index > 0 && '1px solid'}
              borderColor={ColorStyles.LIGHTGREY}
            >
              <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                {valueItem.title}
              </Text>
              <Text textStyle="R_16M" color={ColorStyles.BLACK} className="mt-s8">
                {hasAccount ? convertToBalanceFormat(valueItem.value) : 0}
              </Text>
              <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                = ${hasAccount ? convertToPriceFormat(valueItem.price) : 0}
              </Text>
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
