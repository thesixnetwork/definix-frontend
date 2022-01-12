import { JSBI, Pair } from 'definixswap-sdk'
import React, { useMemo, useState } from 'react'
import {
  Text,
  CardBody,
  Flex,
  Box,
  ColorStyles,
  useMatchBreakpoints,
  Lp,
} from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import useWallet from 'hooks/useWallet'
import { useTotalSupply } from '../../data/TotalSupply'
import { useTokenBalance } from '../../state/wallet/hooks'
import { unwrappedToken } from '../../utils/wrappedCurrency'

interface IProps {
  pair: Pair
  showUnwrapped?: boolean
}

const MinimalPositionCard: React.FC<IProps> = React.memo(({ pair, showUnwrapped = false }) => {
  const { t } = useTranslation()
  const { account } = useWallet()

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

export default MinimalPositionCard;