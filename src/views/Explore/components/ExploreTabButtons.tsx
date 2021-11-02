import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 2rem;
  } ;
`

const ExploreTabButtons = ({ isInvested, setIsInvested }) => {
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Wrapper>
      <div className="flex align-center justify-space-between">
        <div className="flex">
          <Button
            size="sm"
            onClick={() => {
              setIsInvested(false)
            }}
            isStroke
            variant={!isInvested ? 'primary' : 'secondary'}
            className="mr-2"
          >
            All Farm
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setIsInvested(true)
            }}
            isStroke
            variant={isInvested ? 'primary' : 'secondary'}
          >
            Invested
          </Button>
        </div>
      </div>
    </Wrapper>
  )
}

export default ExploreTabButtons
