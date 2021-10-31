import { JSBI, Pair, Percent } from 'definixswap-sdk'
import React, { useState } from 'react'
import { ChevronDown, ChevronUp } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Text } from 'uikit-dev'
import { useTotalSupply } from '../../data/TotalSupply'
import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { currencyId } from '../../utils/currencyId'
import { unwrappedToken } from '../../utils/wrappedCurrency'
import { BorderCard, HoverCard } from '../Card'
import { AutoColumn } from '../Column'
import CurrencyLogo from '../CurrencyLogo'
import DoubleCurrencyLogo from '../DoubleLogo'
import { RowBetween, RowFixed } from '../Row'
import { Dots } from '../swap/styleds'

export const FixedHeightRow = styled(RowBetween)`
  height: 24px;
`

interface PositionCardProps {
  pair: Pair
  // eslint-disable-next-line react/no-unused-prop-types
  showUnwrapped?: boolean
}

export function MinimalPositionCard({ pair, showUnwrapped = false }: PositionCardProps) {
  const { account } = useActiveWeb3React()

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
        <>
          <Text fontSize="14px" color="textSubtle" className="mb-1">
            LP tokens in your wallet
          </Text>
          <BorderCard>
            <AutoColumn gap="12px">
              <FixedHeightRow onClick={() => setShowMore(!showMore)}>
                <RowFixed margin="0 !important">
                  <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
                  <Text fontSize="14px" bold>
                    {currency0.symbol}/{currency1.symbol}
                  </Text>
                </RowFixed>
                <RowFixed margin="0 !important">
                  <Text fontSize="14px">{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
                </RowFixed>
              </FixedHeightRow>
              <AutoColumn gap="12px">
                <FixedHeightRow>
                  <Text fontSize="14px" bold>
                    {currency0.symbol}:
                  </Text>
                  {token0Deposited ? (
                    <RowFixed margin="0 !important">
                      <Text ml="6px" fontSize="14px">
                        {token0Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
                <FixedHeightRow>
                  <Text fontSize="14px" bold>
                    {currency1.symbol}:
                  </Text>
                  {token1Deposited ? (
                    <RowFixed margin="0 !important">
                      <Text ml="6px" fontSize="14px">
                        {token1Deposited?.toSignificant(6)}
                      </Text>
                    </RowFixed>
                  ) : (
                    '-'
                  )}
                </FixedHeightRow>
              </AutoColumn>
            </AutoColumn>
          </BorderCard>
        </>
      )}
    </>
  )
}

export default function FullPositionCard({ pair }: PositionCardProps) {
  const { account } = useActiveWeb3React()

  const currency0 = unwrappedToken(pair.token0)
  const currency1 = unwrappedToken(pair.token1)

  const [showMore, setShowMore] = useState(false)

  const userPoolBalance = useTokenBalance(account ?? undefined, pair.liquidityToken)
  const totalPoolTokens = useTotalSupply(pair.liquidityToken)

  const poolTokenPercentage =
    !!userPoolBalance && !!totalPoolTokens && JSBI.greaterThanOrEqual(totalPoolTokens.raw, userPoolBalance.raw)
      ? new Percent(userPoolBalance.raw, totalPoolTokens.raw)
      : undefined

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
    <HoverCard>
      <AutoColumn gap="12px">
        <FixedHeightRow onClick={() => setShowMore(!showMore)} style={{ cursor: 'pointer' }}>
          <RowFixed>
            <DoubleCurrencyLogo currency0={currency0} currency1={currency1} margin size={20} />
            <Text bold fontSize="16px !important">
              {!currency0 || !currency1 ? <Dots>Loading</Dots> : `${currency0.symbol}/${currency1.symbol}`}
            </Text>
          </RowFixed>
          <RowFixed>
            {showMore ? <ChevronUp size="20" className="ml-2" /> : <ChevronDown size="20" className="ml-2" />}
          </RowFixed>
        </FixedHeightRow>

        {showMore && (
          <AutoColumn gap="8px">
            <FixedHeightRow>
              <RowFixed>
                <Text>Pooled {currency0.symbol}:</Text>
              </RowFixed>
              {token0Deposited ? (
                <RowFixed>
                  <Text ml="6px">{token0Deposited?.toSignificant(6)}</Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency0} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>

            <FixedHeightRow>
              <RowFixed>
                <Text>Pooled {currency1.symbol}:</Text>
              </RowFixed>
              {token1Deposited ? (
                <RowFixed>
                  <Text ml="6px">{token1Deposited?.toSignificant(6)}</Text>
                  <CurrencyLogo size="20px" style={{ marginLeft: '8px' }} currency={currency1} />
                </RowFixed>
              ) : (
                '-'
              )}
            </FixedHeightRow>
            <FixedHeightRow>
              <Text>Your pool tokens:</Text>
              <Text>{userPoolBalance ? userPoolBalance.toSignificant(4) : '-'}</Text>
            </FixedHeightRow>
            <FixedHeightRow>
              <Text>Your pool share:</Text>
              <Text>{poolTokenPercentage ? `${poolTokenPercentage.toFixed(2)}%` : '-'}</Text>
            </FixedHeightRow>

            <RowBetween marginTop="10px">
              <Button as={Link} to={`/add/${currencyId(currency0)}/${currencyId(currency1)}`} style={{ width: '48%' }}>
                Add
              </Button>
              <Button
                as={Link}
                style={{ width: '48%' }}
                to={`/remove/${currencyId(currency0)}/${currencyId(currency1)}`}
              >
                Remove
              </Button>
            </RowBetween>
          </AutoColumn>
        )}
      </AutoColumn>
    </HoverCard>
  )
}
