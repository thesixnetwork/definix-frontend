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
import _ from 'lodash'
import numeral from 'numeral'
import React from 'react'
import Card from 'uikitV2/components/Card'
import { Input as NumericalInput } from 'uikitV2/components/NumericalInput'
import SpaceBetweenFormat from 'uikitV2/components/SpaceBetweenFormat'
import { getAddress } from 'utils/addressHelpers'
import InlineAssetRatio from './InlineAssetRatio'

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

const WithdrawInputCard = ({
  isWithdrawing,
  rebalance,
  poolAmounts,
  isSimulating,
  currentInput,
  setCurrentInput,
  onNext,
  ratioType,
  setRatioType,
  currentBalance,
  selectedToken,
  setSelectedToken,
}) => {
  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice

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
            .map((c) => <InlineAssetRatio coin={c} />)
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
                  label={<InlineAssetRatio coin={c} />}
                />
              ))}
          </FormGroup>
        )}
      </Box>

      {/* <Button fullWidth variant="contained" size="large" disabled={isWithdrawing || isSimulating} onClick={onNext}>
        Withdraw
      </Button> */}
      <Button fullWidth variant="contained" size="large" disabled onClick={onNext}>
        Withdraw
      </Button>
    </Card>
  )
}

export default WithdrawInputCard
