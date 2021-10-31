import ExchangeTab from 'components/ExchangeTab'
import FullPositionCard from 'components/PositionCard'
import Question from 'components/QuestionHelper'
import { StyledInternalLink } from 'components/Shared'
import { Dots } from 'components/swap/styleds'
import TransactionHistoryBox from 'components/TransactionHistoryBox'
import TranslatedText from 'components/TranslatedText'
import { bsc, injected, walletconnect } from 'connectors'
import { usePairs } from 'data/Reserves'
import { Pair } from 'definixswap-sdk'
import { useActiveWeb3React } from 'hooks'
import React, { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { Button, Card, ConnectorId, Heading, Text, useMatchBreakpoints } from 'uikit-dev'
import { Overlay } from 'uikit-dev/components/Overlay'
import { isTransactionRecent, useAllTransactions } from 'state/transactions/hooks'
import { useAllTokens } from 'hooks/Tokens'
import { LeftPanel, MaxWidthLeft, MaxWidthRight, RightPanel, ShowHideButton } from 'uikit-dev/components/TwoPanelLayout'
import UserBlock from 'uikit-dev/widgets/Menu/UserBlock'
import { TranslateString } from 'utils/translateTextHelpers'
import { TransactionDetails } from 'state/transactions/reducer'
import { getBscScanLink } from 'utils'
import Flip from '../../uikit-dev/components/Flip'
import AppBody from '../AppBody'

const TimerWrapper = ({ isPhrase2, date, children }) => {
  return isPhrase2 ? (
    children
  ) : (
    <>
      <div>
        <br />
        <Flip date={date} />
        <br />
        <br />
        <br />
      </div>
      <div
        tabIndex={0}
        role="button"
        style={{ opacity: 0.4, pointerEvents: 'none' }}
        onClick={(e) => {
          e.preventDefault()
        }}
        onKeyDown={(e) => {
          e.preventDefault()
        }}
      >
        {children}
      </div>
    </>
  )
}

const newTransactionsFirst = (a: TransactionDetails, b: TransactionDetails) => b.addedTime - a.addedTime

const TutorailsLink = styled(Link)`
  text-decoration-line: underline;
  font-size: 14px;
  font-weight: bold;
  color: #1587c9;
`

export default function Pool() {
  const { account, chainId, activate, deactivate } = useActiveWeb3React()
  const [isShowRightPanel, setIsShowRightPanel] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobileOrTablet = !isXl

  const allTransactions = useAllTransactions()
  const allTokens = useAllTokens()

  // Logic taken from Web3Status/index.tsx line 175
  const sortedRecentTransactions = useMemo(() => {
    const txs = Object.values(allTransactions)
    return txs
      .filter(isTransactionRecent)
      .filter((t) => t.type === 'addLiquidity' || t.type === 'removeLiquidity')
      .sort(newTransactionsFirst)
  }, [allTransactions])

  // fetch the user's balances of all tracked V2 LP tokens
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens,
  ])
  const [v2PairsBalances, fetchingV2PairBalances] = useTokenBalancesWithLoadingIndicator(
    account ?? undefined,
    liquidityTokens
  )

  const [isPhrase2, setIsPhrase2] = useState(false)
  const phrase2TimeStamp = process.env.REACT_APP_PHRASE_2_TIMESTAMP
    ? parseInt(process.env.REACT_APP_PHRASE_2_TIMESTAMP || '', 10) || new Date().getTime()
    : new Date().getTime()
  const currentTime = new Date().getTime()
  useEffect(() => {
    if (currentTime < phrase2TimeStamp) {
      setTimeout(() => {
        setIsPhrase2(true)
      }, phrase2TimeStamp - currentTime)
    } else {
      setIsPhrase2(true)
    }
  }, [currentTime, phrase2TimeStamp])

  // fetch the reserves for all V2 pools in which the user has a balance
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )

  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const v2IsLoading =
    fetchingV2PairBalances || v2Pairs?.length < liquidityTokensWithBalances.length || v2Pairs?.some((V2Pair) => !V2Pair)

  const allV2PairsWithLiquidity = v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair))

  useEffect(() => {
    if (isMobileOrTablet) {
      setIsShowRightPanel(false)
    }
  }, [isMobileOrTablet])

  useEffect(() => {
    return () => {
      setIsShowRightPanel(false)
    }
  }, [])

  return (
    <TimerWrapper isPhrase2={!(currentTime < phrase2TimeStamp && isPhrase2 === false)} date={phrase2TimeStamp}>
      <LeftPanel isShowRightPanel={isShowRightPanel}>
        <Overlay
          show={isShowRightPanel && isMobileOrTablet}
          style={{ position: 'absolute', zIndex: 6 }}
          onClick={() => {
            setIsShowRightPanel(false)
          }}
        />
        <MaxWidthLeft>
          <AppBody
            title={
              <Heading as="h1" fontSize="32px !important" className="mb-5" textAlign="left">
                EXCHANGE
              </Heading>
            }
          >
            <ExchangeTab current="/liquidity" />

            <div className="pa-6 bd-b">
              <div className="flex align-center mb-5">
                <Heading>Add liquidity to receive LP tokens</Heading>
                {/* <Question text="" /> */}
              </div>
              <Button id="join-pool-button" as={Link} to="/add/ETH" fullWidth radii="card">
                <TranslatedText translationId={100}>Add Liquidity</TranslatedText>
              </Button>
              <div className="mt-5 flex align-center justify-center">
                <Text paddingRight="1">I’m new to add liquidity, </Text>
                <TutorailsLink
                  as="a"
                  href="https://sixnetwork.gitbook.io/definix/exchange/how-to-add-liquidity"
                  target="_blank"
                >
                  Teach me how.
                </TutorailsLink>
              </div>
            </div>

            <div className="pa-6">
              <div className="flex align-center mb-5">
                <Heading fontSize="24px !important">
                  <TranslatedText translationId={102}>Your Liquidity</TranslatedText>
                </Heading>
                <Question
                  text={TranslateString(
                    130,
                    'When you add liquidity, you are given pool tokens that represent your share. If you don’t see a pool you joined in this list, try importing a pool below.'
                  )}
                />
              </div>

              {!account ? (
                <div className="py-6 flex flex-column align-center">
                  {isMobileOrTablet && (
                    <UserBlock
                      account={account as string}
                      login={(connectorId: ConnectorId) => {
                        if (connectorId === 'walletconnect') {
                          return activate(walletconnect)
                        }

                        if (connectorId === 'bsc') {
                          return activate(bsc)
                        }

                        return activate(injected)
                      }}
                      logout={deactivate}
                    />
                  )}

                  <Text color="textSubtle" textAlign="center" fontSize="16px" className="mt-2">
                    Connect to a wallet to view your liquidity.
                  </Text>
                </div>
              ) : v2IsLoading ? (
                <div className="pa-6">
                  <Text color="textSubtle" textAlign="center" fontSize="16px">
                    <Dots>Loading</Dots>
                  </Text>
                </div>
              ) : allV2PairsWithLiquidity?.length > 0 ? (
                <>
                  {allV2PairsWithLiquidity.map((v2Pair) => (
                    <FullPositionCard key={v2Pair.liquidityToken.address} pair={v2Pair} />
                  ))}
                </>
              ) : (
                <div className="pa-6">
                  <Text color="textSubtle" textAlign="center" fontSize="16px">
                    <TranslatedText translationId={104}>No liquidity found.</TranslatedText>
                  </Text>
                </div>
              )}

              <div className="mt-4">
                <Text className="mb-2">
                  {TranslateString(106, "Don't see a pool you joined?")}{' '}
                  <StyledInternalLink id="import-pool-link" to="/find">
                    {TranslateString(108, 'Import it.')}
                  </StyledInternalLink>
                </Text>
                <Text>Or, if you staked your LP tokens in a farm, unstake them to see them here</Text>
              </div>
            </div>
          </AppBody>
        </MaxWidthLeft>
      </LeftPanel>
      <RightPanel isShowRightPanel={isShowRightPanel}>
        <ShowHideButton
          isShow={isShowRightPanel}
          action={() => {
            setIsShowRightPanel(!isShowRightPanel)
          }}
        />

        {isShowRightPanel && (
          <MaxWidthRight>
            <Heading fontSize="20px !important" className="mb-3">
              LIQUIDITY HISTORY
            </Heading>
            <Card style={{ overflow: 'auto', flexGrow: 1 }}>
              {sortedRecentTransactions.length > 0 ? (
                sortedRecentTransactions
                  .filter((tx) => {
                    const firstToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.firstToken)
                    const secondToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.secondToken)
                    return !!firstToken && !!secondToken
                  })
                  .map((tx) => {
                    const firstToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.firstToken)
                    const secondToken = Object.values(allTokens).find((t) => t.symbol === tx.data?.secondToken)
                    return (
                      <TransactionHistoryBox
                        href={chainId ? getBscScanLink(chainId, tx.hash, 'transaction') : '/'}
                        firstCoin={firstToken}
                        firstCoinAmount={tx.data?.firstTokenAmount}
                        secondCoin={secondToken}
                        secondCoinAmount={tx.data?.secondTokenAmount}
                        title={tx.type === 'addLiquidity' ? 'Add Liquidity' : 'Remove Liquidity'}
                        withText="and"
                        isFailed={!tx.confirmedTime}
                        date={
                          tx.confirmedTime
                            ? new Date(tx.confirmedTime || 0).toLocaleString('en-US', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                              })
                            : ''
                        }
                      />
                    )
                  })
              ) : (
                <div className="flex align-center justify-center" style={{ height: '100%' }}>
                  <Text color="textSubtle" fontSize="14px" textAlign="center">
                    No Liquidity History
                  </Text>
                </div>
              )}
            </Card>
          </MaxWidthRight>
        )}
      </RightPanel>
    </TimerWrapper>
  )
}
