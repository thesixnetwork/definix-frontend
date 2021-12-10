import React from 'react'
import styled from 'styled-components'
import numeral from 'numeral'
import bgHeadCardRankDiamond from 'uikit-dev/images/vFINIXHolderRank/DefinixIcon-14.png'
import bgHeadCardRankGold from 'uikit-dev/images/vFINIXHolderRank/DefinixIcon-16.png'
import bgHeadCardRankSliver from 'uikit-dev/images/vFINIXHolderRank/DefinixIcon-15.png'

import logoRankSliver from 'uikit-dev/images/vFINIXHolderRank/DefinixIcon-13.png'
import logoRankGold from 'uikit-dev/images/vFINIXHolderRank/DefinixIcon-12.png'
import logoRankDiamond from 'uikit-dev/images/vFINIXHolderRank/DefinixIcon-11.png'

import { Text, Skeleton } from 'uikit-dev'
import { useRank, usePrivateData } from 'hooks/useLongTermStake'

const RankCard = styled.div`
  padding: 10px 20px 10px 20px;
  border-radius: 7px;
  background-size: cover !important;
  align-items: center;

  .sum {
    flex-grow: 1;
  }
`

const RankMenuCard: React.FC = () => {
  const level = useRank()
  const { balancevfinix } = usePrivateData()
  const getRankTopCardBg = (rank) => {
    console.log('rank ', rank)
    switch (rank) {
      case '0':
        return bgHeadCardRankSliver
      case '1':
        return bgHeadCardRankGold
      case '2':
        return bgHeadCardRankDiamond
      default:
        return ''
    }
  }
  const getTextRank = (rank) => {
    switch (rank) {
      case '0':
        return 'Silver HODL'
      case '1':
        return 'Gold HODL'
      case '2':
        return 'Diamond HODL'
      default:
        return ''
    }
  }

  const getRanklogo = (rank) => {
    switch (rank) {
      case '0':
        return logoRankSliver
      case '1':
        return logoRankGold
      case '2':
        return logoRankDiamond
      default:
        return ''
    }
  }
  const checkDisplay = (rank) => rank !== -1 && level

  return checkDisplay(level) ? (
    <RankCard style={{ background: `url(${getRankTopCardBg(level)})` }}>
      <div className="flex align-items-center">
        <div style={{ paddingLeft: '4%', alignSelf: 'center' }}>
          <img width="30px" height="30px" src={getRanklogo(level)} alt="" />
        </div>
        <div>
          <Text className="col-12 flex" bold style={{ paddingLeft: '10px' }} color="black">
            {getTextRank(level)}
          </Text>
          <Text style={{ paddingLeft: '10px' }} color="black" fontSize="12px">
            {balancevfinix > 0 ? (
              `${numeral(balancevfinix || 0).format('0,0.[00]')} vFINIX`
            ) : (
              <Skeleton height={21} width={80} />
            )}
          </Text>
        </div>
      </div>
    </RankCard>
  ) : (
    <div />
  )
}

export default RankMenuCard
