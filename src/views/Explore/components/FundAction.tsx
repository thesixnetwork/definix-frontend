import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Button, Divider, styled } from '@mui/material'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import UserBlockV2 from 'uikitV2/components/UserBlockV2'
import { getAddress } from 'utils/addressHelpers'
import { useBalances, useRebalanceBalances, useRebalanceRewards } from '../../../state/hooks'
import { Rebalance } from '../../../state/types'
import Harvest from './Harvest'

interface FundActionType {
  rebalance?: Rebalance | any
}

const OverlayStyle = styled(Box)`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(180, 169, 168, 0.9);
  pointer-events: initial;

  button {
    height: 36px;
  }
`

const OverlayAction = ({ account, login, logout }) => {
  return (
    <OverlayStyle>
      <UserBlockV2 account={account} login={login} logout={logout} />
    </OverlayStyle>
  )
}

const CurrentInvestment = ({ rebalance }) => {
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  const api = process.env.REACT_APP_DEFINIX_TOTAL_TXN_AMOUNT_API

  const [diffAmount, setDiffAmount] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const sharedprice = +(currentBalanceNumber * rebalance.sharedPrice)

  const combinedAmount = useCallback(async () => {
    if (account) {
      const rebalanceAddress = getAddress(_.get(rebalance, 'address'))

      const myInvestTxnLocalStorage = JSON.parse(
        localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
      )

      const myInvestTxns = myInvestTxnLocalStorage[rebalanceAddress] ? myInvestTxnLocalStorage[rebalanceAddress] : []
      const resTotalTxn = await axios.get(`${api}/total_txn_amount?pool=${rebalanceAddress}&address=${account}`)

      const latestTxns = _.get(resTotalTxn.data, 'latest_txn')
      const totalUsds = _.get(resTotalTxn.data, 'total_usd_amount')
      const totalLps = _.get(resTotalTxn.data, 'total_lp_amount')

      const indexTx = _.findIndex(myInvestTxns, (investTxs) => investTxs === latestTxns)
      const transactionsSlice = myInvestTxns.slice(indexTx + 1)
      myInvestTxnLocalStorage[rebalanceAddress] = transactionsSlice
      localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxnLocalStorage))

      const txHash = {
        txns: transactionsSlice,
      }
      let lastTotalAmt = 0
      let lastTotalLp = 0
      if (transactionsSlice.length > 0) {
        const datas = (await axios.post(`${api}/txns_usd_amount`, txHash)).data
        lastTotalAmt = _.get(datas, 'total_usd_amount')
        lastTotalLp = _.get(datas, 'total_lp_amount')
      }

      const totalUsd = totalUsds
      const totalLpAmount = totalLps + lastTotalLp

      if (sharedprice > 0 && totalUsd > 0 && totalLpAmount > 0) {
        const totalUsdAmount = lastTotalAmt + totalUsd
        const diff = sharedprice - totalUsdAmount
        setDiffAmount(diff)
        const diffNewAmount = ((sharedprice - totalUsdAmount) / totalUsdAmount) * 100
        setPercentage(diffNewAmount)
      }
    }
  }, [sharedprice, rebalance, account, api])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      flexDirection={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'initial', sm: 'center' }}
      flexWrap="wrap"
    >
      <TwoLineFormatV2
        large
        title="Current Investment"
        subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
        value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
        percent={`(${
          percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
        }%)`}
        diffAmounts={`${
          percentage > 0 ? `+${numeral(diffAmount).format('0,0.[000]')}` : `${numeral(diffAmount).format('0,0.[000]')}`
        }`}
        percentColor={(() => {
          if (percentage < 0) return 'error.main'
          if (percentage > 0) return 'success.main'
          return ''
        })()}
      />

      <Box
        display="flex"
        alignItems="center"
        justifyContent={{ xs: 'initial', sm: 'flex-end' }}
        flexGrow={{ xs: 1, sm: 0 }}
        pt={{ xs: '0.75rem', sm: 0 }}
        sx={{ width: { xs: '100%', sm: '252px' } }}
      >
        <Button component={Link} to="/rebalancing/invest" fullWidth variant="contained" sx={{ mr: '0.75rem' }} disabled>
          Invest
        </Button>
        <Button component={Link} to="/rebalancing/withdraw" fullWidth variant="contained" color="info" disabled>
          Withdraw
        </Button>
      </Box>
    </Box>
  )
}

const FundAction: React.FC<FundActionType> = ({ rebalance }) => {
  const { account, connect, reset } = useWallet()
  const rebalanceRewards = useRebalanceRewards(account)

  const currentReward = (rebalanceRewards || {})[getAddress(rebalance.address)] || new BigNumber(0)

  return (
    <Box p={{ xs: 2.5, lg: '24px 32px' }}>
      {!account && <OverlayAction account={account} login={connect} logout={reset} />}
      <Harvest value={currentReward} rebalance={rebalance} />
      <Divider sx={{ my: { xs: 2, sm: 0.5 }, opacity: { xs: 1, sm: 0 } }} />
      <CurrentInvestment rebalance={rebalance} />
    </Box>
  )
}

export default FundAction
