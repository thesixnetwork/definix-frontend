import Page from 'components/layout/Page'
import includes from 'lodash/includes'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, Heading, useMatchBreakpoints } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/fund-manager/twitter-profile/01.png'
import avatar02 from 'uikit-dev/images/fund-manager/twitter-profile/02.png'
import avatar03 from 'uikit-dev/images/fund-manager/twitter-profile/03.png'
import LeaderCard from './components/LeaderCard'
import LeaderTable from './components/LeaderTable'

const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

const Leaderboard = () => {
  const { isXs, isSm } = useMatchBreakpoints()
  const [isShowDisqualified, setIsShowDisqualified] = useState(false)

  const mockTopThree = [
    {
      id: '123',
      name: 'Name',
      address: '0x4fxxxxxx4c7d',
      avatar: avatar01,
      value: 670.7633,
      pl: 5.21,
      rank: 1,
    },
    {
      id: '456',
      name: 'Name',
      address: '0x4fxxxxxx4c7d',
      avatar: avatar02,
      value: 670.7633,
      pl: 5.21,
      rank: 2,
    },
    {
      id: '789',
      name: 'Name',
      address: '0x4fxxxxxx4c7d',
      avatar: avatar03,
      value: 670.7633,
      pl: 5.21,
      rank: 3,
    },
  ]

  const mockLeaders = [
    {
      id: '0123',
      name: 'Name',
      address: '0x4fxxxxxx4c7d',
      avatar: avatar01,
      value: 670.7633,
      pl: 5.21,
      rank: 4,
    },
    {
      id: '0456',
      name: 'Name',
      address: '0x4fxxxxxx4c7d',
      avatar: avatar02,
      value: 670.7633,
      pl: 5.21,
      rank: 5,
    },
    {
      id: '0789',
      name: 'Name',
      address: '0x4fxxxxxx4c7d',
      avatar: avatar03,
      value: 670.7633,
      pl: 5.21,
      rank: 6,
    },
  ]

  useEffect(() => {
    return () => {
      setIsShowDisqualified(false)
    }
  }, [])

  return (
    <Page>
      <MaxWidth>
        {!isShowDisqualified ? (
          <>
            <div className="flex justify-space-between align-center mb-6 mt-2">
              <Heading as="h1" fontSize="32px !important">
                Leaderboard
              </Heading>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsShowDisqualified(true)
                }}
              >
                Disqualified List
              </Button>
            </div>

            {!isXs && !isSm && mockTopThree.length > 0 && (
              <div className="flex flex-wrap" style={{ margin: '0 -8px' }}>
                {mockTopThree.slice(0, 3).map((d, idx) => (
                  <LeaderCard {...d} rank={idx + 1} className={isXs || isSm ? 'col-12' : 'col-4'} />
                ))}
              </div>
            )}

            {/* <LeaderTable items={mockLeaders} className="mt-2" /> */}
          </>
        ) : (
          <>
            <div className="flex justify-space-between align-center mb-6 mt-2">
              <Heading as="h1" fontSize="32px !important">
                Disqualified List
              </Heading>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsShowDisqualified(false)
                }}
              >
                Leaderboard
              </Button>
            </div>
          </>
        )}
      </MaxWidth>
    </Page>
  )
}

export default Leaderboard
