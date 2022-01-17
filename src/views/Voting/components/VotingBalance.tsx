/* eslint-disable no-nested-ternary */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useMemo, useCallback, useEffect } from 'react'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import { BLOCKS_PER_YEAR } from 'config'
import { useParams, Link } from 'react-router-dom'
import {
  useFarms,
  usePriceFinixUsd,
  usePriceKethKusdt,
  usePriceKlayKusdt,
  usePriceSixUsd,
  usePools,
  usePriceKethKlay,
} from 'state/hooks'
import { provider } from 'web3-core'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { PoolCategory, QuoteToken } from 'config/constants/types'
import { Card, Text, useMatchBreakpoints, Button, Skeleton, Image, useModal } from 'uikit-dev'
import isEmpty from 'lodash/isEmpty'
import styled from 'styled-components'
import { useVotesByIndex, useVotesByIpfs } from 'hooks/useVoting'
import useBlock from 'hooks/useBlock'
import { getBalanceNumber } from 'utils/formatBalance'
import CircularProgress from '@material-ui/core/CircularProgress'
import { FarmWithStakedValue } from 'views/Farms/components/FarmCard/types'
import PaginationCustom from './Pagination'
import CastVoteModal from '../Modals/CastVoteModal'

const EmptyData = ({ text }) => (
  <div className="flex align-center justify-center" style={{ height: '400px' }}>
    <Text textAlign="center" color="textSubtle">
      {text}
    </Text>
  </div>
)

const LoadingData = () => (
  <TR>
    <TD className="w-100">
      <div className="flex align-center justify-center" style={{ height: '400px' }}>
        <CircularProgress size={16} color="inherit" className="mr-2" />
        <Text>Loading...</Text>
      </div>
    </TD>
  </TR>
)

const CardTable = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  overflow: auto;

  a {
    display: block;
  }
