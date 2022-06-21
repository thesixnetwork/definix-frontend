import useI18n from 'hooks/useI18n'
import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, useMatchBreakpoints, Text, Toggle } from 'uikit-dev'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;

  ${({ theme }) => theme.mediaQueries.sm} {
    margin-bottom: 2rem;
  } ;
`

const ToggleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 32px;

  ${Text} {
    margin-left: 8px;
  }
`

const FarmTabButtons = ({ stackedOnly, setStackedOnly, listView, liveOnly, setLiveOnly, setListView }) => {
  const TranslateString = useI18n()
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Wrapper>
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
        <ToggleWrapper>
          <Toggle checked={liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
          <Text> {TranslateString(999, 'Live')}</Text>
        </ToggleWrapper>

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
