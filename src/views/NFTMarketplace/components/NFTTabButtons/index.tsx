import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 1rem;
  } ;
`

const NFTTabButtons = ({ selected, setSelected }) => {
  // const { isDark } = useTheme()
  // const { isXl } = useMatchBreakpoints()
  // const isMobile = !isXl

  return (
    <Wrapper>
      <div className="flex align-center justify-space-between my-3">
        <div className="flex">
          <>
            <Button
              size="sm"
              onClick={() => {
                setSelected(true)
              }}
              as="a"
              href="/NFT"
              isStroke
              variant={selected ? 'primary' : 'secondary'}
              className="mr-2"
            >
              My NFT
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setSelected(false)
              }}
              as="a"
              href="/NFT/market-place"
              isStroke
              variant={!selected ? 'primary' : 'secondary'}
            >
              Marketplace
            </Button>
          </>
        </div>
      </div>
    </Wrapper>
  )
}

export default NFTTabButtons
