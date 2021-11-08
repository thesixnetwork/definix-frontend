import React, { useCallback, useEffect, useState } from 'react'
import UnlockButton from 'components/UnlockButton'
import _ from 'lodash'
import axios from 'axios'
import BigNumber from 'bignumber.js'
import numeral from 'numeral'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { Button, Card, Text } from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import { getAddress } from 'utils/addressHelpers'
import { useRebalanceBalances, useBalances } from '../../../state/hooks'
import TwoLineFormat from './TwoLineFormat'
import { Rebalance } from '../../../state/types'

interface FundActionType {
  className?: string
  rebalance?: Rebalance | any
  isVertical?: boolean
}

const CardStyled = styled(Card)`
  position: sticky;
  top: initial;
  bottom: 0;
  align-self: start;
  left: 0;
  width: 100%;
`

const FundAction: React.FC<FundActionType> = ({ className = '', rebalance, isVertical = false }) => {
  const { t } = useTranslation()
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
    <CardStyled className={`flex flex-wrap justify-space-between pa-4 mt-4 ${className}`}>
      {isVertical ? (
        <div className="pa-4">
          <Text fontSize="14px" color="textSubtle">
            {t('Current Investment')}
          </Text>
          <Text fontSize="14px">{`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}</Text>
          <div className="flex align-baseline">
            <Text fontSize="24px" bold lineHeight="1.3">
              {`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
            </Text>
            <div className="flex align-baseline">
              {diffAmount !== 0 && (
                <Text
                  className="ml-1"
                  fontSize="14px"
                  bold
                  color={(() => {
                    if (percentage < 0) return 'failure'
                    if (percentage > 0) return 'success'
                    return ''
                  })()}
                >
                  {`${
                    percentage > 0
                      ? `+${numeral(diffAmount).format('0,0.[000]')}`
                      : `${numeral(diffAmount).format('0,0.[000]')}`
                  }`}{' '}
                </Text>
              )}
              {percentage !== 0 && (
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
              )}
            </div>
          </div>
        </div>
      ) : (
        <TwoLineFormat
          title="Current investment"
          subTitle={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
          value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
          large
          currentInvestPercentDiff={`(${
            percentage > 0 ? `+${numeral(percentage).format('0,0.[00]')}` : `${numeral(percentage).format('0,0.[00]')}`
          }%)`}
          diffAmounts={`${
            percentage > 0
              ? `+${numeral(diffAmount).format('0,0.[000]')}`
              : `${numeral(diffAmount).format('0,0.[000]')}`
          }`}
          percentClass={(() => {
            if (percentage < 0) return 'failure'
            if (percentage > 0) return 'success'
            return ''
          })()}
        />
      )}

      <div className={`flex col-12 pt-2 ${isVertical ? 'flex-column bd-t pa-4' : ''}`}>
        {account ? (
          <>
            <Button
              scale="40"
              as={Link}
              to="/rebalancing/invest"
              className={isVertical ? 'mb-2' : 'mr-2'}
              variant="success"
            >
              INVEST
            </Button>
            <Button scale="40" as={Link} to="/rebalancing/withdraw" className="flex flex-column">
              WITHDRAW
            </Button>
          </>
        ) : (
          <UnlockButton scale="40" />
        )}
      </div>
    </CardStyled>
  )
}

export default FundAction
