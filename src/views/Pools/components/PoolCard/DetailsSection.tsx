import useI18n from 'hooks/useI18n'
import numeral from 'numeral'
import React, { useMemo } from 'react'
import { Flex, ChevronRightIcon, Link, Text } from 'definixswap-uikit'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import usePrice from 'hooks/usePrice'
import { DetailsSectionProps } from './types'

const DetailsSection: React.FC<DetailsSectionProps> = ({
  tokenName,
  totalStaked,
  balance,
  earnings,
  klaytnScopeAddress,
}) => {
  const TranslateString = useI18n()
  const { convertToUSD, getPrice } = usePrice()

  const price = useMemo(() => {
    return getPrice(tokenName)
  }, [getPrice, tokenName])

  const totalStakedValue = useMemo(() => {
    return getBalanceNumber(totalStaked)
  }, [totalStaked])

  const totalStakedPrice = useMemo(() => {
    return convertToUSD(totalStakedValue * price, 0)
  }, [convertToUSD, totalStakedValue, price])

  const balanceValue = useMemo(() => {
    return getFullDisplayBalance(balance)
  }, [balance])

  const earningsValue = useMemo(() => {
    return getBalanceNumber(earnings)
  }, [earnings])

  const LinkView = ({ linkClassName = '' }) => (
    <Link
      external
      href={`https://scope.klaytn.com/account/${klaytnScopeAddress}`}
      bold={false}
      className={`flex-shrink ${linkClassName}`}
      color="textSubtle"
      fontSize="12px"
    >
      {TranslateString(356, 'View on KlaytnScope')}
      <ChevronRightIcon color="textSubtle" />
    </Link>
  )

  return (
    <Flex justifyContent="space-between">
      <div style={{ marginRight: '30px' }}>
        <Text color="textSubtle">
          Total Staked: {totalStakedValue.toLocaleString()} = {totalStakedPrice}
        </Text>
      </div>
      <div style={{ marginRight: '30px' }}>
        <Text color="textSubtle">Balance: {balanceValue}</Text>
      </div>
      <div>
        <Text color="textSubtle">Earned: {earningsValue.toLocaleString()}</Text>
      </div>

      {/* {false && (
        <div className="flex justify-end mt-1" style={{ marginRight: '-6px' }}>
          <LinkView />
        </div>
      )} */}
    </Flex>
  )
}

export default DetailsSection
