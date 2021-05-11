import React from 'react'
import styled from 'styled-components'
import { Button, CardViewIcon, ListViewIcon } from 'uikit-dev'

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

const FarmTabButtons = ({ stackedOnly, setStackedOnly, cardView, setCardView }) => {
  return (
    <Wrapper className="mb-6">
      <div className="flex mt-3">
        <Button
          onClick={() => {
            setCardView(true)
          }}
          variant={cardView ? 'primary' : 'secondary'}
          startIcon={<CardViewIcon color={cardView ? 'white' : 'primary'} />}
          className="mr-2"
        >
          Card View
        </Button>
        <Button
          onClick={() => {
            setCardView(false)
          }}
          startIcon={<ListViewIcon color={!cardView ? 'white' : 'primary'} />}
          variant={!cardView ? 'primary' : 'secondary'}
        >
          List View
        </Button>
      </div>
      <div className="flex mt-3">
        <Button
          onClick={() => {
            setStackedOnly(false)
          }}
          variant={!stackedOnly ? 'primary' : 'secondary'}
          className="mr-2"
        >
          All Farm
        </Button>
        <Button
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
