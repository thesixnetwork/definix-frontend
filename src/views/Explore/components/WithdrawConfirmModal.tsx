import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Button, Divider, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import rebalanceAbi from 'config/abi/rebalance.json'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import ModalV2 from 'uikitV2/components/ModalV2'
import { getAddress } from 'utils/addressHelpers'
import { getCustomContract } from 'utils/erc20'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { useSlippage, useToastG2 } from '../../../state/hooks'
import { fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../../state/wallet'
import CardHeading from './CardHeading'

const WithdrawConfirmModal = ({
  currentInput,
  isWithdrawing,
  setIsWithdrawing,
  isSimulating,
  recalculate,
  // poolUSDBalances,
  selectedToken,
  poolAmounts,
  ratioType,
  rebalance,
  currentBalance,
  onNext,
  onDismiss = () => null,
}) => {
  const slippage = useSlippage()
  const { account, ethereum } = useWallet()
  const dispatch = useDispatch()
  const [tx, setTx] = useState({})
  const { toastSuccess, toastError } = useToastG2()

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  // const totalUserUsdAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
  //   .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //   .toNumber()
  // const minUserUsdAmount = totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))
  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  // const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply
  // const priceImpact = Math.round((totalUserUsdAmount / totalUsdPool) * 10) / 10
  // const priceImpactDisplay = (() => {
  //   if (priceImpact === Number.POSITIVE_INFINITY || priceImpact === Number.NEGATIVE_INFINITY) return 0
  //   return priceImpact
  // })()

  const onWithdraw = async () => {
    const rebalanceContract = getCustomContract(
      ethereum as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsWithdrawing(true)
    try {
      const thisInput = currentBalance.isLessThan(new BigNumber(currentInput))
        ? currentBalance
        : new BigNumber(currentInput)

      const tx = await rebalanceContract.methods
        .removeFund(
          thisInput.times(new BigNumber(10).pow(18)).toJSON(),
          ratioType === 'all',
          ((rebalance || {}).tokens || []).map((token, index) => {
            const tokenAddress =
              typeof token.address === 'string' ? token.address.toLowerCase() : getAddress(token.address)
            return selectedToken[tokenAddress]
              ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
              : 0
          }),
        )
        .send({ from: account, gas: 5000000 })
      setTx(tx)

      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalanceRewards(account, [rebalance]))

      toastSuccess('Withdraw Complete')
      onNext()
      onDismiss()
      setIsWithdrawing(false)
    } catch {
      toastError('Withdraw Failed')
      setIsWithdrawing(false)
    }
  }

  return (
    <ModalV2 title="Confirm Withdraw" onDismiss={onDismiss} sx={{ width: '100%', maxWidth: { md: '490px' } }}>
      <Box overflow="auto" height="calc(100% - 64px)" mb={3}>
        <CardHeading rebalance={rebalance} hideDescription large className="pa-0" />

        <Typography fontWeight={500} color="text.secondary" sx={{ mb: '12px', mt: 5 }}>
          Withdrawal Amount
        </Typography>

        <Box sx={{ borderRadius: '8px', border: (theme) => `1px solid ${theme.palette.grey[300]}`, p: 3, pt: 2 }}>
          {/* <InlineAssetRatio coin={c} /> */}

          <Divider sx={{ mt: 2, mb: 2.5 }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight={500} color="text.secondary">
              Total Withdraw
            </Typography>
            {/* <Typography fontWeight="bold">
              {currentShare <= 0 || Number.isNaN(currentShare)
                ? numeral(totalUserUsdAmount).format('0,0.[00]')
                : numeral(currentShare).format('0,0.[00]')}

              <Typography variant="body2" component="span" className="ml-1" color="text.secondary">
                SHR
              </Typography>
            </Typography> */}
          </Box>

          {/* <SpaceBetweenFormat
            mb={1}
            title="Estimated Value"
            value={`$${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
          /> */}

          {/* <SpaceBetweenFormat
            mb={2}
            title="Price Impact"
            value={`${priceImpactDisplay <= 0.1 ? '< 0.1' : priceImpactDisplay}%`}
          /> */}

          {/* <Typography variant="caption" color="text.secondary">
            Output is estimated. You will receive at least{' '}
            <strong>
              {numeral(totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))).format('0,0.[00]')} USD
            </strong>{' '}
            or the transaction will revert.
          </Typography> */}
        </Box>
      </Box>

      <Button fullWidth variant="contained" disabled={isWithdrawing || isSimulating} onClick={onWithdraw}>
        Withdraw
      </Button>
    </ModalV2>
  )
}

export default WithdrawConfirmModal
