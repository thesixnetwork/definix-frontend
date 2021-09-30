import Page from 'components/layout/Page'
import React, { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components'
import loadingIcon from 'uikit-dev/images/loading-icon.png'
import axios from 'axios'
import _ from 'lodash'
import { Button, Heading, useMatchBreakpoints } from 'uikit-dev'
import avatar00 from 'uikit-dev/images/for-trading-challenge/IMG_1.png'
import avatar01 from 'uikit-dev/images/for-trading-challenge/IMG_2.png'
import avatar02 from 'uikit-dev/images/for-trading-challenge/IMG_3.png'
import LeaderCard from './components/LeaderCard'
import LeaderTable from './components/LeaderTable'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Leaderboard = () => {
  const { isSm } = useMatchBreakpoints()
  const [isShowDisqualified, setIsShowDisqualified] = useState(false)
  const [loadingAPI, setLoadingAPI] = React.useState(true)
  const [fetchLeaders, setFetchLeaders] = React.useState([])
  const [fetchViolate, setFetchViolate] = React.useState([])
  const [value, setValue] = React.useState([])

  useEffect(() => {
    async function fetchLeaderBoard() {
      setLoadingAPI(false)
      const leaderBoardAPI = process.env.REACT_APP_API_LEADER_BOARD
      const response = await axios.get(`${leaderBoardAPI}`)
      if (response.data.success) {
        setLoadingAPI(true)
        const arrData = _.get(response.data, 'data')
        const balance = _.get(response.data, 'data.0.balance')
        const fetchedData = []
        arrData.map((data, idx) =>
          fetchedData.push({
            address: data.address,
            avatar:
              (data.avatar_name === '0' && avatar00) ||
              (data.avatar_name === '1' && avatar01) ||
              (data.avatar_name === '2' && avatar02),
            name: data.display_name,
            value: parseFloat(data.balance).toFixed(2),
            pl: data.pnl,
            telegramID: data.telegram_id,
            rank: parseInt(`${idx + 1}`),
          }),
        )
        setValue(balance.toFixed(2))
        setFetchLeaders(fetchedData)
      } else {
        setLoadingAPI(true)
      }
    }
    fetchLeaderBoard()
  }, [])

  const fetchDisquilified = async () => {
    setLoadingAPI(false)
    setIsShowDisqualified(true)
    const violatedAPI = process.env.REACT_APP_API_TRADING_VIOLATE_ADDRESS
    const response = await axios.get(`${violatedAPI}`)
    if (response.data.success) {
      setLoadingAPI(true)
      const arrDataViolate = _.get(response.data, 'data')
      const fetchedDataViolate = []
      arrDataViolate.map((data) =>
        fetchedDataViolate.push({
          address: data.address,
          avatar:
            (data.avatar_name === '0' && avatar00) ||
            (data.avatar_name === '1' && avatar01) ||
            (data.avatar_name === '2' && avatar02),
          name: data.display_name,
          value: parseFloat(data.balance).toFixed(2),
          pl: data.pnl,
          telegramID: data.telegram_id,
          // rank: parseInt(`${idx + 1}`),
        }),
      )
      setFetchViolate(fetchedDataViolate)
    } else {
      setLoadingAPI(true)
    }
  }

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
            fetchDisquilified()
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
    <>
      <Page>
        <MaxWidth>
          <div className={`flex align-center mb-6 mt-2 ${isSm ? 'justify-center' : 'justify-space-between'}`}>
            <Heading as="h1" fontSize="32px !important">
              {!isShowDisqualified ? 'Leaderboard' : 'Disqualified List'}
            </Heading>
            {!isSm && <FilterButton />}
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
              // items={!isSm ? sortedFetchedLeader : [...topThree, ...sortedFetchedLeader]}
              items={
                (isShowDisqualified && fetchViolate) ||
                (!isSm ? sortedFetchedLeader : [...topThree, ...sortedFetchedLeader])
              }
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
    </>
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
