import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import {
  Card,
  CardBody,
  ColorStyles,
  Text,
  textStyle,
  Flex,
  Button,
  FireIcon,
  useMatchBreakpoints,
} from 'definixswap-uikit'
import FinixHarvestTotalBalance from 'views/MyInvestments/components/FinixHarvestTotalBalance'
import FinixHarvestPool from 'views/MyInvestments/components/FinixHarvestPool'
import FinixHarvestBalance from 'views/MyInvestments/components/FinixHarvestBalance'

const Title = styled(Text)`
  ${css(textStyle.R_14M)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};

  ${({ theme }) => theme.mediaQueries.xl} {
    ${css(textStyle.R_18M)}
  }
`

const ButtonWrapFlex = styled(Flex)`
  margin-top: 20px;
  justify-content: center;
  align-items: center;

  min-width: 186px;

  > button {
    width: 50%;

    &:first-child {
      margin-right: 8px;
    }
    &:last-child {
      margin-left: 8px;
    }
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 0;
    flex-direction: column;

    > button {
      width: 100%;

      &:first-child {
        margin-right: 0;
      }

      &:last-child {
        margin-left: 0;
        margin-top: 12px;
      }
    }
  }
`

const TopFlex = styled(Flex)`
  flex-direction: column;
  padding: 24px 20px 20px;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: row;
    justify-content: space-between;
    padding: 22px 40px 32px 32px;
  }
`

const TotalEarnedFlex = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
`

const TotalEarnedTitle = styled(Flex)`
  align-items: center;
`

const BottomFlex = styled(Flex)`
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.black20};

  ${({ theme }) => theme.mediaQueries.xl} {
    padding-left: 8px;
    padding-top: 20px;
    padding-bottom: 24px;
  }
`

const EarnedItem = styled(Flex)`
  flex-direction: column;
  padding: 16px 0;

  border-bottom: 1px solid ${({ theme }) => theme.colors.brown};

  :last-child {
    border-bottom: none;
  }

  .title {
    ${css(textStyle.R_12R)}
    color: ${({ theme }) => theme.colors.mediumgrey};
    margin-bottom: 6px;
  }

  .sum {
    ${css(textStyle.R_14B)}
    color: ${({ theme }) => theme.colors.white};
  }

  .usd {
    ${css(textStyle.R_12M)}
    color: ${({ theme }) => theme.colors.white80};
    margin-left: 8px;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    padding: 0;
    padding-left: 32px;
    width: 25%;
    border-left: 1px solid ${({ theme }) => theme.colors.brown};
    border-bottom: none;

    :first-child {
      border-left: none;
    }

    .title {
      ${css(textStyle.R_14R)}
    }

    .sum {
      ${css(textStyle.R_16M)}
    }

    .usd {
      ${css(textStyle.R_14M)}
      margin-left: 0;
    }
  }
`

const EarnedItemValue = styled(Flex)`
  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
  }
`

const WrapFlex = styled(Flex)`
  flex-direction: column;
  flex-wrap: nowrap;
  width: 100%;
  height: 50%;
  padding: 4px 20px 0;

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-wrap: wrap;
    flex-direction: row;
    width: 90%;
    height: 100%;
  }
`

const Pagination = styled(Flex)`
  width: 100%;
  padding-bottom: 20px;

  ${({ theme }) => theme.mediaQueries.xl} {
    display: none;
  }
`

const CardInvestment = () => {
  const { isXxl } = useMatchBreakpoints()
  const { t } = useTranslation()

  return (
    <Card bg={ColorStyles.DEEPBROWN}>
      <CardBody p="0">
        <TopFlex>
          <TotalEarnedFlex>
            <TotalEarnedTitle>
              <FireIcon viewBox="0 0 44 44" width={isXxl ? '44' : '24'} />
              <Title ml="S_14">{t('Total Finix Earned')}</Title>
            </TotalEarnedTitle>
            <FinixHarvestTotalBalance />
          </TotalEarnedFlex>
          <ButtonWrapFlex>
            <Button md variant="red">
              {t('Harvest')}
            </Button>
            <Button md variant="brown">
              {t('Detail')}
            </Button>
          </ButtonWrapFlex>
        </TopFlex>
        <BottomFlex>
          <WrapFlex>
            <EarnedItem>
              <Text className="title">Farm</Text>
              <EarnedItemValue>
                <FinixHarvestBalance />
              </EarnedItemValue>
            </EarnedItem>
            <EarnedItem>
              <Text className="title">Pool</Text>
              <EarnedItemValue>
                <FinixHarvestPool />
              </EarnedItemValue>
            </EarnedItem>
            <EarnedItem>
              <Text className="title">Rebalanceing</Text>
              <EarnedItemValue>
                <FinixHarvestPool />
              </EarnedItemValue>
            </EarnedItem>
          </WrapFlex>
          <Pagination />
        </BottomFlex>
      </CardBody>
    </Card>
  )
}

export default CardInvestment
