import _ from 'lodash'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { useAllHarvest } from 'hooks/useHarvest'
import { useHarvest, usePrivateData } from 'hooks/useLongTermStake'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { Button, Text, Box, ColorStyles, Flex, FireIcon } from '@fingerlabs/definixswap-uikit-v2'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/CurrencyText'
import BalanceText from 'components/BalanceText'
import Slide from './Slide'

interface InnerTheme {
  totalTitleColor: ColorStyles
  totalBalanceColor: ColorStyles
  totalCurrencyColor: ColorStyles
  itemTitleColor: ColorStyles
  itemBalanceColor: ColorStyles
  itemCurrencyColor: ColorStyles | string
  borderColor: ColorStyles
  bottomBg: ColorStyles | string
  slideDotColor: ColorStyles
  slideDotActiveColor: ColorStyles
  harvestButtonBg: ColorStyles | string
  harvestButtonColor: string
}

const THEME: { [key: string]: InnerTheme } = {
  white: {
    totalTitleColor: ColorStyles.MEDIUMGREY,
    totalBalanceColor: ColorStyles.BLACK,
    totalCurrencyColor: ColorStyles.DEEPGREY,
    itemTitleColor: ColorStyles.MEDIUMGREY,
    itemBalanceColor: ColorStyles.BLACK,
    itemCurrencyColor: ColorStyles.DEEPGREY,
    borderColor: ColorStyles.LIGHTGREY,
    bottomBg: ColorStyles.LIGHTGREY_20,
    slideDotColor: ColorStyles.LIGHTGREY,
    slideDotActiveColor: ColorStyles.BLACK,
    harvestButtonBg: ColorStyles.LIGHTGREY,
    harvestButtonColor: 'rgba(255, 255, 255, 0.5)',
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
    slideDotColor: ColorStyles.BROWN,
    slideDotActiveColor: ColorStyles.WHITE,
    harvestButtonBg: 'brown30',
    harvestButtonColor: 'rgba(255, 255, 255, 0.1)',
  },
}

const Wrap = styled(Box)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 276px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    min-height: 100%;
  }
`
const MainSection = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${({ theme }) => theme.spacing.S_28}px;
  padding-bottom: ${({ theme }) => theme.spacing.S_40}px;
  padding-left: ${({ theme }) => theme.spacing.S_40}px;
  padding-right: ${({ theme }) => theme.spacing.S_40}px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
    padding: ${({ theme }) => theme.spacing.S_20}px;
  }
`
const ButtonWrap = styled(Flex)<{ curTheme: any }>`
  width: 186px;
  flex-direction: column;
  .home-harvest-button {
    &.definix-button--disabled:not(.definix-button--loading) {
      background-color: ${({ theme, curTheme }) => theme.colors[curTheme.harvestButtonBg]};
      color: ${({ curTheme }) => curTheme.harvestButtonColor};
    }
  }
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
const TotalValuesWrap = styled(Flex)`
  align-items: flex-end;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
  }
`
const UnitText = styled(Text)<{ curTheme: any }>`
  margin-left: ${({ theme }) => theme.spacing.S_6}px;
  margin-bottom: ${({ theme }) => theme.spacing.S_2}px;
  ${({ theme }) => theme.textStyle.R_16M};
  color: ${({ theme, curTheme }) => theme.colors[curTheme.totalBalanceColor]};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-bottom: -2px;
    ${({ theme }) => theme.textStyle.R_14M};
  }
`
const TotalPriceText = styled(CurrencyText)<{ curTheme: any }>`
  margin-left: ${({ theme }) => theme.spacing.S_16}px;
  margin-bottom: ${({ theme }) => theme.spacing.S_2}px;
  ${({ theme }) => theme.textStyle.R_16M};
  color: ${({ theme, curTheme }) => theme.colors[curTheme.totalCurrencyColor]};
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-left: 0;
    margin-bottom: 0;
    margin-top: 4px;
    ${({ theme }) => theme.textStyle.R_14M};
  }
`
const SlideSection = styled(Box)`
  height: 112px;
  ${({ theme }) => theme.mediaQueries.mobileXl} {
    height: auto;
  }
