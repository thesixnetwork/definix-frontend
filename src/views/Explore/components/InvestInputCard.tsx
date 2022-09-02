import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Button, Divider, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import Card from 'uikitV2/components/Card'
import CurrencyInputV2 from 'uikitV2/components/CurrencyInputV2'
import NoData from 'uikitV2/components/NoData'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import { provider } from 'web3-core'
import { fetchAllowances, fetchBalances } from '../../../state/wallet'
import TotalAmount from './TotalAmount'

const InvestInputCard = ({
  isSimulating,
  balances,
  allowances,
  rebalance,
  setCurrentInput,
  currentInput,
  totalUSDAmount,
  onNext,
}) => {
  const dispatch = useDispatch()
  const { account, ethereum } = useWallet()

  const onApprove = (token) => async () => {
    const tokenContract = getContract(ethereum as provider, getAddress(token.address).toLowerCase())

    try {
      await approveOther(tokenContract, getAddress(rebalance.address).toLowerCase(), account)

      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address).toLowerCase())
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address).toLowerCase()))
    } catch {
      console.log('Error')
    }
  }

  const findAddress = (token) => {
    if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') return 'main'
    return getAddress(token.address).toLowerCase()
  }
  function toFixedCustom(num) {
    return num.toString().match(/^-?\d+(?:\.\d{0,7})?/)[0]
  }

  const coins = useMemo(
    () =>
      rebalance.ratio
        .filter((coin) => coin.value)
        .map((c) => {
          const balance = _.get(rebalance, findAddress(c))
          return {
            ...c,
            cMax: balance || new BigNumber(0),
            cAddress: getAddress(c.address),
            cBalance: balance,
          }
        }),

    [rebalance],
  )

  const needsApprovalCoins = useMemo(
    () =>
      coins
        .map((c) => {
          const currentValue = parseFloat((currentInput[c.cAddress] as string) ?? '')
          const currentAllowance = (_.get(allowances, c.cAddress) || new BigNumber(0)).toNumber()
          const needsApproval = currentAllowance < currentValue && c.symbol !== 'WKLAY' && c.symbol !== 'WBNB'
          return {
            ...c,
            currentValue,
            needsApproval,
          }
        })
        .filter(({ currentValue }) => currentValue > 0),
    [coins, currentInput, allowances],
  )

  return (
    <Card className="mb-3" sx={{ p: { xs: 2.5, sm: 5 } }}>
      <Box>
        {rebalance.ratio.map((c) => (
          <CurrencyInputV2
            currency={c}
            balance={_.get(balances, findAddress(c))}
            id={`invest-${c.symbol}`}
            key={`invest-${c.symbol}`}
            value={currentInput[getAddress(c.address).toLowerCase()]}
            onMax={() => {
              const max = String((_.get(balances, findAddress(c)) || new BigNumber(0)).toNumber())
              const testMax = toFixedCustom(max)

              setCurrentInput({
                ...currentInput,
                [getAddress(c.address).toLowerCase()]: testMax,
              })
            }}
            onQuarter={() => {
              setCurrentInput({
                ...currentInput,
                [getAddress(c.address).toLowerCase()]: String(
                  (_.get(balances, findAddress(c)) || new BigNumber(0)).times(0.25).toNumber(),
                ),
              })
            }}
            onHalf={() => {
              setCurrentInput({
                ...currentInput,
                [getAddress(c.address).toLowerCase()]: String(
                  (_.get(balances, findAddress(c)) || new BigNumber(0)).times(0.5).toNumber(),
                ),
              })
            }}
            onUserInput={(value) => {
              setCurrentInput({ ...currentInput, [getAddress(c.address).toLowerCase()]: value })
            }}
          />
        ))}
      </Box>

      <Box my={4}>
        <Typography fontWeight={500} color="text.disabled" sx={{ mb: '12px' }}>
          Total Amount
        </Typography>

        {needsApprovalCoins.length ? (
          <TotalAmount coins={needsApprovalCoins} onApprove={onApprove} />
        ) : (
          <NoData text="Please input the investment amount." height="76px" />
        )}
      </Box>

      <Divider />

      <Box my={4}>
        <TwoLineFormatV2 extraLarge title="Total Value" value={`$${numeral(totalUSDAmount).format('0,0.[0000]')}`} />
      </Box>

      {(() => {
        const totalInput = rebalance.ratio.map((c) => currentInput[getAddress(c.address).toLowerCase()]).join('')

        return (
          <Button
            size="large"
            variant="contained"
            fullWidth
            disabled={isSimulating || totalInput.length === 0}
            onClick={onNext}
          >
            Calculate Invest amount
          </Button>
        )
      })()}
    </Card>
  )
}

export default InvestInputCard
