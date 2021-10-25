import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, Text, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 2rem;
  } ;
`

const FarmTabButtons = ({ stackedOnly, setStackedOnly, listView, setListView }) => {
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
              setStackedOnly(false)
            }}
            variant={!stackedOnly ? 'primary' : 'secondary'}
            className="mr-2"
          >
            All Farm
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setStackedOnly(true)
            }}
            variant={stackedOnly ? 'primary' : 'secondary'}
          >
            Staked
          </Button>
        </div>
      </div>

      <Text fontSize="12px" color="textSubtle" className="mt-4">
        *AAPR = Airdrop APR supported by our partners
      </Text>
    </Wrapper>
  )
}

export default FarmTabButtons
