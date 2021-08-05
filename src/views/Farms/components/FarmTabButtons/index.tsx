import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'contexts/Localization'
import { Button, CardViewIcon, IconButton, ListViewIcon, useMatchBreakpoints } from 'uikit-dev'

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

const FarmTabButtons = ({ stackedOnly, setStackedOnly, listView, setListView }) => {
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { t } = useTranslation()

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
              {t('List View')}
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
              {t('Card View')}
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
          {t('All Farm')}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setStackedOnly(true)
          }}
          variant={stackedOnly ? 'primary' : 'secondary'}
        >
          {t('Staked Farm')}
        </Button>
      </div>
    </Wrapper>
  )
}

export default FarmTabButtons
