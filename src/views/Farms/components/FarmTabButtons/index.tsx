import React from 'react'
import styled from 'styled-components'
import { Button, Heading } from 'uikit-dev'

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

const FarmTabButtons = ({ stackedOnly, setStackedOnly, activeFarmsCount }) => {
  // const { url, isExact } = useRouteMatch()
  // const TranslateString = useI18n()

  return (
    <Wrapper>
      <Heading as="h2" fontSize="20px !important" className="my-6" textAlign="center">
        All active farms
        <span className="ml-2" style={{ fontSize: '16px' }}>
          ({activeFarmsCount})
        </span>
      </Heading>
      <div className="flex">
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

export default FarmTabButtons

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
`
