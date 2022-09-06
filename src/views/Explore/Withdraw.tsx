/* eslint-disable no-nested-ternary */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, useHistory } from 'react-router-dom'
import { useModal } from 'uikit-dev'
import BackV2 from 'uikitV2/components/BackV2'
import Card from 'uikitV2/components/Card'
import PageTitle from 'uikitV2/components/PageTitle'
import SmallestLayout from 'uikitV2/components/SmallestLayout'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { getAddress } from 'utils/addressHelpers'
import { simulateWithdraw } from '../../offline-pool'
import { useBalances, useRebalanceBalances } from '../../state/hooks'
import { Rebalance } from '../../state/types'
import { fetchBalances } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import WithdrawConfirmModal from './components/WithdrawConfirmModal'
import WithdrawInputCard from './components/WithdrawInputCard'

interface WithdrawType {
  rebalance: Rebalance | any
}

const Withdraw: React.FC<WithdrawType> = ({ rebalance }) => {
  const [tx, setTx] = useState({})
  const [selectedToken, setSelectedToken] = useState({})
  const [currentInput, setCurrentInput] = useState('')
  const [isSimulating, setIsSimulating] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [poolAmounts, setPoolAmounts] = useState([])
  const [ratioType, setRatioType] = useState('all')
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))
  const history = useHistory()

  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const rebalanceBalances = useRebalanceBalances(account)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setRatioType('all')
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (rebalance && new BigNumber(currentInput).toNumber() > 0) {
      setIsSimulating(true)
      const thisRebalanceBalance = _.get(rebalance, 'enableAutoCompound', false) ? rebalanceBalances : balances
      const myBalance = _.get(thisRebalanceBalance, getAddress(rebalance.address), new BigNumber(0))
      const thisInput = myBalance.isLessThan(new BigNumber(currentInput)) ? myBalance : new BigNumber(currentInput)
      const [, poolAmountsData] = await simulateWithdraw(
        thisInput,
        _.compact([...((rebalance || {}).tokens || [])]).map((c, index) => {
          const ratioPoint = (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber(currentInput as string).times(new BigNumber(10).pow(decimal)),
            isSelected: !!selectedToken[getAddress(ratioObject.address)],
            router: rebalance.router[index],
            factory: rebalance.factory[index],
            initCodeHash: rebalance.initCodeHash[index],
          }
        }),
        [((rebalance || {}).totalSupply || [])[0]],
        ratioType === 'all',
      )
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
    }
    if (new BigNumber(currentInput).toNumber() <= 0) {
      setPoolAmounts([])
    }
  }, [selectedToken, currentInput, rebalance, ratioType, balances, rebalanceBalances])

  useEffect(() => {
    fetchData()
  }, [selectedToken, currentInput, rebalance, fetchData, ratioType])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const thisBalance = _.get(rebalance, 'enableAutoCompound', false) ? rebalanceBalances : balances
  const currentBalance = _.get(thisBalance, getAddress(rebalance.address), new BigNumber(0))
  const currentBalanceNumber = currentBalance.toNumber()

  const [onPresentConfirmModal] = useModal(
    <WithdrawConfirmModal
      currentInput={currentInput}
      isWithdrawing={isWithdrawing}
      setIsWithdrawing={setIsWithdrawing}
      isSimulating={isSimulating}
      recalculate={fetchData}
      // poolUSDBalances={poolUSDBalances}
      selectedToken={selectedToken}
      poolAmounts={poolAmounts}
      ratioType={ratioType}
      rebalance={rebalance}
      currentBalance={currentBalance}
      onNext={() => {
        history.goBack()
      }}
    />,
    false,
  )

  return (
    <SmallestLayout>
      <BackV2 to="/rebalancing/detail" />
      <PageTitle title="Withdraw" caption="Withdraw your investment and get your tokens back." sx={{ mb: 2.5 }} />

      <Card className="mb-3" sx={{ p: { xs: 2.5, sm: 5 } }}>
        <CardHeading
          rebalance={rebalance}
          hideDescription
          large
          className="pa-0"
          breakpoint={theme.breakpoints.values.sm}
        />
        <Box flexWrap="wrap" pt={{ xs: 2.5, sm: 3 }} className="flex">
          <Box pr={{ sm: 3 }} className={smUp ? 'col-4 bd-r' : 'col-6 mb-3'}>
            <TwoLineFormatV2 large title="Shares" value={numeral(currentBalanceNumber).format('0,0.[00]')} />
          </Box>
          <Box px={{ sm: 3 }} className={smUp ? 'col-4 bd-r flex-grow' : 'col-6'}>
            <TwoLineFormatV2 large title="Share Price" value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`} />
          </Box>
          <Box px={{ sm: 3 }} className={smUp ? '' : 'col-6'}>
            <TwoLineFormatV2
              large
              title="Total Value"
              value={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
            />
          </Box>
        </Box>
      </Card>

      <WithdrawInputCard
        isWithdrawing={isWithdrawing}
        selectedToken={selectedToken}
        setSelectedToken={setSelectedToken}
        rebalance={rebalance}
        poolAmounts={poolAmounts}
        isSimulating={isSimulating}
        currentInput={currentInput}
        setCurrentInput={setCurrentInput}
        currentBalance={currentBalance}
        ratioType={ratioType}
        setRatioType={setRatioType}
        onNext={onPresentConfirmModal}
      />
    </SmallestLayout>
  )
}

export default Withdraw
