import React from 'react'
import styled from 'styled-components'

const Layout = styled.div<{ childWidth: string }>`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-left: -12px;
  margin-right: -12px;

  & > * {
    min-width: 280px;
    width: ${({ childWidth }) => `calc(${childWidth} - 24px)`};
    flex-grow: 1;
    flex-shrink: 0;
    margin: 0 12px;

    ${({ theme }) => theme.mediaQueries.md} {
      max-width: ${({ childWidth }) => `calc(${childWidth} - 24px)`};
    }
  }
`

const FlexLayout = ({ cols, children }) => {
  const width = 100 / cols

  return <Layout childWidth={`${width}%`}>{children}</Layout>
}

export default FlexLayout
