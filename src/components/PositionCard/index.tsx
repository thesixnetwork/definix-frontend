import { JSBI, Pair } from 'definixswap-sdk'
import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Text,
  CardBody,
  Flex,
  Box,
  ColorStyles,
  ButtonScales,
  ButtonVariants,
  useMatchBreakpoints,
  Lp,
} from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'

interface PositionCardProps {
  pair: Pair
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
  isLastCard?: boolean
}

export const MinimalPositionCard = React.memo(({ pair, showUnwrapped = false, isLastCard }: PositionCardProps) => {
  const { t } = useTranslation()
  const { account } = useActiveWeb3React()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  const currency0 = showUnwrapped ? pair.token0 : unwrappedToken(pair.token0)
  const currency1 = showUnwrapped ? pair.token1 : unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const [token0Deposited, token1Deposited] =
    !!pair &&
    !!totalPoolTokens &&
    !!userPoolBalance &&
    // this condition is a short-circuit in the case where useTokenBalance updates sooner than useTotalSupply
    JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? [
          pair.getLiquidityValue(pair.token0, totalPoolTokens, userPoolBalance, false),
          pair.getLiquidityValue(pair.token1, totalPoolTokens, userPoolBalance, false),
        ]
      : [undefined, undefined]

  return (
    <>
      {userPoolBalance && (
        <Flex backgroundColor={ColorStyles.WHITE} borderRadius="16px">
          <CardBody style={{ width: '100%' }} p={isMobile ? '20px' : '40px'}>
            <Flex flexDirection="column">
              <Text textStyle="R_16M" color={ColorStyles.DEEPGREY}>
                {t('Balance LP')}
              </Text>
              <Flex mt={isMobile ? '14px' : '12px'}>
                <Box width={isMobile ? '46px' : '43px'} mr={isMobile ? '12px' : '10px'}>
                  <Lp size="24px" lpSymbols={[currency0?.symbol, currency1?.symbol]} />
                </Box>
                <Flex flexDirection="column" width="100%">
                  <Flex
                    justifyContent="space-between"
                    mb={isMobile ? '14px' : '8px'}
                    onClick={() => setShowMore(!showMore)}
                  >
                    <Flex>
                      <Text textStyle="R_14R">
                        {currency0.symbol}-{currency1.symbol}
                      </Text>
                    </Flex>
                    <Flex>
                      <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                        {userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex flexDirection="column" width="100%">
                    <Flex justifyContent="space-between" mb={isMobile ? '6px' : '8px'}>
                      <Flex alignItems="center">
                        <Box
                          width="3px"
                          height="3px"
                          borderRadius="50%"
                          backgroundColor={ColorStyles.MEDIUMGREY}
                          mr="6px"
                        />
                        <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                          {currency0.symbol}
                        </Text>
                      </Flex>
                      {token0Deposited ? (
                        <Flex>
                          <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                            {token0Deposited?.toSignificant(6)}
                          </Text>
                        </Flex>
                      ) : (
                        '-'
                      )}
                    </Flex>
                    <Flex justifyContent="space-between">
                      <Flex alignItems="center">
                        <Box
                          width="3px"
                          height="3px"
                          borderRadius="50%"
                          backgroundColor={ColorStyles.MEDIUMGREY}
                          mr="6px"
                        />
                        <Text textStyle="R_14R" color={ColorStyles.MEDIUMGREY}>
                          {currency1.symbol}
                        </Text>
                      </Flex>

                      {token1Deposited ? (
                        <Flex>
                          <Text textStyle="R_14M" color={ColorStyles.DEEPGREY}>
                            {token1Deposited?.toSignificant(6)}
                          </Text>
                        </Flex>
                      ) : (
                        '-'
                      )}
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </CardBody>
        </Flex>
      )}
    </>
  )
})

const FullPositionCard = ({ pair, isLastCard = false }: PositionCardProps) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  const { account } = useActiveWeb3React()

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
    [pair, totalPoolTokens, userPoolBalance]
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
