import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const FarmTabButtons = ({ stackedOnly, setStackedOnly, listView, setListView }) => {
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Wrapper className="mb-6">
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
            >
              <ListViewIcon color={listView || isDark ? 'primary' : 'textSubtle'} />
            </IconButton>
            <IconButton
              size="sm"
              onClick={() => {
                setListView(false)
              }}
              variant="text"
            >
              <CardViewIcon color={!listView || isDark ? 'primary' : 'textSubtle'} />
            </IconButton>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>

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
    </Wrapper>
  )
}

export default FarmTabButtons
