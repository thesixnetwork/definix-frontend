import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { usePriceTVL, usePriceWeb3TVL } from 'state/hooks'
import {
  Card,
  CardBody,
  ColorStyles,
  Text,
  textStyle,
  Flex,
  ChainBscIcon,
  ChainKlaytnIcon,
  useMatchBreakpoints,
} from 'definixswap-uikit-v2'

const Title = styled(Text)`
  ${({ theme }) => theme.textStyle.R_18M}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_14M}
  }
`

const TotalTvlValue = styled(Text)`
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
  ${({ theme }) => theme.textStyle.R_32B}
  margin-top: 8px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${({ theme }) => theme.textStyle.R_26B}
    margin-top: 6px;
  }
`

const WrapTvl = styled(Flex)`
  margin-top: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 30px;
    flex-direction: column;
  }
`

const TvlItem = styled(Flex)`
  flex-direction: column;
  width: 50%;

  :last-child {
    border-left: 1px solid ${({ theme }) => theme.colors.lightgrey};
    padding-left: 40px;
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;

    :last-child {
      margin-bottom: 0;
      padding-left: 0;
      border-left: none;
    }
  }
`

const TvlValue = styled(Text)`
  margin-top: 8px;
  ${({ theme }) => theme.textStyle.R_23B}

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
    ${({ theme }) => theme.textStyle.R_16B}
  }
`

const WrapCardBody = styled(CardBody)`
  margin-top: 8px;
  padding: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 0;
    padding: 24px;
  }
`

const CardTVL = () => {
  const { isXxl } = useMatchBreakpoints()
  const { t } = useTranslation()
  const { fastRefresh } = useRefresh()
  const totalTVL = usePriceTVL().toNumber()
  const totalWeb3TVL = usePriceWeb3TVL().toNumber()

  useEffect(() => {
    fetchTVL()
  }, [fastRefresh])

  return (
    <Card>
      <WrapCardBody>
        <Title>{t('Total Value Locked')}</Title>
        <TotalTvlValue>
          ${' '}
          {(totalTVL || 0) + (totalWeb3TVL || 0) <= 0
            ? 'N/A'
            : ((totalTVL || 0) + (totalWeb3TVL || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </TotalTvlValue>
        <WrapTvl>
          <TvlItem>
            <Flex alignItems="center">
              <ChainBscIcon viewBox="0 0 32 32" width={isXxl ? '24' : '22'} height={isXxl ? '24' : '22'} />
              <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                <Trans
                  i18nKey="TVL in <bold>BSC</bold>"
                  components={{
                    bold: <strong />,
                  }}
                />
              </Text>
            </Flex>
            <TvlValue>$ {totalWeb3TVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}</TvlValue>
          </TvlItem>
          <TvlItem>
            <Flex alignItems="center">
              <ChainKlaytnIcon viewBox="0 0 22 22" width={isXxl ? '24' : '22'} height={isXxl ? '24' : '22'} />
              <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                <Trans
                  i18nKey="TVL in <bold>Klaytn</bold>"
                  components={{
                    bold: <strong />,
                  }}
                />
              </Text>
            </Flex>
            <TvlValue>$ {totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}</TvlValue>
          </TvlItem>
        </WrapTvl>
      </WrapCardBody>
    </Card>
  )
}

export default CardTVL
