import useI18n from 'hooks/useI18n'
import React from 'react'
import { useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Heading, Text, Toggle } from 'uikit-dev'

const PoolTabButtons = ({ poolsCount, stackedOnly, setStackedOnly, liveOnly, setLiveOnly }) => {
  const { url, isExact } = useRouteMatch()
  const TranslateString = useI18n()

  const StyledButton = styled(Button)`
    border-radius: ${({ theme }) => theme.radii.default};
    color: ${({ theme }) => theme.colors.textSubtle};
    border: 1px solid ${({ theme }) => theme.colors.border};
    font-weight: 400;
    min-width: 120px;
    box-shadow: none !important;

    &.active {
      font-weight: bold;
      color: ${({ theme }) => theme.colors.primary};
      border-color: ${({ theme }) => theme.colors.primary};
      background-color: ${({ theme }) => theme.colors.white};
    }
  `

  return (
    <Wrapper>
      <Heading as="h2" fontSize="20px !important" textAlign="center">
        All pools
        <span className="ml-2" style={{ fontSize: '16px' }}>
          ({poolsCount})
        </span>
      </Heading>
      {/* <ToggleWrapper>
        <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        <Text> {TranslateString(999, 'Staked only')}</Text>
      </ToggleWrapper> */}

      {/* <ButtonMenu activeIndex={isExact ? 0 : 1} size="sm" variant="subtle">
        <ButtonMenuItem as={Link} to={`${url}`}>
          {TranslateString(698, 'Live')}
        </ButtonMenuItem>
        <ButtonMenuItem as={Link} to={`${url}/history`}>
          {TranslateString(700, 'Finished')}
        </ButtonMenuItem>
      </ButtonMenu> */}

      <div className="flex mt-3">
        {/* <ToggleWrapper>
          <Toggle checked={liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
          <Text> {TranslateString(999, 'Live')}</Text>
        </ToggleWrapper> */}

        <StyledButton
          size="sm"
          onClick={() => {
            setStackedOnly(false)
          }}
          variant="secondary"
          className={`mr-2 ${!stackedOnly ? 'active' : ''}`}
        >
          All
        </StyledButton>
        <StyledButton
          size="sm"
          onClick={() => {
            setStackedOnly(true)
          }}
          variant="secondary"
          className={stackedOnly ? 'active' : ''}
        >
          Staked
        </StyledButton>
      </div>
    </Wrapper>
  )
}

export default PoolTabButtons

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    justify-content: space-between;

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
