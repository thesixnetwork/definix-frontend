import React, { useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import UnlockButton from 'components/UnlockButton'
import _ from 'lodash'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { AddIcon, Button, Card, MinusIcon, Text } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { useBalances, useRebalanceBalances, useRebalanceRewards } from '../../../state/hooks'
import { Rebalance } from '../../../state/types'
import Harvest from './Harvest'
import TwoLineFormat from './TwoLineFormat'

interface FundActionType {
  className?: string
  rebalance?: Rebalance | any
  isVertical?: boolean
}

const StickyBox = styled.div<{ isVertical: boolean }>`
  position: sticky;
  top: ${({ isVertical }) => (isVertical ? '0' : 'initial')};
  bottom: ${({ isVertical }) => (isVertical ? 'initial' : '0')};
  align-self: start;
  left: 0;
  margin-left: ${({ isVertical }) => (isVertical ? '1.25rem' : 'initial')};
  border-top: ${({ isVertical, theme }) => (isVertical ? '' : `1px solid ${theme.colors.border}`)};
`

const CurrentInvestment = ({ rebalance, isVertical = false, large = false }) => {
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  const api = process.env.REACT_APP_DEFINIX_TOTAL_TXN_AMOUNT_API

  const [diffAmount, setDiffAmount] = useState(0)
  const [percentage, setPercentage] = useState(0)
  const [validAddress, setValidAddress] = useState(false)
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

      const targetUrl = 'https://storage.googleapis.com/definix-rebalancing-withdraw-address/accounts.json'

      axios
        .get(targetUrl)
        .then((response) => {
          // The JSON data will be available in the response.data object
          const validAccount = response.data
          setValidAddress(false)
          for (let iter = 0; iter < validAccount.accounts.length; iter++) {
            if (account.toLowerCase() === validAccount.accounts[iter].toLowerCase()) {
              setValidAddress(true)
            }
          }
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }, [sharedprice, rebalance, account, api])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  return (
    <div className={isVertical ? '' : 'flex align-center'}>
      <TwoLineFormat
        title="Current investment"
        subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
        value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
        className={isVertical ? 'pa-3' : 'col-7'}
        large={large}
        currentInvestPercentDiff={`(${
          percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
        }%)`}
        diffAmounts={`${
          percentage > 0 ? `+${numeral(diffAmount).format('0,0.[000]')}` : `${numeral(diffAmount).format('0,0.[000]')}`
        }`}
        percentClass={(() => {
          if (percentage < 0) return 'failure'
          if (percentage > 0) return 'success'
          return ''
        })()}
      />

      {account ? (
        <>
          {isVertical ? (
            <div className="bd-t pa-3">
              <Button
                // as={Link}
                // to="/rebalancing/invest"
                fullWidth
                radii="small"
                className="mb-3"
                variant="primary"
                disabled
              >
                INVEST
              </Button>
              {validAddress && (
                <Button
                  as={Link}
                  to="/rebalancing/withdraw"
                  variant="secondary"
                  color="tertiary"
                  fullWidth
                  radii="small"
                >
                  WITHDRAW
                </Button>
              )}
              {!validAddress && (
                <Button variant="secondary" color="tertiary" fullWidth radii="small" disabled>
                  WITHDRAW
                </Button>
              )}
            </div>
          ) : (
            <div className="flex col-5 pl-2 justify-end">
              <Button
                // as={Link}
                // to="/rebalancing/invest"
                size="md"
                radii="small"
                className="mr-2 px-3"
                variant="primary"
                fullWidth
                disabled
              >
                <AddIcon color="lightgray" />
              </Button>
              {validAddress && (
                <Button
                  as={Link}
                  to="/rebalancing/withdraw"
                  variant="secondary"
                  size="md"
                  radii="small"
                  className="px-3"
                  fullWidth
                >
                  <MinusIcon color="lightgray" />
                </Button>
              )}
              {!validAddress && (
                <Button variant="secondary" size="md" radii="small" className="px-3" fullWidth disabled>
                  <MinusIcon color="lightgray" />
                </Button>
              )}
            </div>
          )}
        </>
      ) : (
        <div className={isVertical ? 'pa-3 bd-t' : 'col-5 pl-2'}>
          <UnlockButton fullWidth />
        </div>
      )}
    </div>
  )
}

const FundAction: React.FC<FundActionType> = ({ className, rebalance, isVertical = false }) => {
  const { account } = useWallet()
  const rebalanceRewards = useRebalanceRewards(account)

  const currentReward = (rebalanceRewards || {})[getAddress(rebalance.address)] || new BigNumber(0)

  return (
    <StickyBox isVertical={isVertical} className={className}>
      {isVertical ? (
        <>
          <Card className={isVertical ? 'mb-4' : 'pa-4 pb-0'}>
            <Harvest value={currentReward} rebalance={rebalance} isVertical large />
          </Card>

          <Card>
            <CurrentInvestment rebalance={rebalance} isVertical large />
          </Card>
        </>
      ) : (
        <Card className={isVertical ? 'mb-4' : 'pa-4'}>
          <Harvest value={currentReward} rebalance={rebalance} />
          <CurrentInvestment rebalance={rebalance} />
        </Card>
      )}
    </StickyBox>
  )
}

export default FundAction