`

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
  useHarvestButton?: boolean
  unit?: string
}> = ({
  isMobile,
  isMain = false,
  hasAccount,
  total,
  valueList,
  theme = 'white',
  useHarvestButton = true,
  unit = '',
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [pendingTx, setPendingTx] = useState(false)

  const curTheme = useMemo(() => THEME[theme], [theme])
  const displayOnlyTotalPrice = useMemo(() => typeof _.get(total, 'value') !== 'number', [total])
  const totalValue = useMemo(() => {
    return _.get(total, displayOnlyTotalPrice ? 'price' : 'value') || 0
  }, [displayOnlyTotalPrice, total])

  const { finixEarn } = usePrivateData()
  const farmsWithBalance = useFarmsWithBalance()
  const balancesWithValue = useMemo(() => {
    return farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
  }, [farmsWithBalance])
  const { onReward } = useAllHarvest(balancesWithValue.map((farmWithBalance) => farmWithBalance.pid))
  const { handleHarvest } = useHarvest()

  const harvestAll = useCallback(async () => {
    // console.log('EarningBoxTemplate/balancesWithValue] ', balancesWithValue.map((p) => `${p.pid} - ${p.lpSymbol}`))
    setPendingTx(true)
    try {
      await onReward()
      if (finixEarn) {
        await handleHarvest()
      }
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setPendingTx(false)
    }
  }, [handleHarvest, onReward, finixEarn])

  const renderTotalValue = useCallback(() => {
    const props = {
      textStyle: `R_${isMobile ? '23' : '32'}B`,
      color: curTheme.totalBalanceColor,
      value: hasAccount ? totalValue : 0,
    }
    return displayOnlyTotalPrice ? <CurrencyText {...props} /> : <BalanceText {...props} />
  }, [displayOnlyTotalPrice, isMobile, curTheme, hasAccount, totalValue])

  return (
    <Wrap>
      <MainSection>
        <Box>
          <Flex alignItems="flex-end" className={`mb-s${isMobile ? '20' : '8'}`}>
            <FireIcon
              style={{ marginLeft: isMobile ? '0' : '-8px' }}
              width={isMobile ? '24px' : '44px'}
              height={isMobile ? '24px' : '44px'}
              viewBox="0 0 44 44"
            />
            <Text textStyle={`R_${isMobile ? '14' : '18'}M`} color={curTheme.totalTitleColor} ml={isMobile ? 8 : 4}>
              {total.title}
            </Text>
          </Flex>
          <TotalValuesWrap>
            <Flex alignItems="flex-end">
              {renderTotalValue()}
              <UnitText curTheme={curTheme}>{unit.length > 0 ? unit : null}</UnitText>
            </Flex>
            {!displayOnlyTotalPrice && (
              <TotalPriceText curTheme={curTheme} value={hasAccount ? total.price : 0} prefix="=" />
            )}
          </TotalValuesWrap>
        </Box>
        <ButtonWrap curTheme={curTheme} className={isMobile ? 'mt-s20' : ''}>
          {useHarvestButton && (
            <>
              {hasAccount ? (
                <Button
                  md
                  width="100%"
                  variant="red"
                  className="home-harvest-button"
                  isLoading={pendingTx}
                  disabled={balancesWithValue.length <= 0}
                  onClick={harvestAll}
                >
                  {/* {pendingTx ? `loading ${currentHarvestStackIndex + 1}/${balancesWithValue.length}...` : t('Harvest')} */}
                  {t('Harvest')}
                </Button>
              ) : (
                <UnlockButton />
              )}
            </>
          )}

          {isMain && (
            <Button md variant="brown" width="100%" mt={isMobile ? '0' : '12px'} onClick={() => history.push('/my')}>
              {t('Detail')}
            </Button>
          )}
        </ButtonWrap>
      </MainSection>

      <SlideSection>
        {valueList.length > 0 && (
          <Slide
            isMobile={isMobile}
            hasAccount={hasAccount}
            displayOnlyTotalPrice={displayOnlyTotalPrice}
            curTheme={curTheme}
            data={valueList}
          />
        )}
      </SlideSection>
    </Wrap>
  )
}

export default EarningBoxTemplate