`

const CardList = styled(Card)`
  position: relative;
  content: '';
  background-color: ${({ theme }) => theme.mediaQueries.md};
  background-size: cover;
  background-repeat: no-repeat;
  right: 0;
  overflow: auto;
  box-shadow: unset;
  border-radius: unset;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  a {
    display: block;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
`

const TBody = styled.div`
  overflow: auto;
  position: relative;
`

const TR = styled.tr`
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 24px;

  th {
    border-top: 1px solid${({ theme }) => theme.colors.border};
  }

  &:last-child {
    border: none;
  }

  &.isMe {
    position: sticky;
    bottom: 1px;
    left: 0;
    background: #f7f7f8;
    border-top: 1px solid: ${({ theme }) => theme.colors.border};
  }
  
`
const TD = styled.td<{ align?: string }>`
  width: 180px;
  vertical-align: middle;
  align-self: center;
`

const Coins = styled.div`
  display: flex;
  width: 100%;

  img {
    width: 37px;
    flex-shrink: 0;
  }

  > * {
    flex-shrink: 0;

    &:nth-child(01) {
      position: relative;
      z-index: 1;
    }
    &:nth-child(02) {
      margin-left: -8px;
    }
  }
`

const TransactionTable = ({ rows, empText, isLoading, total, klayPrice, finixPrice, kethPrice, sixPrice }) => {
  const [cols] = useState([
    'Rank',
    'Farms/Pools',
    'Current Vote Result',
    'Total Liquidity',
    'Current APR',
    '',
    'Estimate APR',
  ])
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  //
  const [data, setData] = useState([])
  const [onPresentConnectModal] = useModal(
    <CastVoteModal types="" select singleType={data} proposalIndex allChoices={data} />,
  )

  useEffect(() => {
    if (data.length !== 0) {
      onPresentConnectModal()
    }
  }, [data])

  const handleFarm = async (farm) => {
    await setData([farm])
  }
  //

  return (
    <CardList>
      <Table>
        <TR>
          {cols.map((c) => (
            <TD key={c}>
              <Text color="textSubtle" fontSize="12px" bold>
                {c}
              </Text>
            </TD>
          ))}
        </TR>
        {isLoading ? (
          <LoadingData />
        ) : isEmpty(rows) ? (
          <>
            <EmptyData text={empText} />
          </>
        ) : (
          <TBody>
            {rows !== null &&
              rows.map((r) => {
                const imgs = r.props.rows.lpSymbol.split(' ')[0].split('-')
                return (
                  <TR key={`tsc-${r.block_number}`}>
                    <TD>
                      {isLoading ? (
                        <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                      ) : (
                        <>{r.props.rows.pid}</>
                      )}
                    </TD>
                    <TD>
                      {isLoading ? (
                        <>
                          <div className="flex">
                            <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                            <Skeleton animation="pulse" variant="circle" height="48px" width="48px" className="mx-1" />
                          </div>
                          <Skeleton animation="pulse" variant="rect" height="21px" width="80%" />
                        </>
                      ) : (
                        <Coins className="imgs flex align-center">
                          {imgs[0] && <img src={`/images/coins/${imgs[0].toLowerCase()}.png`} alt="" />}
                          {imgs[1] && <img src={`/images/coins/${imgs[1].toLowerCase()}.png`} alt="" />}&nbsp;
                          <Text fontSize="14px" bold>
                            {(r.props.rows.lpSymbol || '').replace(/ LP$/, '')}
                          </Text>
                        </Coins>
                      )}
                    </TD>
                    <TD>
                      {isLoading ? (
                        <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                      ) : (
                        <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold>
                          {r.currentAlloCationPoint}
                        </Text>
                      )}
                    </TD>
                    <TD>
                      {isLoading ? (
                        <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                      ) : (
                        <div className="flex align-center">
                          <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold paddingRight="8px">
                            {r.props.rows.totalValueFormated === '-'
                              ? r.props.rows.lpTotalInQuoteToken
                              : r.props.rows.totalValueFormated}
                            %
                          </Text>
                        </div>
                      )}
                    </TD>
                    <TD>
                      {isLoading ? (
                        <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                      ) : (
                        <div className="flex align-center">
                          <Text fontSize={isMobile ? '12px' : '14px'} color="text" bold paddingRight="8px">
                            {new BigNumber(r.props.rows.apy.toNumber() * 100).toNumber().toFixed()}%
                          </Text>
                        </div>
                      )}
                    </TD>
                    <TD>
                      {isLoading ? (
                        <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                      ) : (
                        <div className="flex align-center">
                          <Button
                            onClick={() => {
                              handleFarm(r.props.rows)
                            }}
                            variant="primary"
                            radii="small"
                            size="sm"
                            className="flex align-center text-center px-7"
                          >
                            <Text fontSize={isMobile ? '10px' : '12px'} color="white" lineHeight="1">
                              Vote
                            </Text>
                          </Button>
                        </div>
                      )}
                    </TD>
                    <TD>
                      {isLoading ? (
                        <Skeleton animation="pulse" variant="rect" height="20px" width="70%" />
                      ) : (
                        <div className="flex align-center">
                          <Text fontSize={isMobile ? '12px' : '14px'} color="#2A9D8F" bold paddingRight="8px">
                            {r.estimateAPR}
                          </Text>
                        </div>
                      )}
                    </TD>
                  </TR>
                )
              })}
          </TBody>
        )}
      </Table>
    </CardList>
  )
}

const VotingBalance = () => {
  const { account, klaytn }: { account: string; klaytn: provider } = useWallet()
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const limits = 10
  const { id, proposalIndex }: { id: string; proposalIndex: any } = useParams()

  const { allVotesByIndex, totalVote } = useVotesByIndex(proposalIndex, currentPage, limits)
  const { allVotesByIpfs } = useVotesByIpfs(id)
  const pages = useMemo(() => Math.ceil(Number(totalVote) / 10), [Number(totalVote)])

  // Farms
  const farmsLP = useFarms()
  const klayPrice = usePriceKlayKusdt()
  const sixPrice = usePriceSixUsd()
  const finixPrice = usePriceFinixUsd()
  const kethPriceUsd = usePriceKethKusdt()
  const [listView, setListView] = useState(false)
  const activeFarms = farmsLP.filter((farm) => farm.pid !== 0 && farm.pid !== 1 && farm.multiplier !== '0X')

  const farmsList = useCallback(
    (farmsToDisplay, removed: boolean) => {
      const finixPriceVsKlay = finixPrice // new BigNumber(farmsLP.find((farm) => farm.pid === FINIX_POOL_PID)?.tokenPriceVsQuote || 0)
      const farmsToDisplayWithAPY: FarmWithStakedValue[] = farmsToDisplay.map((farm) => {
        // if (!farm.tokenAmount || !farm.lpTotalInQuoteToken || !farm.lpTotalInQuoteToken) {
        //   console.log("farm", farm)
        //   return farm
        // }
        const klayApy = new BigNumber(0)
        const totalRewardPerBlock = new BigNumber(farm.finixPerBlock)
          .times(farm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(farm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)

        let apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        let total
        if (!farm.lpTotalInQuoteToken) {
          total = null
        }
        if (farm.quoteTokenSymbol === QuoteToken.KUSDT || farm.quoteTokenSymbol === QuoteToken.KDAI) {
          apy = finixPriceVsKlay.times(finixRewardPerYear).div(farm.lpTotalInQuoteToken) // .times(bnbPrice)
        } else if (farm.quoteTokenSymbol === QuoteToken.KLAY) {
          total = klayPrice.times(farm.lpTotalInQuoteToken)
          apy = finixPrice.div(klayPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.KETH) {
          total = kethPriceUsd.times(farm.lpTotalInQuoteToken)
          apy = finixPrice.div(kethPriceUsd).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.FINIX) {
          total = finixPrice.times(farm.lpTotalInQuoteToken)
          apy = finixRewardPerYear.div(farm.lpTotalInQuoteToken)
        } else if (farm.quoteTokenSymbol === QuoteToken.SIX) {
          total = sixPrice.times(farm.lpTotalInQuoteToken)
          apy = finixPrice.div(sixPrice).times(finixRewardPerYear).div(farm.lpTotalInQuoteToken)
        } else if (farm.dual) {
          const finixApy =
            farm && finixPriceVsKlay.times(finixRewardPerBlock).times(BLOCKS_PER_YEAR).div(farm.lpTotalInQuoteToken)
          const dualApy =
            farm.tokenPriceVsQuote &&
            new BigNumber(farm.tokenPriceVsQuote)
              .times(farm.dual.rewardPerBlock)
              .times(BLOCKS_PER_YEAR)
              .div(farm.lpTotalInQuoteToken)

          apy = finixApy && dualApy && finixApy.plus(dualApy)
        }

        const totalValueFormated = total
          ? `$${Number(total).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
          : '-'

        const finixApy = apy

        return {
          ...farm,
          apy: finixApy,
          finixApy,
          klayApy,
          totalValueFormated,
          lpTotalInQuoteToken: `$${Number(farm.lpTotalInQuoteToken).toLocaleString(undefined, {
            maximumFractionDigits: 0,
          })}`,
        }
      })

      return farmsToDisplayWithAPY.map((farm) => (
        <TransactionTable
          rows={farm && farm}
          isLoading={isLoading}
          empText="Don`t have any transactions in this voting balance."
          total
          klayPrice={klayPrice}
          finixPrice={finixPrice}
          kethPrice={kethPriceUsd}
          sixPrice={sixPrice}
        />
      ))
    },
    [sixPrice, klayPrice, kethPriceUsd, finixPrice, klaytn, account, listView],
  )

  // Pools
  const pools = usePools(account)
  const farms = useFarms()
  const sixPriceUSD = usePriceSixUsd()
  const klayPriceUSD = usePriceKlayKusdt()
  const ethPriceKlay = usePriceKethKlay()
  const block = useBlock()

  const priceToKlay = (tokenName: string, tokenPrice: BigNumber, quoteToken: QuoteToken): BigNumber => {
    const tokenPriceKLAYTN = new BigNumber(tokenPrice)
    if (tokenName === 'KLAY') {
      return new BigNumber(1)
    }
    if (tokenPrice && quoteToken === QuoteToken.KUSDT) {
      return tokenPriceKLAYTN.div(klayPriceUSD)
    }
    return tokenPriceKLAYTN
  }

  const poolsWithApy = pools.map((pool) => {
    const isKlayPool = pool.poolCategory === PoolCategory.KLAYTN
    const rewardTokenFarm = farms.find((f) => f.tokenSymbol === pool.tokenName)
    let stakingTokenFarm = farms.find((s) => s.tokenSymbol === pool.stakingTokenName)
    switch (pool.sousId) {
      case 0:
        stakingTokenFarm = farms.find((s) => s.pid === 0)
        break
      case 1:
        stakingTokenFarm = farms.find((s) => s.pid === 1)
        break
      case 2:
        stakingTokenFarm = farms.find((s) => s.pid === 2)
        break
      case 3:
        stakingTokenFarm = farms.find((s) => s.pid === 3)
        break
      case 4:
        stakingTokenFarm = farms.find((s) => s.pid === 4)
        break
      case 5:
        stakingTokenFarm = farms.find((s) => s.pid === 5)
        break
      case 6:
        stakingTokenFarm = farms.find((s) => s.pid === 6)
        break
      default:
        break
    }

    // tmp mulitplier to support ETH farms
    // Will be removed after the price api
    const tempMultiplier = stakingTokenFarm?.quoteTokenSymbol === 'KETH' ? ethPriceKlay : 1

    // /!\ Assume that the farm quote price is KLAY
    const stakingTokenPriceInKLAY = isKlayPool
      ? new BigNumber(1)
      : new BigNumber(stakingTokenFarm?.tokenPriceVsQuote).times(tempMultiplier)
    const rewardTokenPriceInKLAY = priceToKlay(
      pool.tokenName,
      rewardTokenFarm?.tokenPriceVsQuote,
      rewardTokenFarm?.quoteTokenSymbol,
    )

    const totalRewardPricePerYear = rewardTokenPriceInKLAY.times(pool.tokenPerBlock).times(BLOCKS_PER_YEAR)
    const totalStakingTokenInPool = stakingTokenPriceInKLAY.times(getBalanceNumber(pool.totalStaked))
    let apy = totalRewardPricePerYear.div(totalStakingTokenInPool).times(100)
    const totalLP = new BigNumber(stakingTokenFarm.lpTotalSupply).div(new BigNumber(10).pow(18))
    let highestToken
    if (stakingTokenFarm.tokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.tokenAmount
    } else if (stakingTokenFarm.quoteTokenSymbol === QuoteToken.SIX) {
      highestToken = stakingTokenFarm.quoteTokenAmount
    } else if (stakingTokenFarm.tokenAmount > stakingTokenFarm.quoteTokenAmount) {
      highestToken = stakingTokenFarm.tokenAmount
    } else {
      highestToken = stakingTokenFarm.quoteTokenAmount
    }
    const tokenPerLp = new BigNumber(totalLP).div(new BigNumber(highestToken))
    const priceUsdTemp = tokenPerLp.times(2).times(new BigNumber(sixPriceUSD))
    const estimatePrice = priceUsdTemp.times(new BigNumber(pool.totalStaked).div(new BigNumber(10).pow(18)))

    switch (pool.sousId) {
      case 0: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        apy = finixRewardPerYear.div(currentTotalStaked).times(100)
        break
      }
      case 1: {
        const totalRewardPerBlock = new BigNumber(stakingTokenFarm.finixPerBlock)
          .times(stakingTokenFarm.BONUS_MULTIPLIER)
          .div(new BigNumber(10).pow(18))
        const finixRewardPerBlock = totalRewardPerBlock.times(stakingTokenFarm.poolWeight)
        const finixRewardPerYear = finixRewardPerBlock.times(BLOCKS_PER_YEAR)
        const currentTotalStaked = getBalanceNumber(pool.totalStaked)
        const finixInSix = new BigNumber(currentTotalStaked).times(sixPriceUSD).div(finixPrice)
        apy = finixRewardPerYear.div(finixInSix).times(100)
        break
      }
      case 2:
      case 3:
      case 4:
      case 5:
      case 6:
      default:
        break
    }
    return {
      ...pool,
      isFinished: pool.sousId === 0 || pool.sousId === 1 ? false : pool.isFinished || block > pool.endBlock,
      apy,
      estimatePrice,
    }
  })

  const onPageChange = (e, page) => {
    setCurrentPage(page)
  }

  return (
    <>
      <CardTable className="mb-4">
        <div className="pa-4 pt-3 bd-b flex justify-space-between">
          <div className="flex">
            <Text fontSize="20px" bold lineHeight="1" marginTop="10px" paddingRight="14px">
              Voting Balance
            </Text>
            <Text fontSize="20px" bold lineHeight="1" marginTop="10px" color="textSubtle">
              {Number(totalVote)}
            </Text>
          </div>
        </div>
        <TransactionTable
          rows={farmsList(activeFarms, false).length !== 0 && farmsList(activeFarms, false)}
          isLoading={isLoading}
          empText="Don`t have any transactions in this voting balance."
          total
          klayPrice={klayPrice}
          finixPrice={finixPrice}
          kethPrice={kethPriceUsd}
          sixPrice={sixPrice}
        />
        <PaginationCustom
          page={currentPage}
          count={pages}
          size="small"
          hidePrevButton
          hideNextButton
          className="px-4 py-2"
          onChange={onPageChange}
        />
      </CardTable>
    </>
  )
}

export default VotingBalance
