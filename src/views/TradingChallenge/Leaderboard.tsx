import Page from 'components/layout/Page'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, useMatchBreakpoints } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/fund-manager/twitter-profile/01.png'
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

const mockLeaders = Array.from({ length: 10 }, (x, idx) => ({
  id: `${idx}xxx`,
  name: 'Name',
  address: '0x4fxxxxxx4c7d',
  avatar: avatar01,
  value: 670.7633,
  pl: 5.21,
  rank: idx + 1,
}))
mockLeaders.push({
  id: `isMe`,
  name: 'Name',
  address: '0x4fxxxxxx4c7d',
  avatar: avatar01,
  value: 670.7633,
  pl: 5.21,
  rank: 60,
})

const mockTop3 = mockLeaders.filter(
  (leader) => leader.rank && (leader.rank === 1 || leader.rank === 2 || leader.rank === 3),
)
const mockExcTop3 = mockLeaders.filter(
  (leader) => leader.rank && leader.rank !== 1 && leader.rank !== 2 && leader.rank !== 3,
)

const Leaderboard = () => {
  const { isSm } = useMatchBreakpoints()
  const [isShowDisqualified, setIsShowDisqualified] = useState(false)

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

  return (
    <Page>
      <MaxWidth>
        <div className={`flex align-center mb-6 mt-2 ${isSm ? 'justify-center' : 'justify-space-between'}`}>
          <Heading as="h1" fontSize="32px !important">
            {!isShowDisqualified ? 'Leaderboard' : 'Disqualified List'}
          </Heading>

          {!isSm && <FilterButton />}
        </div>

        {!isShowDisqualified && !isSm && mockTop3.length > 0 && (
          <div className="flex flex-wrap" style={{ margin: '0 -8px' }}>
            {mockTop3.slice(0, 3).map((d, idx) => (
              <LeaderCard {...d} rank={idx + 1} className={isSm ? 'col-12' : 'col-4'} />
            ))}
          </div>
        )}

        <LeaderTable
          // eslint-disable-next-line no-nested-ternary
          items={!isShowDisqualified ? (isSm ? mockLeaders : mockExcTop3) : mockDisqualified}
          className="mt-2"
        />

        {isSm && (
          <div className="flex justify-center mt-5">
            <FilterButton />
          </div>
        )}
      </MaxWidth>
    </Page>
  )
}

export default Leaderboard
