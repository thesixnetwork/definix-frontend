import { useWallet } from '@binance-chain/bsc-use-wallet'
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControlLabel,
  FormGroup,
  styled,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material'
import BigNumber from 'bignumber.js'
import rebalanceAbi from 'config/abi/rebalance.json'
import _ from 'lodash'
import numeral from 'numeral'
import React from 'react'
import { useDispatch } from 'react-redux'
import { isExternalModule } from 'typescript'
import Card from 'uikitV2/components/Card'
import Coin from 'uikitV2/components/Coin'
import { getAddress } from 'utils/addressHelpers'
import { getCustomContract } from 'utils/erc20'
import { Input as NumericalInput } from 'views/Explore/components/NumericalInput'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../../state/wallet'
import SpaceBetweenFormat from './SpaceBetweenFormat'

const ratioTypes = [
  { value: 'all', label: 'Original' },
  { value: 'multi', label: 'Single' },
]

const FormControlLabelCustom = styled(FormControlLabel)`
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const InlineAssetRatioLabel = ({ coin }) => {
  const thisName = (() => {
    if (coin.symbol === 'WKLAY') return 'KLAY'
    if (coin.symbol === 'WBNB') return 'BNB'
    return coin.symbol
  })()
  return (
    <Box display="flex" alignItems="center" flexWrap="wrap" py={1}>
      <Coin name={thisName} symbol={coin.symbol} large flexGrow={1} />
      <Typography color="text.disabled">{coin.valueRatioCal.toFixed(2)}%</Typography>
      <Divider orientation="vertical" flexItem sx={{ m: '4px 20px', display: { xs: 'none', sm: 'block' } }} />

      <Typography sx={{ minWidth: { xs: '100%', sm: '140px' } }} align="right" color="text.secondary">
        {coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[0000]') : '-'}
      </Typography>
    </Box>
  )
}

const WithdrawInputCard = ({
  setTx,
  isWithdrawing,
  setIsWithdrawing,
  rebalance,
  poolAmounts,
  isSimulating,
  currentInput,
  setCurrentInput,
  onNext,
  ratioType,
  setRatioType,
  currentBalance,
  currentBalanceNumber,
  selectedToken,
  setSelectedToken,
}) => {
  const { account, ethereum } = useWallet()
  const dispatch = useDispatch()

  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice
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
      onNext()
      setIsWithdrawing(false)
    } catch {
      setIsWithdrawing(false)
    }
  }
  return (
    <Card sx={{ p: { xs: 2.5, sm: 5 } }}>
      <Box mb={4}>
        <Typography fontWeight={500} color="text.disabled" mb={2.5}>
          Withdrawal Amount
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
          <NumericalInput
            className="token-amount-input"
            value={currentInput}
            onUserInput={setCurrentInput}
            fontSize="1.75rem"
          />
          <Typography variant="body2" color="text.disabled">
            SHR
          </Typography>
        </Box>
        <Box display="flex">
          <Chip
            label="25%"
            size="small"
            variant="outlined"
            onClick={() => {
              setCurrentInput(new BigNumber(currentBalance).times(0.25).toJSON())
            }}
            sx={{ mr: '6px', background: 'transparent' }}
          />
          <Chip
            label="50%"
            size="small"
            variant="outlined"
            onClick={() => {
              setCurrentInput(new BigNumber(currentBalance).times(0.5).toJSON())
            }}
            sx={{ mr: '6px', background: 'transparent' }}
          />
          <Chip
            label="MAX"
            size="small"
            variant="outlined"
            onClick={() => {
              setCurrentInput(new BigNumber(currentBalance).toJSON())
            }}
            sx={{ mr: '6px', background: 'transparent' }}
          />
        </Box>
      </Box>

      <Box>
        {/* <SpaceBetweenFormat
          mb={1}
          title="Price Impact"
          value="< 0.1%"
          valueColor="success"
        /> */}
        <SpaceBetweenFormat
          mb={1}
          title={`Management fee ${_.get(rebalance, 'fee.management', 0.5)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / _.get(rebalance, 'fee.management', 0.5))).format('0,0.[0000]')}`}
          tooltip="Fee collected for vault management."
        />
        <SpaceBetweenFormat
          mb={1}
          title={`FINIX buy back fee ${_.get(rebalance, 'fee.buyback', 1.0)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / _.get(rebalance, 'fee.buyback', 1.0))).format('0,0.[0000]')}`}
          tooltip="Fee collected for buyback and burn of FINIX as deflationary purpose."
        />
        {/* <SpaceBetweenFormat
          title={`Ecosystem fee ${_.get(rebalance, 'fee.bounty', 0.3)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / _.get(rebalance, 'fee.bounty', 0.3))).format('0,0.[0000]')}`}
          tooltip="Reservation fee for further development of the ecosystem."
        /> */}
      </Box>

      <Divider sx={{ my: 4 }} />

      <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mb={{ xs: 1, sm: 4 }}>
        <Typography fontWeight={500} color="text.disabled">
          Withdrawal Ratio
        </Typography>
        <ToggleButtonGroup
          size="small"
          exclusive
          color="primary"
          value={ratioType}
          onChange={(e, newValue) => {
            if (newValue !== null) {
              setRatioType(newValue)
            }
          }}
          sx={{ width: { xs: '100%', sm: 'auto' }, mt: { xs: 2.5, sm: 0 } }}
        >
          {ratioTypes.map(({ value, label }) => (
            <ToggleButton value={value} key={label} sx={{ width: { xs: '100%', sm: '100px' } }}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      <Box mb={4}>
        {ratioType === 'all' ? (
          _.compact([...((rebalance || {}).tokens || [])])
            .map((token, index) => {
              const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
              const ratios = _.get(rebalance, `ratioCal`)
              // eslint-disable-next-line
              const ratioMerge = Object.assign({ valueRatioCal: ratios ? ratios[index] : 0 }, ratioObject)
              return {
                ...token,
                ...ratioMerge,
                amount: ((poolAmounts || [])[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
              }
            })
            .map((c) => <InlineAssetRatioLabel coin={c} />)
        ) : (
          <FormGroup>
            {_.compact([...((rebalance || {}).tokens || [])])
              .map((token, index) => {
                const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)

                let countSelect = 0

                const keys = Object.keys(selectedToken)
                for (let i = 0; i < keys.length; i++) {
                  if (selectedToken[keys[i]] === true) ++countSelect
                }

                let valueCalRatio = 0
                for (let i = 0; i < keys.length; i++) {
                  if (selectedToken[keys[i]] === true && keys[i] === getAddress(ratioObject.address))
                    valueCalRatio = 100 / countSelect
                }
                // eslint-disable-next-line
                const ratioMerge = Object.assign({ valueRatioCal: valueCalRatio }, ratioObject)

                return {
                  ...token,
                  ...ratioMerge,
                  amount: (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
                }
              })
              .map((c) => (
                <FormControlLabelCustom
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={!!selectedToken[getAddress(c.address)]}
                      onChange={(event) => {
                        setSelectedToken({ ...selectedToken, [getAddress(c.address)]: event.target.checked })
                      }}
                    />
                  }
                  label={<InlineAssetRatioLabel coin={c} />}
                />
              ))}
          </FormGroup>
        )}
      </Box>

      <Button fullWidth variant="contained" size="large" disabled={isWithdrawing || isSimulating} onClick={onWithdraw}>
        Withdraw
      </Button>
    </Card>
  )
}

export default WithdrawInputCard
