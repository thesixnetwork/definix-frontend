import OpenInNewRoundedIcon from '@mui/icons-material/OpenInNewRounded'
import { Box, Divider, Link, Typography } from '@mui/material'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import React from 'react'
import Lottie from 'react-lottie'
import success from 'uikit-dev/animation/complete.json'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import CardHeading from './CardHeading'

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const InvestResponseCard = ({ tx, rebalance, poolUSDBalances }) => {
  const { transactionHash } = tx

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  const totalUserUsdAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply

  return (
    <Box>
      <CardHeading rebalance={rebalance} hideDescription large className="pa-0" />
      <Box
        sx={{
          borderRadius: '8px',
          border: (theme) => `1px solid ${theme.palette.grey[300]}`,
          p: 3,
          pt: 2,
          mt: '32px',
        }}
      >
        <Lottie options={SuccessOptions} height={120} width={120} />
        {/* <ErrorIcon width="80px" color="failure" className="mb-3" /> */}
        <Typography variant="h6" textAlign="center" fontWeight="bold">
          Invest Complete
        </Typography>
        <Typography variant="caption" component="p" color="text.secondary" textAlign="center" className="mt-1">
          {moment(new Date()).format('DD MMM YYYY, HH:mm')}
        </Typography>

        <Divider sx={{ my: 3 }} />

        <TwoLineFormatV2
          extraLarge
          title="Share"
          value={
            currentShare <= 0 || Number.isNaN(currentShare)
              ? numeral(totalUserUsdAmount).format('0,0.[00]')
              : numeral(currentShare).format('0,0.[00]')
          }
          subValue={`~ $${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
          className="mb-2"
        />

        {transactionHash && (
          <Box display="flex" justifyContent="space-between" flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              Transaction Hash
              <Typography variant="body2" fontWeight="bold" className="ml-2" component="span">
                {`${transactionHash.slice(0, 4)}...${transactionHash.slice(
                  transactionHash.length - 4,
                  transactionHash.length,
                )}`}
              </Typography>
            </Typography>

            <Link
              variant="body2"
              color="text.disabled"
              href={`https://bscscan.com/tx/${tx}`}
              className="flex align-center"
              target="_blank"
            >
              BscScan
              <OpenInNewRoundedIcon className="ml-2" sx={{ fontSize: '16px' }} />
            </Link>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default InvestResponseCard
