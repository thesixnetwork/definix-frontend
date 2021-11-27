import React, { useState, useEffect, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { useSelector, useDispatch } from 'react-redux'
import _ from 'lodash'
import { Card, Text } from 'uikit-dev'
import FlexLayout from 'components/layout/FlexLayout'
import NFTCard from './NFTCard'
import SelectView from './SelectView'
import TypeTab from './TypeTab'
import useRefresh from '../../../hooks/useRefresh'
import { fetchNFTUser } from '../../../state/actions'
import { State } from '../../../state/types'

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
  const [isGroup, setIsGroup] = useState(false)
  const [isMarketplace, setIsMarketplace] = useState(false)
  const [typeName, setTypeName] = useState<TypeName>('Grid')
  const [groupList, setGroupList] = useState([])
  const { account } = useWallet()
  const { slowRefresh } = useRefresh()
  const dispatch = useDispatch()
  const nftUser = useSelector((state: State) => state.nft)
  useEffect(() => {
    if (account) {
      dispatch(fetchNFTUser(account))
    }
  }, [account, dispatch, slowRefresh])

  const filterdList = useMemo(() => {
    return _.get(nftUser, 'nftListData')?.filter(
      (data) => typeof data?.userData?.amountOwn === 'number' && data?.userData?.amountOwn > 0,
    )
  }, [nftUser])

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

    const hdata = Object.keys(h).map((k) => ({ order: k, filterdList: h[k], count: h[k].length, isGroup: true }))

    setGroupList(hdata)
  }, [filterdList])

  return (
    <div className="align-stretch mt-5">
      <TypeTab current="/nft" />
      <FinixStake>
        <SelectView typeName={typeName} setTypeName={setTypeName} />
        {/* <Text className="mt-5 mb-5" fontSize="16px">
          My Listing : <b>0 results</b>
        </Text> */}
        {/* list data */}
        <Text className="mt-5 mb-5" fontSize="16px">
          My Collection : <b>{filterdList.length} results</b>
        </Text>
        {typeName === 'Grid' ? (
          <FlexLayout cols={3}>
            {filterdList.map((data) => (
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
