import Page from 'components/layout/Page'
import useI18n from 'hooks/useI18n'
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
  const TranslateString = useI18n()

  return (
    <Page>
      <StyledNotFound>
        <Heading size="xxl">404</Heading>
        <Text mb="16px">{TranslateString(1122, 'Page not found.')}</Text>
        <Button as="a" href="/" size="sm">
          {TranslateString(1124, 'Back')}
        </Button>
      </StyledNotFound>
    </Page>
  )
}

export default NotFound
