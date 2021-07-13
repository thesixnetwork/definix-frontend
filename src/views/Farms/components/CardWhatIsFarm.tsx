import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Card, Heading, Text } from 'uikit-dev'
import man from 'uikit-dev/images/for-Farm-Elements/1558.png'
import bg from 'uikit-dev/images/for-Farm-Elements/bg.jpg'

const MaxWidth = styled.div`
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
`

const WhatIsFarm = styled.div`
  padding: 40px 24px;
  width: 100%;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: 25% center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  img {
    width: 160px;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.5;
  }

  a {
    flex-shrink: 0;
    margin-left: 2rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    background-position: center 40%;

    > div {
      flex-direction: row;
    }

    img {
      margin: 0;
    }
  }
`

const CardWhatIsFarm = () => {
  const { t } = useTranslation()

  return (
    <Card className="mb-6">
      <WhatIsFarm>
        <MaxWidth>
          <img src={man} alt="" />

          <div>
            <Heading as="h2" fontSize="28px !important" color="#FFF" className="mb-2">
              {t('What is Farm?')}
            </Heading>
            <p>
              {t('Farm is a place you can stake your LP tokens in order to generate high returns in the form of FINIX. The amount of returns will be calculated by the annual percentage rate (APR). The APR of each farm will be different and fluctuated due to the size of the pool. You can choose any farm you like to start farming now.')}
            </p>
          </div>
        </MaxWidth>
      </WhatIsFarm>

      <MaxWidth className="py-6 px-6">
        <Heading as="h2" fontSize="28px !important" className="mb-4">
          {t('How to farm in just 1, 2, 3')}
        </Heading>
        <Heading as="h3" className="mb-1" color="primary">
          {t('1. Choose a farm you like')}
        </Heading>
        <Text className="mb-3">{t('See the list of the active farms and decide which farm you want to stake.')}</Text>

        <Heading as="h3" className="mb-1" color="primary">
          {t('2. Add liquidity')}
        </Heading>
        <Text className="mb-3">
          {t('For example, if you want to stake in FINIX-SIX LP farm, you go to “Liquidity” menu and add your FINIX and SIX tokens to liquidity pool. You’ll get FINIX-SIX LP tokens from this step.')}
        </Text>

        <Heading as="h3" className="mb-1" color="primary">
          {t('3. Start farming')}
        </Heading>
        <Text className="mb-3">
          {t('Bring your LP tokens that you’ve got from the previous step to stake in the farm and earn much more FINIX as a return!')}
        </Text>

        <Text color="primary">
          {t('Don’t have cryptocurrency for a farm you want to stake ? No worries, you can use swap to exchange for what you want.')}
        </Text>
      </MaxWidth>
    </Card>
  )
}

export default CardWhatIsFarm
