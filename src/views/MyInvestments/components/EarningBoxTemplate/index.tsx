import _ from 'lodash'
import React, { useCallback, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { useAllHarvest } from 'hooks/useHarvest'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { Button, Text, Box, ColorStyles, Flex, FireIcon } from 'definixswap-uikit-v2'
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
    slideDotColor: ColorStyles.LIGHTGREY,
    slideDotActiveColor: ColorStyles.BLACK,
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
  },
}

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

  const curTheme = useMemo(() => THEME[theme], [theme])
  const displayOnlyTotalPrice = useMemo(() => typeof _.get(total, 'value') !== 'number', [total])
  const totalValue = useMemo(() => {
    return _.get(total, displayOnlyTotalPrice ? 'price' : 'value') || 0
  }, [displayOnlyTotalPrice, total])

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

  const renderTotalValue = useCallback(() => {
    const props = {
      textStyle: `R_${isMobile ? '23' : '32'}B`,
      color: curTheme.totalBalanceColor,
      value: hasAccount ? totalValue : 0,
    }
    return displayOnlyTotalPrice ? <CurrencyText {...props} /> : <BalanceText {...props} />
  }, [displayOnlyTotalPrice, isMobile, curTheme, hasAccount, totalValue])

  return (
    <Box>
      <MainSection>
        <Box>
          <Flex alignItems="flex-end" className={`mb-s${isMobile ? '20' : '8'}`}>
            <FireIcon style={{ marginLeft: '-8px' }} />
            <Text textStyle={`R_${isMobile ? '14' : '18'}M`} color={curTheme.totalTitleColor} ml={4}>
              {total.title}
            </Text>
          </Flex>
          <Flex alignItems="flex-end">
            {renderTotalValue()}
            {!displayOnlyTotalPrice && (
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
      {valueList.length > 0 && (
        <Slide
          isMobile={isMobile}
          hasAccount={hasAccount}
          displayOnlyTotalPrice={displayOnlyTotalPrice}
          curTheme={curTheme}
          data={valueList}
        />
      )}
    </Box>
  )
}

export default EarningBoxTemplate
