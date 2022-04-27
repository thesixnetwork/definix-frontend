import { get, pick } from 'lodash-es'
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { useAllHarvest } from 'hooks/useHarvest'
import { useHarvest, usePrivateData } from 'hooks/useLongTermStake'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { useToast } from 'state/hooks'
import { Button, Text, Box, ColorStyles, Flex, FireIcon } from '@fingerlabs/definixswap-uikit-v2'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/Text/CurrencyText'
import BalanceText from 'components/Text/BalanceText'
import Slide from './Slide'
import { QuoteToken } from 'config/constants/types'
import { FINGER_FARMS } from 'config/constants/farms'

interface InnerTheme {
  totalTitleColor: ColorStyles
  totalBalanceColor: ColorStyles
  totalCurrencyColor: ColorStyles
  itemTitleColor: ColorStyles
  itemBalanceColor: ColorStyles
  itemCurrencyColor: ColorStyles | string
  borderColor: ColorStyles
  bottomBg: ColorStyles | string
  slideDotColor: ColorStyles | string
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
    slideDotColor: '#5e515f',
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
  opacity: 0.8;
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
  unit = QuoteToken.FINIX,
}) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [currentHarvestIndex, setCurrentHarvestIndex] = useState(0)
  const [harvestResultList, setHarvestResultList] = useState([])

  const curTheme = useMemo(() => THEME[theme], [theme])
  const displayOnlyTotalPrice = useMemo(() => typeof get(total, 'value') !== 'number', [total])
  const totalValue = useMemo(() => {
    return get(total, displayOnlyTotalPrice ? 'price' : 'value') || 0
  }, [displayOnlyTotalPrice, total])

  // farm, pool
  const farmsWithBalance = useFarmsWithBalance()
  const myFarmPools = useMemo(() => {
    const favorPids = FINGER_FARMS.map(({ pid }) => pid);
    const list =  farmsWithBalance.filter((balanceType) => balanceType.balance.toNumber() > 0)
    if (unit === QuoteToken.FINGER) {
      return list.filter(({ pid }) => !!favorPids.includes(pid))
    }
    return list;
  }, [farmsWithBalance, unit])

  const farmPoolHarvestHook = useAllHarvest(
    myFarmPools.map((farmWithBalance) => pick(farmWithBalance, ['pid', 'lpSymbol'])),
  )
  // long term stake
  const { finixEarn } = usePrivateData()
  const longTermStakeHarvestHook = useHarvest()
  const needHarvestLongTermStake = useMemo(() => unit === QuoteToken.FINGER ? false : finixEarn > 0, [unit, finixEarn])

  const harvestAllLength = useRef(0)
  const isHarvestingUsingKlip = useMemo(() => {
    return harvestAllLength.current > 0 && farmPoolHarvestHook.harvestResultList.length < harvestAllLength.current
  }, [harvestAllLength, farmPoolHarvestHook])

  const harvestLongTermStake = useCallback(async () => {
    let isSuccess = false
    try {
      await longTermStakeHarvestHook.handleHarvest()
      isSuccess = true
    } catch (error) {
      console.warn('EarningBoxTemplate/harvestLongTermStake] error: ', error)
    } finally {
      setHarvestResultList((prev) => [
        {
          symbol: 'Long-term Stake',
          isSuccess,
        },
        ...prev,
      ])
    }
  }, [longTermStakeHarvestHook])

  const harvestAll = useCallback(async () => {
    if (pendingTx || isHarvestingUsingKlip) return
    harvestAllLength.current = needHarvestLongTermStake ? myFarmPools.length + 1 : myFarmPools.length
    setPendingTx(true)

    try {
      await farmPoolHarvestHook.onReward()
      if (needHarvestLongTermStake) {
        setCurrentHarvestIndex((prev) => prev + 1)
        await harvestLongTermStake()
      }
    } catch (error) {
      // TODO: find a way to handle when the user rejects transaction or it fails
    } finally {
      setCurrentHarvestIndex(0)
      setPendingTx(false)
      harvestAllLength.current = 0
    }
  }, [
    harvestLongTermStake,
    farmPoolHarvestHook,
    needHarvestLongTermStake,
    myFarmPools.length,
    pendingTx,
    isHarvestingUsingKlip,
  ])

  const showHarvestResult = useCallback(() => {
    const toastDescription = (
      <Text textStyle="R_12R" color={ColorStyles.MEDIUMGREY}>
        {harvestResultList[0].symbol}
      </Text>
    )
    const actionText = t('actionHarvest')
    if (harvestResultList[0].isSuccess) {
      toastSuccess(t('{{Action}} Complete', { Action: actionText }), toastDescription)
    } else {
      toastError(t('{{Action}} Failed', { Action: actionText }), toastDescription)
    }
  }, [toastSuccess, toastError, harvestResultList, t])

  useEffect(() => {
    if (harvestResultList.length === 0) return
    showHarvestResult()
  }, [harvestResultList.length, showHarvestResult])

  useEffect(() => {
    setHarvestResultList(farmPoolHarvestHook.harvestResultList)
  }, [farmPoolHarvestHook.harvestResultList, setHarvestResultList])

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
            <Text
              textStyle={`R_${isMobile ? '14' : '18'}M`}
              color={curTheme.totalTitleColor}
              style={{ opacity: '0.7' }}
              ml={isMobile ? 8 : 4}
            >
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
                  isLoading={pendingTx && !isHarvestingUsingKlip}
                  disabled={myFarmPools.length <= 0 && !needHarvestLongTermStake}
                  onClick={harvestAll}
                >
                  {pendingTx && isHarvestingUsingKlip
                    ? `${t('Harvesting')} (${currentHarvestIndex + 1}/${harvestAllLength.current})`
                    : t('Harvest')}
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
            unit={unit}
          />
        )}
      </SlideSection>
    </Wrap>
  )
}

export default EarningBoxTemplate
