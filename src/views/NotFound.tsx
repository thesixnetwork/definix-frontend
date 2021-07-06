import Page from 'components/layout/Page'
import { useTranslation } from 'contexts/Localization'
import React from 'react'
import styled from 'styled-components'
import { Button, Heading, Text } from 'uikit-dev'

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Page>
      <StyledNotFound>
        <Heading size="xxl">404</Heading>
        <Text mb="16px">{t('Page not found.')}</Text>
        <Button as="a" href="/" size="sm">
          {t('Back')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
