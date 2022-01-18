import React from 'react'
import { useTranslation } from 'react-i18next'
import { TitleSet, Flex } from '@fingerlabs/definixswap-uikit-v2'

const TitleVoting: React.FC = () => {
  const { t, i18n } = useTranslation()

  const getLink = () => {
    if (i18n.language === 'ko') {
      return 'https://sixnetwork.gitbook.io/definix-on-klaytn-kr/long-term-stake/how-to-use-long-term-stake'
    }
    return 'https://sixnetwork.gitbook.io/definix-on-klaytn-en/long-term-stake/how-to-use-long-term-stake'
  }

  return (
    <>
      <Flex mb="S_40">
        <TitleSet
          title={t('Voting')}
          description={t('Drive forward together')}
          linkLabel={t('Learn how to vote')}
          link={getLink()}
          linkBottom
        />
      </Flex>
    </>
  )
}

export default TitleVoting
