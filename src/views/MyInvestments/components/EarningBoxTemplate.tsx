import _ from 'lodash'
import React, { useCallback, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import useConverter from 'hooks/useConverter'
import { Button, Skeleton, Text, Box, ColorStyles, Flex, Grid, DoubleArrowButtons, FireIcon } from 'definixswap-uikit'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/CurrencyText'
import BalanceText from 'components/BalanceText'
import { useHistory } from 'react-router'
// import FinixHarvestAllBalance from './FinixHarvestTotalBalance'
// import FinixHarvestBalance from './FinixHarvestBalance'
// import FinixHarvestPool from './FinixHarvestPool'

interface InnerTheme {
  totalTitleColor: ColorStyles
  totalBalanceColor: ColorStyles
  totalCurrencyColor: ColorStyles
  itemTitleColor: ColorStyles
  itemBalanceColor: ColorStyles
  itemCurrencyColor: ColorStyles | string
  borderColor: ColorStyles
  bottomBg: ColorStyles | string
}

const THEME: { [key: string]: InnerTheme } = {
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

const MainSection = styled(Flex)<{ isMobile: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
  }
`
const ButtonWrap = styled(Flex)<{ isMobile: boolean }>`
  width: 186px;
  flex-direction: column;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    width: 100%;

    > button {
      :nth-child(1) {
        margin-right: 8px;
      }
      :nth-child(2) {
        margin-left: 8px;
      }
    }
  }
`
const GridSectionWrap = styled(Flex)<{ bg: any }>`
  justify-content: space-between;
  align-items: center;
  background-color: ${({ bg }) => bg};
`
const GridSection = styled(Grid)<{ isMobile: boolean }>`
  grid-template-columns: repeat(4, 1fr);
  flex: 1;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    grid-template-columns: repeat(1, 1fr);
  }
`
// pt-s20 pb-s24 mr-s32 ml-s${index > 0 ? '32' : '40'
const GridBox = styled(Box)<{ index: number; curTheme: InnerTheme }>`
  border-left: ${({ index, curTheme, theme }) =>
    index > 0 ? `1px solid ${theme.colors[curTheme.borderColor]}` : 'none'};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    border-left: none;
    border-top: ${({ index, curTheme, theme }) =>
      index > 0 ? `1px solid ${theme.colors[curTheme.borderColor]}` : 'none'};
  }
`

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
  isMain?: boolean
  hasAccount: boolean
  total: ValueList
  valueList: ValueList[]
  theme?: 'white' | 'dark'
}> = ({ isMobile, isMain = false, hasAccount, total, valueList, theme = 'white' }) => {
  const { t } = useTranslation()
  const history = useHistory()
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

  const classNameStore = useMemo(() => {
    return {
      mainSection: () => {
        if (isMobile) {
          return `pa-s20`
        }
        return `px-s40 pt-s28 pb-s40`
      },
      gridSectionWrap: () => {
        return isMobile ? '' : 'pr-s40'
      },
      gridBox: (index: number) => {
        if (isMobile) {
          return `pt-s${index > 0 ? '20' : '16'} pb-s16 mx-s20`
        }
        return `mt-s20 mb-s24 pr-s32 pl-s${index > 0 ? '32' : '40'}`
      },
    }
  }, [isMobile])

  const TotalValueSection = () => {
    const props = {
      textStyle: `R_${isMobile ? '23' : '32'}B`,
      color: curTheme.totalBalanceColor,
      value: hasAccount ? total.value : 0,
    }
    return hasTotalValue ? <BalanceText {...props} /> : <CurrencyText {...props} />
  }

  return (
    <Box>
      <MainSection isMobile={isMobile} className={classNameStore.mainSection()}>
        <Box>
          <Flex alignItems="flex-end" className={`mb-s${isMobile ? '20' : '8'}`}>
            <FireIcon style={{ marginLeft: '-8px' }} />
            <Text textStyle={`R_${isMobile ? '14' : '18'}M`} color={curTheme.totalTitleColor} ml={4}>
              {total.title}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            <TotalValueSection />
            {hasTotalValue && (
              <CurrencyText
                value={hasAccount ? total.price : 0}
                prefix="="
                textStyle={`R_${isMobile ? '14' : '16'}M`}
                color={curTheme.totalCurrencyColor}
                className="ml-s16"
              />
            )}
          </Flex>
        </Box>
        <ButtonWrap isMobile={isMobile} className={isMobile ? 'mt-s20' : ''}>
          {hasAccount ? (
            <Button
              // id="harvest-all"
              md
              width="100%"
              isLoading={pendingTx}
              disabled={balancesWithValue.length <= 0}
              onClick={harvestAllFarms}
            >
              {t('Harvest')}
            </Button>
          ) : (
            <UnlockButton />
          )}
          {isMain && (
            <Button md variant="brown" width="100%" mt={isMobile ? '0' : '12px'} onClick={() => history.push('/my')}>
              {t('Detail')}
            </Button>
          )}
        </ButtonWrap>
      </MainSection>
      <GridSectionWrap bg={curTheme.bottomBg} className={classNameStore.gridSectionWrap()}>
        <GridSection isMobile={isMobile}>
          {valueList.map((valueItem, index) => (
            <GridBox key={valueItem.title} index={index} curTheme={curTheme} className={classNameStore.gridBox(index)}>
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
            </GridBox>
          ))}
        </GridSection>
        {!isMobile && (
          <DoubleArrowButtons
            disableLeftArrow
            disableRightArrow
            onClickLeftArrow={() => alert('click left')}
            onClickRightArrow={() => alert('click right')}
          />
        )}
      </GridSectionWrap>
    </Box>
  )
}

export default EarningBoxTemplate
