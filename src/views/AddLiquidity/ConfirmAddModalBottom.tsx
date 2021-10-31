import { AutoColumn } from 'components/Column'
import { Currency, CurrencyAmount, Fraction, Percent } from 'definixswap-sdk'
import React from 'react'
import { Button, Text } from 'uikit-dev'
import CurrencyLogo from '../../components/CurrencyLogo'
import { RowBetween } from '../../components/Row'
import { Field } from '../../state/mint/actions'

export function ConfirmAddModalBottom({
  noLiquidity,
  price,
  currencies,
  parsedAmounts,
  poolTokenPercentage,
  onAdd,
}: {
  noLiquidity?: boolean
  price?: Fraction
  currencies: { [field in Field]?: Currency }
  parsedAmounts: { [field in Field]?: CurrencyAmount }
  poolTokenPercentage?: Percent
  onAdd: () => void
}) {
  return (
    <>
      <AutoColumn gap="16px">
        <RowBetween>
          <div className="flex align-center">
            <CurrencyLogo currency={currencies[Field.CURRENCY_A]} style={{ marginRight: '8px' }} />
            <div className="flex">
              <Text className="mr-1" bold>
                {currencies[Field.CURRENCY_A]?.symbol}
              </Text>
              <Text color="textSubtle">Deposited</Text>
            </div>
          </div>
          <div className="flex justify-end">
            <Text bold className="mr-1">
              {parsedAmounts[Field.CURRENCY_A]?.toSignificant(6)}
            </Text>
            <Text bold>{currencies[Field.CURRENCY_A]?.symbol}</Text>
          </div>
        </RowBetween>

        <RowBetween>
          <div className="flex align-center">
            <CurrencyLogo currency={currencies[Field.CURRENCY_B]} style={{ marginRight: '8px' }} />
            <div className="flex">
              <Text className="mr-1" bold>
                {currencies[Field.CURRENCY_B]?.symbol}
              </Text>
              <Text color="textSubtle">Deposited</Text>
            </div>
          </div>
          <div className="flex justify-end">
            <Text bold className="mr-1">
              {parsedAmounts[Field.CURRENCY_B]?.toSignificant(6)}
            </Text>
            <Text bold>{currencies[Field.CURRENCY_B]?.symbol}</Text>
          </div>
        </RowBetween>

        <RowBetween align="baseline">
          <Text color="textSubtle">Price Rate</Text>

          <div className="flex flex-column align-end">
            <Text bold>
              {`1 ${currencies[Field.CURRENCY_A]?.symbol} = ${price?.toSignificant(4)} ${
                currencies[Field.CURRENCY_B]?.symbol
              }`}
            </Text>
            <Text bold>
              {`1 ${currencies[Field.CURRENCY_B]?.symbol} = ${price?.invert().toSignificant(4)} ${
                currencies[Field.CURRENCY_A]?.symbol
              }`}
            </Text>
          </div>
        </RowBetween>

        <RowBetween>
          <Text color="textSubtle">Share of Pool</Text>
          <Text bold>{noLiquidity ? '100' : poolTokenPercentage?.toSignificant(4)}%</Text>
        </RowBetween>
      </AutoColumn>
      <Button className="mt-6" onClick={onAdd} fullWidth radii="card">
        {noLiquidity ? 'Create Pool & Supply' : 'Confirm Supply'}
      </Button>
    </>
  )
}

export default ConfirmAddModalBottom
