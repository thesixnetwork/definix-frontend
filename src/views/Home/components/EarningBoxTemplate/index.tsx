import { get, pick } from 'lodash-es'
import React, { useCallback, useState, useMemo, useEffect, useRef } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { useAllHarvest } from 'hooks/useHarvest'
// import { useHarvest, usePrivateData } from 'hooks/useLongTermStake'
import useFarmsWithBalance from 'hooks/useFarmsWithBalance'
import { useToast } from 'state/hooks'
import { Text, Box, ColorStyles, Flex, FireIcon } from '@fingerlabs/definixswap-uikit-v2'
import UnlockButton from 'components/UnlockButton'
import CurrencyText from 'components/Text/CurrencyText'
import BalanceText from 'components/Text/BalanceText'
import Slide from './Slide'
import { QuoteToken } from 'config/constants/types'
import { FAVOR_FARMS } from 'config/constants/farms'
import { mediaQueries, spacing } from 'uikitV2/base'
import { textStyle } from 'uikitV2/text'
import { Button } from '@mui/material'

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
  ${mediaQueries.mobileXl} {
    min-height: 100%;
  }
`
const MainSection = styled(Flex)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-top: ${spacing.S_28}px;
  padding-bottom: ${spacing.S_40}px;
  padding-left: ${spacing.S_40}px;
  padding-right: ${spacing.S_40}px;
  ${mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
    padding: ${spacing.S_20}px;
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
  ${mediaQueries.mobileXl} {
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
  ${mediaQueries.mobileXl} {
    flex-direction: column;
    align-items: flex-start;
  }
`
const UnitText = styled(Text)<{ curTheme: any }>`
  margin-left: ${spacing.S_6}px;
  margin-bottom: ${spacing.S_2}px;
  ${textStyle.R_16M};
  color: ${({ theme, curTheme }) => theme.colors[curTheme.totalBalanceColor]};
  ${mediaQueries.mobileXl} {
    margin-bottom: -2px;
    ${textStyle.R_14M};
  }
`
const TotalPriceText = styled(CurrencyText)<{ curTheme: any }>`
  margin-left: ${spacing.S_16}px;
  margin-bottom: ${spacing.S_2}px;
  ${textStyle.R_16M};
  color: ${({ theme, curTheme }) => theme.colors[curTheme.totalCurrencyColor]};
  ${mediaQueries.mobileXl} {
    margin-left: 0;
    margin-bottom: 0;
    margin-top: 4px;
    ${textStyle.R_14M};
  }
  opacity: 0.8;
`
const SlideSection = styled(Box)`
  height: 112px;
  ${mediaQueries.mobileXl} {
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
  const history = useHistory()
  const { toastSuccess, toastError } = useToast()
  const [pendingTx, setPendingTx] = useState(false)
  const [currentHarvestIndex, setCurrentHarvestIndex] = useState(0)
  const [harvestResultList, setHarvestResultList] = useState([])

  const curTheme = useMemo(() => THEME[theme], [theme])
  const displayOnlyTotalPrice = useMemo(() => typeof get(total, 'value') !== 'number', [total])

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
              style={{ opacity: '0.7', marginLeft: isMobile ? 8 : 4 }}
            >
              {total.title}
            </Text>
          </Flex>
          <TotalValuesWrap>
            <Flex alignItems="flex-end">
              {/* {renderTotalValue()} */}
              <UnitText curTheme={curTheme}>{unit.length > 0 ? unit : null}</UnitText>
            </Flex>
            {!displayOnlyTotalPrice && (
              <TotalPriceText curTheme={curTheme} value={hasAccount ? total.price : 0} prefix="=" />
            )}
          </TotalValuesWrap>
        </Box>
        <ButtonWrap curTheme={curTheme} style={{ marginTop: isMobile ? 20 : 0 }}>
          {useHarvestButton && (
            <>
              {hasAccount ? (
                <Button
                  variant="contained"
                  color="primary"
                  style={{ width: '100%' }}
                  className="home-harvest-button"
                  // disabled={myFarmPools.length <= 0 && !needHarvestLongTermStake}
                  // md
                  // width="100%"
                  // variant="red"
                  // isLoading={pendingTx && !isHarvestingUsingKlip}
                  // onClick={harvestAll}
                >
                  {/* {pendingTx && isHarvestingUsingKlip
                    ? `Harvesting (${currentHarvestIndex + 1}/${harvestAllLength.current})`
                    : 'Harvest'} */}
                  Harvest
                </Button>
              ) : (
                <UnlockButton />
              )}
            </>
          )}

          {isMain && (
            <Button
              variant="contained"
              color="secondary"
              style={{ width: '100%', marginTop: isMobile ? 0 : 12 }}
              // md
              // variant="brown"
              // width="100%"
              // mt={isMobile ? '0' : '12px'}
              onClick={() => history.push('/my')}
            >
              Detail
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
