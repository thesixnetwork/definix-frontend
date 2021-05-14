import Page from 'components/layout/Page'
import React, { useEffect, useMemo, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import loadingIcon from 'uikit-dev/images/loading-icon.png'
import axios from 'axios'
import _ from 'lodash'
import { Button, Heading, useMatchBreakpoints } from 'uikit-dev'
import avatar00 from 'uikit-dev/images/for-trading-challenge/IMG_1558.png'
import avatar01 from 'uikit-dev/images/for-trading-challenge/IMG_1560.png'
import avatar02 from 'uikit-dev/images/for-trading-challenge/IMG_1594.png'
import LeaderCard from './components/LeaderCard'
import LeaderTable from './components/LeaderTable'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const mockDisqualified = Array.from({ length: 5 }, (x, idx) => ({
  id: `${idx}dis`,
  name: 'Name',
  address: '0x4fxxxxxx4c7d',
  avatar: avatar01,
  value: 670.7633,
  pl: 5.21,
}))

// fetchLeaders.push({
//   id: `isMe`,
//   address: '0x4fxxxxxx4c7d',
//   avatar: avatar01,
//   name: 'xxx',
//   value: '0',
//   pl: '0',
//   telegramID: 'ssss',
//   rank: 60,
// })

// const mockTop3 = fetchLeaders.filter(
//   (leader) => leader.rank && (leader.rank === 1 || leader.rank === 2 || leader.rank === 3),
// )
// const mockExcTop3 = fetchLeaders.filter(
//   (leader) => leader.rank,
//   (leader) => leader.rank && leader.rank !== 1 && leader.rank !== 2 && leader.rank !== 3,
// )

const Leaderboard = () => {
  const { isSm } = useMatchBreakpoints()
  const [isShowDisqualified, setIsShowDisqualified] = useState(false)
  const [loadingAPI, setLoadingAPI] = React.useState(true)
  const [fetchLeaders, setFetchLeaders] = React.useState([])

  useEffect(() => {
    async function fetchLeaderBoard() {
      setLoadingAPI(false)
      const leaderBoardAPI = process.env.REACT_APP_API_LEADER_BOARD
      const response = await axios.get(`${leaderBoardAPI}`)
      if (response.data.success) {
        setLoadingAPI(true)
        const arrData = _.get(response.data, 'data')
        const fetchedData = []
        arrData.map((data, idx) =>
          fetchedData.push({
            // id: data._id,
            address: data.address,
            avatar:
              (data.avatar_name === '0' && avatar00) ||
              (data.avatar_name === '1' && avatar01) ||
              (data.avatar_name === '2' && avatar02),
            name: data.display_name,
            value: data.balance,
            pl: data.pnl,
            telegramID: data.telegram_id,
            rank: parseInt(`${idx + 1}`),
          }),
        )
        setFetchLeaders(fetchedData)
        // console.log('fetchLeaders !!!!!', fetchLeaders.slice(1))
      } else {
        setLoadingAPI(true)
      }
    }
    fetchLeaderBoard()
  }, [])

  useEffect(() => {
    return () => {
      setIsShowDisqualified(false)
    }
  }, [])

  const FilterButton = () => {
    if (!isShowDisqualified) {
      return (
        <Button
          variant="secondary"
          onClick={() => {
            setIsShowDisqualified(true)
          }}
        >
          Disqualified List
        </Button>
      )
    }

    return (
      <Button
        variant="secondary"
        onClick={() => {
          setIsShowDisqualified(false)
        }}
      >
        Leaderboard
      </Button>
    )
  }

  const sortedFetchedLeader = _.sortBy(fetchLeaders, (data) => data.rank)
  const topThree = sortedFetchedLeader.splice(0, 3)
  return (
    <Page>
      <MaxWidth>
        <div className={`flex align-center mb-6 mt-2 ${isSm ? 'justify-center' : 'justify-space-between'}`}>
          <Heading as="h1" fontSize="32px !important">
            {!isShowDisqualified ? 'Leaderboard' : 'Disqualified List'}
          </Heading>

          {/* {!isSm && <FilterButton />} */}
        </div>

        {!isShowDisqualified && !isSm && topThree.length > 0 && (
          <div className="flex flex-wrap" style={{ margin: '0 -8px' }}>
            {topThree.map((d, idx) => (
              <LeaderCard {...d} rank={idx + 1} className={isSm ? 'col-12' : 'col-4'} />
            ))}
          </div>
        )}

        {!loadingAPI ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '100px' }}>
            <FloatingLogo src={loadingIcon} alt="" width="25" height="25" className="mr-2" />
            Loading...
          </div>
        ) : (
          <LeaderTable
            // eslint-disable-next-line no-nested-ternary
            // items={!isShowDisqualified ? (isSm ? fetchLeaders : mockExcTop3) : mockDisqualified}
            items={!isSm ? sortedFetchedLeader : [...topThree, ...sortedFetchedLeader]}
            className="mt-2"
          />
        )}

        {isSm && (
          <div className="flex justify-center mt-5">
            <FilterButton />
          </div>
        )}
      </MaxWidth>
    </Page>
  )
}

const float = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
`
const FloatingLogo = styled.img`
  animation: ${float} 1s ease-in-out infinite;
`
export default Leaderboard
