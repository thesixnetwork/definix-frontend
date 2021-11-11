import React from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Card, CardBody, Text, ColorStyles, textStyle } from 'definixswap-uikit'
import { Timeline } from 'react-twitter-widgets'

const WrapCardBody = styled(CardBody)`
  padding: 40px;

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    padding: 20px;
  }
`

const Title = styled(Text)`
  ${css(textStyle.R_26B)}
  color: ${({ theme }) => theme.colors[ColorStyles.BLACK]};

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    ${css(textStyle.R_20B)}
  }
`

const Inner = styled.div`
  margin-top: 24px;
  height: 400px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;

  > div {
    margin-top: -1px;
  }

  ${({ theme }) => theme.mediaQueries.mobileXl} {
    margin-top: 20px;
  }
`

const CardTweet = () => {
  const { t } = useTranslation()
  return (
    <Card>
      <WrapCardBody>
        <Title>{t('Check out the latest information of Definix')}</Title>
        <Inner>
          <Timeline
            dataSource={{
              sourceType: 'profile',
              screenName: 'DefinixOfficial',
            }}
            options={{
              id: 'profile:DefinixOfficial',
              chrome: 'noheader, nofooter',
              height: '402',
              borderColor: 'transparent',
            }}
          />
        </Inner>
      </WrapCardBody>
    </Card>
  )
}

export default CardTweet
