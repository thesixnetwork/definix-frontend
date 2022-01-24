import { JSBI, Pair } from 'definixswap-sdk'
import React, { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Text,
  Flex,
  Box,
  ColorStyles,
  ButtonScales,
  ButtonVariants,
  useMatchBreakpoints,
  Lp,
} from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import useWallet from 'hooks/useWallet'
import useTotalSupply from 'hooks/useTotalSupply'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

interface PositionCardProps {
  pair: Pair
  isLastCard?: boolean
}

const FullPositionCard = ({ pair, isLastCard = false }: PositionCardProps) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  const { account } = useWallet()

  const currency0 = useMemo(() => unwrappedToken(pair.token0), [pair.token0])
  const currency1 = useMemo(() => unwrappedToken(pair.token1), [pair.token1])

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] = useMemo(
    () =>
      !!pair &&
      !!totalPoolTokens &&
      !!userPoolBalance &&
      // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
      JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
        ? [
            pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
            pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
          ]
        : [undefined, undefined],
    [pair, totalPoolTokens, userPoolBalance],
  )

  return (
    <Flex p={isMobile ? '24px 0' : '16px 0'} style={{ borderBottom: `${!isLastCard ? '1px solid #e0e0e0' : ''}` }}>
      <Flex
        width={isMobile ? '100%' : 'auto'}
        flexDirection={isMobile ? 'column' : 'row'}
        alignItems={isMobile ? 'flex-start' : 'center'}
      >
        <Flex alignItems="center" mb={isMobile ? '20px' : '0px'}>
          <Box mr="12px">
            <Lp size="32px" lpSymbols={[currency0?.symbol, currency1?.symbol]} />
          </Box>

          <Flex flexDirection="column" mr="20px" justifyContent="center">
            {!isMobile && (
              <Text mb="6px" textStyle="R_12R" color={ColorStyles.MEDIUMGREY}>
                {t('LP')}
              </Text>
            )}
            <Text mb={isMobile ? '0px' : '4px'} textStyle={isMobile ? 'R_16M' : 'R_14M'} color={ColorStyles.BLACK}>
              {currency0.symbol}-{currency1.symbol}
            </Text>
            <Box width={isMobile ? '100%' : '130px'}>
              <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
              </Text>
            </Box>
          </Flex>
        </Flex>

        <Flex
          flexDirection="column"
          justifyContent="center"
          mr={isMobile ? '0px' : '27px'}
          mb={isMobile ? '24px' : '0px'}
        >
          <Text mb="4px" textStyle="R_12R" color={ColorStyles.MEDIUMGREY}>
            {t('Pooled')}
          </Text>
          <Flex mb="4px" alignItems="center">
            <Box mr="6px" width="58px" p="2px 0px" borderRadius="10px" backgroundColor={ColorStyles.LIGHTBROWN}>
              <Text textAlign="center" textStyle="R_12R" color={ColorStyles.WHITE}>
                {currency0.symbol}
              </Text>
            </Box>
            <Box width="140px">
              {token0Deposited ? (
                <Text textStyle={isMobile ? 'R_16M' : 'R_14M'} color={ColorStyles.BLACK}>
                  {token0Deposited?.toSignificant(6)}
                </Text>
              ) : (
                '-'
              )}
            </Box>
          </Flex>

          <Flex alignItems="center">
            <Box mr="6px" width="58px" p="2px 0px" borderRadius="10px" backgroundColor={ColorStyles.LIGHTBROWN}>
              <Text textAlign="center" textStyle="R_12R" color={ColorStyles.WHITE}>
                {currency1.symbol}
              </Text>
            </Box>
            <Box width="140px">
              {token1Deposited ? (
                <Text textStyle={isMobile ? 'R_16M' : 'R_14M'} color={ColorStyles.BLACK}>
                  {token1Deposited?.toSignificant(6)}
                </Text>
              ) : (
                '-'
              )}
            </Box>
          </Flex>
        </Flex>

        <Button
          as={Link}
          to={`/liquidity/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
          width={isMobile ? '100%' : '100px'}
          scale={isMobile ? ButtonScales.LG : ButtonScales.MD}
          variant={ButtonVariants.LINE}
          color={ColorStyles.DEEPGREY}
        >
          {t('Select')}
        </Button>
      </Flex>
    </Flex>
  )
}

export default React.memo(FullPositionCard)
