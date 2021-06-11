import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, ListViewIcon, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;

    .flex {
      margin: 0 !important;
    }
  } ;
`

const FarmTabButtons = ({ stackedOnly, setStackedOnly, listView, setListView }) => {
  const { isXl, isMd } = useMatchBreakpoints()
  const { isDark } = useTheme()
  const isMobile = !isMd && !isXl

  return (
    <Wrapper className="mb-6">
      {!isMobile && (
        <div className="flex">
          <Button
            size="sm"
            onClick={() => {
              setListView(true)
            }}
            startIcon={<ListViewIcon color={listView || isDark ? 'white' : 'primary'} />}
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
            variant={!listView ? 'primary' : 'secondary'}
            startIcon={<CardViewIcon color={!listView || isDark ? 'white' : 'primary'} />}
          >
            Card View
          </Button>
        </div>
      )}

      <div className="flex mt-2">
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
    </Wrapper>
  )
}

export default FarmTabButtons
