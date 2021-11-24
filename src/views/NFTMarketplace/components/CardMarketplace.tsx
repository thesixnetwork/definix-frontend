import React, { useState, useEffect, useCallback } from 'react'
import Lottie from 'react-lottie'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import numeral from 'numeral'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import _ from 'lodash'
import FlexLayout from 'components/layout/FlexLayout'
import moment from 'moment'
import { ArrowBackIcon, Button, Card, ChevronRightIcon, Image, Link as UiLink, Text, useMatchBreakpoints } from 'uikit-dev'
import definixLongTerm from 'uikit-dev/images/for-ui-v2/long-term-stake-opacity.png'
import NFTCard from './NFTCard'

const CardBox = styled(Card)`
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

const CardMarketplace = () => {
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
      <CardBox>
        {/* <Text>CardMyNFT</Text> */}
        <Text className="my-2" fontSize="18px">6 results</Text>
        <FlexLayout cols={3}>
          {list.map((data) => (
            <NFTCard isHorizontal={listView} isMarketplace={isMarketplace} />
          ))}
        </FlexLayout>
      </CardBox>
    </div>
  )
}

export default CardMarketplace
