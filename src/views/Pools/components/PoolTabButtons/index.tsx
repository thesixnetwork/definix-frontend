import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, IconButton, ListViewIcon, Text, Toggle, useMatchBreakpoints } from 'uikit-dev'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;
    margin-bottom: 2rem;

    .flex {
      margin: 0 !important;
    }
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

const PoolTabButtons = ({ stackedOnly, setStackedOnly, liveOnly, setLiveOnly, listView, setListView }) => {
  const { t } = useTranslation()
  const { isDark } = useTheme()
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  return (
    <Wrapper className="flex">
      {isMobile ? (
        <div className="flex justify-self-start">
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
            isStroke
            variant="text"
          >
            <CardViewIcon isStroke color={!listView || isDark ? 'primary' : 'textSubtle'} />
          </IconButton>
        </div>
      ) : (
        <div className="flex">
          <Button
            size="sm"
            onClick={() => {
              setListView(true)
            }}
            startIcon={<ListViewIcon isStroke color={listView || isDark ? 'white' : 'primary'} />}
            variant={listView ? 'primary' : 'secondary'}
            className="mr-2"
            isStroke
          >
            {t('List View')}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setListView(false)
            }}
            variant={!listView ? 'primary' : 'secondary'}
            startIcon={<CardViewIcon isStroke color={!listView || isDark ? 'white' : 'primary'} />}
            isStroke
          >
            {t('Card View')}
          </Button>
        </div>
      )}

      <div className="flex mt-3">
        <ToggleWrapper>
          <Toggle checked={liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
          <Text> {t('Live')}</Text>
        </ToggleWrapper>

        <Button
          size="sm"
          onClick={() => {
            setStackedOnly(false)
          }}
          variant={!stackedOnly ? 'primary' : 'secondary'}
          className="mr-2"
        >
          {t('All Pool')}
        </Button>
        <Button
          size="sm"
          onClick={() => {
            setStackedOnly(true)
          }}
          variant={stackedOnly ? 'primary' : 'secondary'}
        >
          {t('Pool Staked')}
        </Button>
      </div>

      <Text fontSize="12px" color="textSubtle" className="mt-4 justify-self-start col-12">
        *AAPR = {t('Airdrop APR supported by our partners')}
      </Text>
    </Wrapper>
  )
}

export default PoolTabButtons
