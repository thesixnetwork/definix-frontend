import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import { Card, Text } from 'uikit-dev'
import FlexLayout from 'components/layout/FlexLayout'
import NFTCard from './NFTCard'
import SelectView from './SelectView'
import TypeTab from './TypeTab'

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

export type TypeName = 'Grid' | 'Group'

const CardMyNFT = () => {
  const [listView, setListView] = useState(false)
  const [isMarketplace, setIsMarketplace] = useState(false)
  const [typeName, setTypeName] = useState<TypeName>('Grid')
  const [groupList, setGroupList] = useState([])
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

  useEffect(() => {
    const data = [
      {
        id: 1,
        name: 'toon',
        group: 'regendary',
      },
      {
        id: 2,
        name: 'mo',
        group: 'regendary',
      },
      {
        id: 3,
        name: 'mo',
        group: 'normal',
      },
      {
        id: 4,
        name: 'mof',
        group: 'normal',
      },
      {
        id: 5,
        name: 'rrrrr',
        group: 'rare',
      },
    ]
    const h = {}

    data.forEach((x) => {
      h[x.group] = (h[x.group] || []).concat(x.name)
    })
    const hdata = Object.keys(h).map((k) => ({ group: k, color: h[k], count: h[k].length }))

    setGroupList(hdata)
  }, [])

  return (
    <div className="align-stretch mt-5">
      <TypeTab current="/NFT"/>
      <FinixStake>
        <SelectView typeName={typeName} setTypeName={setTypeName} />
        <Text className="mt-5 mb-5">Not for sale : 5 results</Text>
        {typeName === 'Grid' ? (
          <FlexLayout cols={3}>
            {list.map((data) => (
              <NFTCard typeName={typeName} isHorizontal={listView} isMarketplace={isMarketplace} data={data} />
            ))}
          </FlexLayout>
        ) : (
          <FlexLayout cols={3}>
            {groupList.map((data) => (
              <NFTCard typeName={typeName} isHorizontal={listView} isMarketplace={isMarketplace} data={data} />
            ))}
          </FlexLayout>
        )}
      </FinixStake>
    </div>
  )
}

export default CardMyNFT
