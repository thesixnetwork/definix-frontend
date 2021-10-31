import React from 'react'
import styled from 'styled-components'
import { Card } from 'uikit-dev'

const BodyWrapper = styled(Card)`
  position: relative;
  z-index: 5;
`

const Maxwidth = styled.div`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding-bottom: 64px;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children, title }: { children: React.ReactNode; title?: React.ReactNode }) {
  return (
    <Maxwidth>
      {title && title}
      <BodyWrapper>{children}</BodyWrapper>
    </Maxwidth>
  )
}
