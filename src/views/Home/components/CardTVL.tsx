import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { usePriceTVL, usePriceWeb3TVL } from 'state/hooks'
import { Card, CardBody, ColorStyles, Text, textStyle, Flex, ChainBscIcon, ChainKlaytnIcon, useMatchBreakpoints } from 'definixswap-uikit'

const Title = styled(Text)`
  ${css(textStyle.R_14M)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};

  ${({ theme }) => theme.mediaQueries.xl} {
    ${css(textStyle.R_18M)}
  }
`

const TotalTvlValue = styled(Text)`
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};
  ${css(textStyle.R_26B)}
  margin-top: 6px;

  ${({ theme }) => theme.mediaQueries.xl} {
    ${css(textStyle.R_32B)}
    margin-top: 8px;
  }
`

const StyledWrap = styled(Flex)`
  margin-top: 30px;
  flex-direction: column;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 40px;
    flex-direction: row;
  }
`

const StyledTVL = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;

  :last-child {
    margin-bottom: 0;
  }

  ${({ theme }) => theme.mediaQueries.xl} {
    flex-direction: column;
    width: 50%;
    margin-bottom: 0;

    :nth-child(2) {
      border-left: 1px solid ${({ theme }) => theme.colors.lightgrey};
      padding-left: 40px;
    }
  }
`

const TvlValue = styled(Text)`
  ${css(textStyle.R_16B)}

${({ theme }) => theme.mediaQueries.xl} {
    ${css(textStyle.R_23B)}
  }
`

const StyledCardBody = styled(CardBody)`
  padding: 24px;

  ${({ theme }) => theme.mediaQueries.xl} {
    margin-top: 8px;
    padding: 40px;
  }
`

const CardTVL = () => {
  const { isXxl } = useMatchBreakpoints();
  const { t } = useTranslation()
  const { fastRefresh } = useRefresh()
  const totalTVL = usePriceTVL().toNumber()
  const totalWeb3TVL = usePriceWeb3TVL().toNumber()

  useEffect(() => {
    fetchTVL()
  }, [fastRefresh])

  return (
    <Card>
      <StyledCardBody>
        <Title>{t('Total Value Locked')}</Title>
        <TotalTvlValue>
          ${' '}
          {(totalTVL || 0) + (totalWeb3TVL || 0) <= 0
            ? 'N/A'
            : ((totalTVL || 0) + (totalWeb3TVL || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </TotalTvlValue>
        <StyledWrap>
          <StyledTVL>
            <Flex alignItems="center">
              <ChainBscIcon viewBox="0 0 32 32" width={isXxl ? "24" : "22"} />
              <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                <Trans
                  i18nKey="TVL in <bold>BSC</bold>"
                  components={{
                    bold: <strong />,
                  }}
                />
              </Text>
            </Flex>
            <TvlValue>
              $ {totalWeb3TVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </TvlValue>
          </StyledTVL>
          <StyledTVL>
            <Flex alignItems="center">
              <ChainKlaytnIcon viewBox="0 0 22 22" width={isXxl ? "24" : "22"} />
              <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                <Trans
                  i18nKey="TVL in <bold>Klaytn</bold>"
                  components={{
                    bold: <strong />,
                  }}
                />
              </Text>
            </Flex>
            <TvlValue>
              $ {totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </TvlValue>
          </StyledTVL>
        </StyledWrap>
      </StyledCardBody>
    </Card>
  )
}

export default CardTVL
