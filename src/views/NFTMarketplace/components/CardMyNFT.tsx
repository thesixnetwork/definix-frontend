import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import { Card, Text } from 'uikit-dev'
import FlexLayout from 'components/layout/FlexLayout'
import ListItem from './ListItem'
import NFTCard from './NFTCard'

const FinixStake = styled(Card)`
  width: 100%;
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  padding: 1.5rem !important;

  a {
    display: block;
  }
`

const CardMyNFT = () => {
  const [listView, setListView] = useState(false)
  const [isMarketplace, setIsMarketplace] = useState(false)
  const list = [
    {
      id: 1,
      name: 'toon',
    },
    {
      id: 2,
      name: 'mo',
    },
    {
      id: 3,
      name: 'mo',
    },
    {
      id: 4,
      name: 'mo',
    },
  ]
  return (
    <div className="align-stretch mt-5">
      <FinixStake>
        <Text>CardMyNFT</Text>
        <Text className="mt-5">Not for sale : 5 results</Text>
        <FlexLayout cols={3}>
          {list.map((data) => (
            <NFTCard isHorizontal={listView} isMarketplace={isMarketplace} />
          ))}
        </FlexLayout>
      </FinixStake>
    </div>
  )
}

export default CardMyNFT
