import React from 'react'
import styled from 'styled-components'
import Loading from 'uikit-dev/components/Loading'
import Page from './layout/Page'

const Wrapper = styled(Page)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-grow: 1;
`

const PageLoader: React.FC = () => {
  return (
    <Wrapper>
      <Loading />
    </Wrapper>
  )
}

export default PageLoader
