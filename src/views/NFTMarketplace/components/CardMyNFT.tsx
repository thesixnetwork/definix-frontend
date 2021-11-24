import React, { useState, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import _ from 'lodash'
import moment from 'moment'
import { Card, Text, Button } from 'uikit-dev'
import FlexLayout from 'components/layout/FlexLayout'
import ListItem from './ListItem'
import NFTCard from './NFTCard'
import SelectView from './SelectView'
import Group from '../../../uikit-dev/images/for-ui-v2/group.png'

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

export type TypeChartName = 'Normalize' | 'Price'

const CardMyNFT = () => {
  const [listView, setListView] = useState(false)
  const [isMarketplace, setIsMarketplace] = useState(false)
  const [chartName, setChartName] = useState<TypeChartName>('Normalize')
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
      <FinixStake>
        <SelectView chartName={chartName} setChartName={setChartName} />
        <Text className="mt-5 mb-5">Not for sale : 5 results</Text>
        {chartName === 'Normalize' ? (
          <FlexLayout cols={3}>
            {list.map((data) => (
              <NFTCard chartName={chartName} isHorizontal={listView} isMarketplace={isMarketplace} data={data} />
            ))}
          </FlexLayout>
        ) : (
          <FlexLayout cols={3}>
            {groupList.map((data) => (
              <NFTCard chartName={chartName} isHorizontal={listView} isMarketplace={isMarketplace} data={data} />
            ))}
          </FlexLayout>
        )}
      </FinixStake>
    </div>
  )
}

export default CardMyNFT
