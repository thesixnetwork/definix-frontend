import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { Button, Card, ChevronRightIcon, Heading, Text } from 'uikit-dev'

const Container = styled(Card)`
  ${({ theme }) => theme.mediaQueries.md} {
    flex-grow: 1;
  }
`

const NetWorth = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;

  .sum {
    flex-grow: 1;
  }
`

const Legend = styled.div`
  display: flex;
  justify-content: space-between;

  .dot {
    display: inline-block;
    width: 10px;
    height: 10px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 8px;
  }
`

const HarvestAll = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .ready {
    padding: 12px 24px;
    position: relative;

    &:before {
      content: '';
      width: 0;
      height: 0;
      border: 8px solid transparent;
      border-top-color: ${({ theme }) => theme.colors.white};
      position: absolute;
      top: 100%;
      left: calc(50% - 8px);
    }
  }

  .harvest {
    padding: 16px 24px;
    background: ${({ theme }) => theme.colors.backgroundBlueGradient};
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`

const StatAll = styled.div`
  padding: 12px 16px;
  margin: 0 8px;
  border-radius: ${({ theme }) => theme.radii.default};
  background: ${({ theme }) => theme.colors.white};

  h2 {
    margin: 4px 0;
  }
`

const FarmsAndPools = styled.a`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  .icon {
    padding-right: 8px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  &:last-child {
    border: none;
  }
`

const Coins = styled.div`
  padding: 16px;
  width: 40%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  img {
    width: 40px;
    flex-shrink: 0;

    &:first-child {
      margin-right: 4px;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    img {
      width: 50px;
    }
  }
`

const Summary = styled.div`
  padding: 12px;
  width: 60%;
  display: flex;
  flex-wrap: wrap;

  > div {
    width: 50%;
    padding: 4px;
  }
`

const CardMyFarmsAndPools = ({ className = '' }) => {
  const data = [
    {
      name: 'FINIX-SIX LP',
      apr: '415%',
      lpStaked: '78,320.12',
      multiplier: '55x',
      finixEarned: '300.75',
      netWorth: '$72k',
      percent: 75,
      color: '#1587C9',
    },
    {
      name: 'FINIX-BNB LP',
      apr: '381%',
      lpStaked: '318.77',
      multiplier: '15x',
      finixEarned: '49.40',
      netWorth: '$31k',
      percent: 10,
      color: '#EFB80C',
    },
    {
      name: 'FINIX-BUSD LP',
      apr: '320%',
      lpStaked: '1,120.02',
      multiplier: '15x',
      finixEarned: '180.15',
      netWorth: '$24k',
      percent: 15,
      color: '#55BD92',
    },
  ]

  const chart = {
    data: {
      labels: data.map((d) => d.name),
      datasets: [
        {
          label: '# of Votes',
          data: data.map((d) => d.percent),
          backgroundColor: data.map((d) => d.color),
        },
      ],
    },
    options: {
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
      layout: {
        padding: 24,
      },
      rotation: 2,
      cutoutPercentage: 90,
    },
  }

  return (
    <Container className={className}>
      <NetWorth>
        <div className="col-5 flex" style={{ position: 'relative' }}>
          <Doughnut data={chart.data} options={chart.options} height={150} width={150} />
        </div>
        <div className="sum col-7 pa-3 pl-0">
          <Text color="textSubtle">Net Worth</Text>
          <Heading fontSize="24px !important">$82.117.20</Heading>

          <div className="mt-2">
            {data.map((d) => (
              <Legend key={`legend${d.name}`}>
                <Text fontSize="12px" color="textSubtle">
                  <span className="dot" style={{ background: d.color }} />
                  {d.name}
                </Text>
                <Text bold>{d.netWorth}</Text>
              </Legend>
            ))}
          </div>
        </div>
      </NetWorth>

      <HarvestAll>
        <Text bold textAlign="center" className="ready">
          FINIX ready to harvest
        </Text>
        <div className="harvest">
          <div className="flex justify-center">
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all farms
              </Text>
              <Heading fontSize="24px !important" textAlign="center">
                58.1
              </Heading>
              <Text textAlign="center" color="textSubtle">
                est ~ $698.9
              </Text>
            </StatAll>
            <StatAll>
              <Text textAlign="center" color="textSubtle">
                From all pools
              </Text>
              <Heading fontSize="24px !important" textAlign="center">
                0.0
              </Heading>
              <Text textAlign="center" color="textSubtle">
                est ~ $0
              </Text>
            </StatAll>
          </div>
          <Button as="a" href="#" size="sm" variant="tertiary" className="mt-3" style={{ background: 'white' }}>
            Harvest All
          </Button>
        </div>
      </HarvestAll>

      <div>
        {data.map((d) => {
          const imgs = d.name.split(' ')[0].split('-')
          return (
            <FarmsAndPools href="#" key={d.name}>
              <Coins>
                <div className="flex">
                  <img src={`/images/coins/${imgs[0]}.png`} alt="" />
                  <img src={`/images/coins/${imgs[1]}.png`} alt="" />
                </div>
                <Text bold>{d.name}</Text>
              </Coins>
              <Summary>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    APR
                  </Text>
                  <Text bold color="success">
                    {d.apr}
                  </Text>
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    LP Staked
                  </Text>
                  <Text bold>{d.lpStaked}</Text>
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    Multiplier
                  </Text>
                  <Text bold color="warning">
                    {d.multiplier}
                  </Text>
                </div>
                <div>
                  <Text fontSize="12px" color="textSubtle">
                    FINIX Earned
                  </Text>
                  <Text bold>{d.finixEarned}</Text>
                </div>
              </Summary>
              <div className="icon">
                <ChevronRightIcon color="textDisabled" width="28" />
              </div>
            </FarmsAndPools>
          )
        })}
      </div>
    </Container>
  )
}

export default CardMyFarmsAndPools
