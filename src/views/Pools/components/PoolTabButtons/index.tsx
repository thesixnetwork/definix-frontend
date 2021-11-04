import React from 'react'
import styled from 'styled-components'
import { Button, Text, Toggle } from 'definixswap-uikit'

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

const PoolTabButtons = ({ stackedOnly, setStackedOnly, liveOnly, setLiveOnly }) => {
  return (
    <Wrapper className="flex">
      <div className="flex mt-3">
        <ToggleWrapper>
          <Text>Finished</Text>
          <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
        </ToggleWrapper>

        <ToggleWrapper>
          <Text>Staked Only</Text>
          <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        </ToggleWrapper>
      </div>
    </Wrapper>
  )
}

export default PoolTabButtons
