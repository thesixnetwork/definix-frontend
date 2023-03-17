import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Button, Divider, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import rebalanceAbi from 'config/abi/rebalance.json'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import ModalV2 from 'uikitV2/components/ModalV2'
import SpaceBetweenFormat from 'uikitV2/components/SpaceBetweenFormat'
import { getAddress } from 'utils/addressHelpers'
import { getCustomContract } from 'utils/erc20'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { useSlippage, useToast } from '../../../state/hooks'
import { fetchRebalances } from '../../../state/rebalance'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../../state/wallet'
import CardHeading from './CardHeading'
import VerticalAssetRatio from './VerticalAssetRatio'

const InvestConfirmModal = ({
  currentInput,
  isInvesting,
  setIsInvesting,
  isSimulating,
  recalculate,
  poolUSDBalances,
  poolAmounts,
  rebalance,
  onNext,
  onDismiss = () => null,
}) => {
  const slippage = useSlippage()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const dispatch = useDispatch()
  const [tx, setTx] = useState({})
  const { toastSuccess, toastError } = useToast()

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  const totalUserUsdAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  // const minUserUsdAmount = totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))
  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply
  const priceImpact = Math.round((totalUserUsdAmount / totalUsdPool) * 10) / 10
  const priceImpactDisplay = (() => {
    if (priceImpact === Number.POSITIVE_INFINITY || priceImpact === Number.NEGATIVE_INFINITY) return 0
    return priceImpact
  })()

  const onInvest = async () => {
    const rebalanceContract = getCustomContract(
      ethereum as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsInvesting(true)
    try {
      let containMainCoin = false
      let mainCoinValue = '0'
      const arrayTokenAmount = ((rebalance || {}).tokens || []).map((token) => {
        if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') {
          containMainCoin = true
          mainCoinValue = new BigNumber((currentInput[token.address.toLowerCase()] || '0') as string)
            .times(new BigNumber(10).pow(token.decimals))
            .toJSON()
        }
        return new BigNumber((currentInput[token.address.toLowerCase()] || '0') as string)
          .times(new BigNumber(10).pow(token.decimals))
          .toJSON()
      })

      // const minUsdAmount = new BigNumber(minUserUsdAmount).times(new BigNumber(10).pow(usdToken.decimals)).toJSON()
      const thisTx = await rebalanceContract.methods
        // .addFund(arrayTokenAmount, usdTokenAmount, minUsdAmount)
        .addFund(arrayTokenAmount, 0)
        .send({ from: account, gas: 2000000, ...(containMainCoin ? { value: mainCoinValue } : {}) })
      setTx(thisTx)

      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address).toLowerCase())
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address).toLowerCase()))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalanceRewards(account, [rebalance]))
      dispatch(fetchRebalances())

      toastSuccess('Invest Complete')
      onNext()
      onDismiss()
      setIsInvesting(false)
    } catch {
      toastError('Invest Failed')
      setIsInvesting(false)
    }
  }

  return (
    <ModalV2 title="Confirm Invest" onDismiss={onDismiss} sx={{ width: '100%', maxWidth: { md: '490px' } }}>
      <Box overflow="auto" height="calc(100% - 64px)" mb={3}>
        <CardHeading rebalance={rebalance} hideDescription large className="pa-0" />

        <Typography fontWeight={500} color="text.secondary" sx={{ mb: '12px', mt: 5 }}>
          Invest Asset Ratio
        </Typography>

        <Box sx={{ borderRadius: '8px', border: (theme) => `1px solid ${theme.palette.grey[300]}`, p: 3, pt: 2 }}>
          <VerticalAssetRatio rebalance={rebalance} poolAmounts={poolAmounts} />

          <Divider sx={{ mt: 2, mb: 2.5 }} />

          <Box display="flex" justifyContent="space-between" mb={2}>
            <Typography fontWeight={500} color="text.secondary">
              Total Invest
            </Typography>
            <Typography fontWeight="bold">
              {currentShare <= 0 || Number.isNaN(currentShare)
                ? numeral(totalUserUsdAmount).format('0,0.[00]')
                : numeral(currentShare).format('0,0.[00]')}

              <Typography variant="body2" component="span" className="ml-1" color="text.secondary">
                SHR
              </Typography>
            </Typography>
          </Box>

          <SpaceBetweenFormat
            mb={1}
            title="Estimated Value"
            value={`$${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
          />

          <SpaceBetweenFormat
            mb={2}
            title="Price Impact"
            value={`${priceImpactDisplay <= 0.1 ? '< 0.1' : priceImpactDisplay}%`}
          />

          <Typography variant="caption" color="text.secondary">
            Output is estimated. You will receive at least{' '}
            <strong>
              {numeral(totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))).format('0,0.[00]')} USD
            </strong>{' '}
            or the transaction will revert.
          </Typography>
        </Box>
      </Box>

      {/* <Button fullWidth variant="contained" disabled={isInvesting || isSimulating} onClick={onInvest}>
        Invest
      </Button> */}

      <Button fullWidth variant="contained" disabled onClick={onInvest}>
        Invest
      </Button>
    </ModalV2>
  )
}

export default InvestConfirmModal
