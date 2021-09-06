import React, { useCallback, useEffect, useState } from 'react'
import UnlockButton from 'components/UnlockButton'
import _ from 'lodash'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Button, Card, useMatchBreakpoints, Text } from 'uikit-dev'
import { getAddress } from 'utils/addressHelpers'
import { useRebalanceBalances, useBalances } from '../../../state/hooks'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'

interface FundActionType {
  className?: string
  rebalance?: Rebalance | any
  isVertical?: boolean
}

const CardStyled = styled(Card)<{ isVertical: boolean }>`
  position: sticky;
  top: ${({ isVertical }) => (isVertical ? '0' : 'initial')};
  bottom: ${({ isVertical }) => (!isVertical ? '0' : 'initial')};
  align-self: start;
  left: 0;
  width: 100%;
`

const FundAction: React.FC<FundActionType> = ({ className, rebalance, isVertical = false }) => {
  const { isXl, isMd, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd && !isLg
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  const thisBalance = rebalance.enableAutoCompound ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  const api = process.env.REACT_APP_DEFINIX_TOTAL_TXN_AMOUNT_API

  const [percentage, setPercentage] = useState(0)
  const sharedprice = +(currentBalanceNumber * rebalance.sharedPrice)

  const combinedAmount = useCallback(async () => {
    const rebalanceAddress = getAddress(_.get(rebalance, 'address'))

    const myInvestTxnLocalStorage = JSON.parse(
      localStorage.getItem('my_invest_tx') ? localStorage.getItem('my_invest_tx') : '{}',
    )

    const byAccountLocalStorage = JSON.parse(
      localStorage.getItem('by_account') ? localStorage.getItem('by_account') : '{}',
    )

    const myInvestTxns = myInvestTxnLocalStorage[rebalanceAddress] ? myInvestTxnLocalStorage[rebalanceAddress] : []
    const resTotalTxn = await axios.get(`${api}/total_txn_amount?pool=${rebalanceAddress}&address=${account}`)

    const latestTxns = _.get(resTotalTxn.data, 'latest_txn')
    const totalUsds = _.get(resTotalTxn.data, 'total_usd_amount')
    const indexTx = _.findIndex(myInvestTxns, (investTxs) => investTxs === latestTxns)

    const transactionsSlice = myInvestTxns.slice(indexTx + 1)
    myInvestTxnLocalStorage[rebalanceAddress] = transactionsSlice
    localStorage.setItem('my_invest_tx', JSON.stringify(myInvestTxnLocalStorage))

    byAccountLocalStorage[account] = transactionsSlice
    localStorage.setItem('by_account', JSON.stringify(byAccountLocalStorage))

    const txHash = {
      txns: transactionsSlice,
    }

    const datas = (await axios.post(`${api}/txns_usd_amount`, txHash)).data
    const total = _.get(datas, 'total_usd_amount')

    const totalUsd = totalUsds

    if (sharedprice > 0 && totalUsd > 0) {
      const totalUsdAmount = total + totalUsd
      const diffNewAmount = ((sharedprice - totalUsdAmount) / totalUsdAmount) * 100
      setPercentage(diffNewAmount)
    }
  }, [sharedprice, rebalance, account, api])

  useEffect(() => {
    combinedAmount()
  }, [combinedAmount])

  return (
    <CardStyled
      className={`flex flex-wrap justify-space-between ${className} ${isVertical ? 'flex-column ml-4' : 'pa-4 bd-t'}`}
      isVertical={isVertical}
    >
      {isVertical ? (
        <div className="pa-4">
          <Text fontSize="14px" color="textSubtle">
            Current investment
          </Text>
          <Text fontSize="14px">{`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}</Text>
          <div className="flex align-center">
            <Text fontSize="24px" bold lineHeight="1.3">
              {`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
            </Text>
            <Text
              className="ml-1"
              fontSize="12px"
              bold
              color={(() => {
                if (percentage < 0) return 'failure'
                if (percentage > 0) return 'success'
                return ''
              })()}
            >
              {`(${
                percentage > 0
                  ? `+${numeral(percentage).format('0,0.[00]')}`
                  : `${numeral(percentage).format('0,0.[00]')}`
              }%)`}
            </Text>
          </div>
        </div>
      ) : (
        <TwoLineFormat
          title="Current investment"
          subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
          value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
          large
          currentInvestPercentDiff={`${
            percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
          }%`}
          percentClass={(() => {
            if (percentage < 0) return 'failure'
            if (percentage > 0) return 'success'
            return ''
          })()}
        />
      )}

      {account ? (
        <div
          className={`flex ${isMobile || isVertical ? 'col-12' : 'col-6'} ${isMobile ? 'pt-2' : ''} ${
            isVertical ? 'flex-column bd-t pa-4' : ''
          }`}
        >
          <Button
            as={Link}
            to="/rebalancing/invest"
            fullWidth
            radii="small"
            className={isVertical ? 'mb-2' : 'mr-2'}
            variant="success"
          >
            INVEST
          </Button>
          <Button as={Link} to="/rebalancing/withdraw" fullWidth radii="small" className="flex flex-column">
            WITHDRAW
          </Button>
        </div>
      ) : (
        <div
          className={`flex ${isMobile || isVertical ? 'col-12' : 'col-6'} ${isMobile ? 'pt-2' : ''} ${
            isVertical ? 'flex-column bd-t pa-4' : ''
          }`}
        >
          <UnlockButton fullWidth />
        </div>
      )}
    </CardStyled>
  )
}

export default FundAction
