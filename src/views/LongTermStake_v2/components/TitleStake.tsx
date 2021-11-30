import React from 'react'
import { useTranslation } from 'react-i18next'
import { TitleSet, Flex } from 'definixswap-uikit'

const TitleStake: React.FC = () => {
  const { t } = useTranslation()

  return (
    <>
      <Flex mb="S_40">
        <TitleSet
          title={t('Long-term Stake')}
          description={t('Stake FINIX to earn vFINIX')}
          linkLabel={t('Learn how to Long-term stake')}
          link="/long-term-stake"
        />
      </Flex>
    </>
  )
}

export default TitleStake
