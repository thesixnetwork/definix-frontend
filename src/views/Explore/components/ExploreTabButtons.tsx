import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 2rem;
  }
`

const ExploreTabButtons = ({ listView, setListView, isInvested, setIsInvested }) => {
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Wrapper>
      <div className="flex align-center justify-space-between">
        <div className="flex">
          {isMobile ? (
            <>
              <IconButton
                size="sm"
                onClick={() => {
                  setListView(true)
                }}
                variant="text"
                className="mr-1"
                isStroke
              >
                <ListViewIcon isStroke color={listView || isDark ? 'primary' : 'textSubtle'} />
              </IconButton>
              <IconButton
                size="sm"
                onClick={() => {
                  setListView(false)
                }}
                variant="text"
                isStroke
              >
                <CardViewIcon isStroke color={!listView || isDark ? 'primary' : 'textSubtle'} />
              </IconButton>
            </>
          ) : (
            <>
              <Button
                size="sm"
                onClick={() => {
                  setListView(true)
                }}
                isStroke
                startIcon={<ListViewIcon isStroke color={listView || isDark ? 'white' : 'primary'} />}
                variant={listView ? 'primary' : 'secondary'}
                className="mr-2"
              >
                List View
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  setListView(false)
                }}
                isStroke
                variant={!listView ? 'primary' : 'secondary'}
                startIcon={<CardViewIcon isStroke color={!listView || isDark ? 'white' : 'primary'} />}
              >
                Card View
              </Button>
            </>
          )}
        </div>

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
