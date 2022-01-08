import React, { useMemo } from 'react'
import FullPositionCard from 'components/PositionCard'
import { toV2LiquidityToken, useTrackedTokenPairs } from 'state/user/hooks'
import { useTokenBalancesWithLoadingIndicator } from 'state/wallet/hooks'
import { usePairs } from 'data/Reserves'
import { Pair } from 'definixswap-sdk'
import { useActiveWeb3React } from 'hooks'
import {
  Flex,
  Box,
  Text,
  ColorStyles,
  ImgEmptyStateWallet,
  ImgEmptyStateLiquidity,
  useMatchBreakpoints,
} from '@fingerlabs/definixswap-uikit-v2'
import ConnectWalletButton from 'components/ConnectWalletButton'
import { useTranslation } from 'react-i18next'

const LiquidityList: React.FC = () => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  const { account } = useActiveWeb3React()
  const trackedTokenPairs = useTrackedTokenPairs()
  const tokenPairsWithLiquidityTokens = useMemo(
    () => trackedTokenPairs.map((tokens) => ({ liquidityToken: toV2LiquidityToken(tokens), tokens })),
    [trackedTokenPairs]
  )
  const liquidityTokens = useMemo(() => tokenPairsWithLiquidityTokens.map((tpwlt) => tpwlt.liquidityToken), [
    tokenPairsWithLiquidityTokens,
  ])

  const [v2PairsBalances] = useTokenBalancesWithLoadingIndicator(account ?? undefined, liquidityTokens)
  const liquidityTokensWithBalances = useMemo(
    () =>
      tokenPairsWithLiquidityTokens.filter(({ liquidityToken }) =>
        v2PairsBalances[liquidityToken.address]?.greaterThan('0')
      ),
    [tokenPairsWithLiquidityTokens, v2PairsBalances]
  )
  const v2Pairs = usePairs(liquidityTokensWithBalances.map(({ tokens }) => tokens))
  const allV2PairsWithLiquidity = useMemo(
    () => v2Pairs.map(([, pair]) => pair).filter((v2Pair): v2Pair is Pair => Boolean(v2Pair)),
    [v2Pairs]
  )

  return (
    <Box
      borderBottomLeftRadius="16px"
      borderBottomRightRadius="16px"
      borderLeft="1px solid #ffe5c9"
      borderRight="1px solid #ffe5c9"
      borderBottom="1px solid #ffe5c9"
      style={{ boxShadow: '0 12px 12px 0 rgba(227, 132, 0, 0.1)' }}
      backgroundColor={ColorStyles.WHITE}
      mb={isMobile ? '80px' : '40px'}
    >
      {account && allV2PairsWithLiquidity.length > 0 && (
        <Box p={isMobile ? '0px 20px' : '24px 40px'}>
          {allV2PairsWithLiquidity?.map((v2Pair, i) => (
            <FullPositionCard
              key={v2Pair.liquidityToken.address}
              pair={v2Pair}
              isLastCard={allV2PairsWithLiquidity.length - 1 === i}
            />
          ))}
        </Box>
      )}
      {account && allV2PairsWithLiquidity.length <= 0 && (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" p="60px">
          <Box mb="24px">
            <ImgEmptyStateLiquidity />
          </Box>
          <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
            {t('No liquidity found.')}
          </Text>
        </Flex>
      )}
      {!account && (
        <Flex flexDirection="column" justifyContent="center" alignItems="center" p="40px">
          <Box mb="24px">
            <ImgEmptyStateWallet />
          </Box>
          <Text mb="60px" textStyle="R_16M" color={ColorStyles.DEEPGREY} textAlign="center">
            {t('Connect to a wallet to view')}
          </Text>
          <ConnectWalletButton />
        </Flex>
      )}
    </Box>
  )
}

export default React.memo(LiquidityList)
