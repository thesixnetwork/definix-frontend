import React, { useEffect } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation, Trans } from 'react-i18next'
import useRefresh from 'hooks/useRefresh'
import { fetchTVL } from 'state/actions'
import { usePriceTVL, usePriceWeb3TVL } from 'state/hooks'
import { Card, CardBody, ColorStyles, Text, textStyle, Flex, ChainBscIcon, ChainKlaytnIcon } from 'definixswap-uikit'

const Title = styled(Text)`
  ${css(textStyle.R_18M)}
  color: ${({ theme }) => theme.colors[ColorStyles.MEDIUMGREY]};
`

const StyledTVL = styled(Flex)`
  flex-direction: column;
  width: 50%;

  :nth-child(2) {
    border-left: 1px solid ${({ theme }) => theme.colors.lightgrey};
    padding-left: 40px;
  }
`

const CardTVL = () => {
  const { t } = useTranslation()
  const { fastRefresh } = useRefresh()
  const totalTVL = usePriceTVL().toNumber()
  const totalWeb3TVL = usePriceWeb3TVL().toNumber()

  useEffect(() => {
    fetchTVL()
  }, [fastRefresh])

  return (
    <Card>
      <CardBody p="S_40">
        <Title>{t('Total Value Locked')}</Title>
        <Text mt="S_8" textStyle="R_32B" color="black">
          ${' '}
          {(totalTVL || 0) + (totalWeb3TVL || 0) <= 0
            ? 'N/A'
            : ((totalTVL || 0) + (totalWeb3TVL || 0)).toLocaleString('en-US', { maximumFractionDigits: 0 })}
        </Text>
        <Flex mt="S_40">
          <StyledTVL>
            <Flex alignItems="center">
              <ChainBscIcon viewBox="0 0 32 32" width="24" height="24" />
              <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                <Trans
                  i18nKey="TVL in <bold>BSC</bold>"
                  components={{
                    bold: <strong />,
                  }}
                />
              </Text>
            </Flex>
            <Text mt="S_8" textStyle="R_23B">
              $ {totalWeb3TVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </StyledTVL>
          <StyledTVL>
            <Flex alignItems="center">
              <ChainKlaytnIcon viewBox="0 0 22 22" width="24" height="24" />
              <Text ml="S_8" textStyle="R_14R" color="mediumgrey">
                <Trans
                  i18nKey="TVL in <bold>Klaytn</bold>"
                  components={{
                    bold: <strong />,
                  }}
                />
              </Text>
            </Flex>
            <Text mt="S_8" textStyle="R_23B">
              $ {totalTVL.toLocaleString('en-US', { maximumFractionDigits: 0 })}
            </Text>
          </StyledTVL>
        </Flex>
      </CardBody>
    </Card>
  )
}

export default CardTVL
