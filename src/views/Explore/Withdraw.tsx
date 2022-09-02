/* eslint-disable no-nested-ternary */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, useMediaQuery, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useState } from 'react'
import Lottie from 'react-lottie'
import { useDispatch } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { Button, ChevronRightIcon, Link as UiLink, Text, useMatchBreakpoints } from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
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
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import WithdrawInputCard from './components/WithdrawInputCard'

interface WithdrawType {
  rebalance: Rebalance | any
}

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const CardResponse = ({ tx, currentInput, rebalance }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice
  const { transactionHash } = tx
  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4' : 'pa-6'}>
        <div className="flex flex-column align-center justify-center mb-6">
          <Lottie options={SuccessOptions} height={120} width={120} />
          {/* <ErrorIcon width="80px" color="failure" className="mb-3" /> */}
          <Text fontSize="24px" bold textAlign="center">
            Withdraw Complete
          </Text>
          <Text color="textSubtle" textAlign="center" className="mt-1" fontSize="12px">
            {moment(new Date()).format('DD MMM YYYY, HH:mm')}
          </Text>

          <CardHeading rebalance={rebalance} className="mt-6" />
        </div>

        <div className="flex flex-wrap align-center mb-6">
          <div className={`flex flex-column ${isMobile ? 'col-12 pb-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share
              share={currentInput}
              usd={`~ $${numeral(
                usdToBeRecieve -
                  // usdToBeRecieve / (100 / _.get(rebalance, 'fee.bounty', 0.3)) -
                  usdToBeRecieve / (100 / _.get(rebalance, 'fee.buyback', 1.0)) -
                  usdToBeRecieve / (100 / _.get(rebalance, 'fee.management', 0.5)),
              ).format('0,0.[0000]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
          </div>
          {/* <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} /> */}
        </div>

        <SpaceBetweenFormat
          titleElm={
            <div className="flex">
              <Text fontSize="12px" color="textSubtle" className="mr-2">
                Transaction Hash
              </Text>
              <Text fontSize="12px" color="primary" bold>
                {`${transactionHash.slice(0, 4)}...${transactionHash.slice(
                  transactionHash.length - 4,
                  transactionHash.length,
                )}`}
              </Text>
            </div>
          }
          valueElm={
            <UiLink
              href={`https://bscscan.com/tx/${transactionHash}`}
              fontSize="12px"
              color="textSubtle"
              style={{ marginRight: '-4px' }}
            >
              Bscscan
              <ChevronRightIcon color="textSubtle" />
            </UiLink>
          }
          className="mb-2"
        />

        <Button as={Link} to="/rebalancing/detail" fullWidth radii="small" className="mt-3">
          Back to Rebalancing
        </Button>
      </div>
    </Card>
  )
}

const Withdraw: React.FC<WithdrawType> = ({ rebalance }) => {
  const [tx, setTx] = useState({})
  const [selectedToken, setSelectedToken] = useState({})
  const [currentInput, setCurrentInput] = useState('')
  const [isInputting, setIsInputting] = useState(true)
  const [isSimulating, setIsSimulating] = useState(false)
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [poolAmounts, setPoolAmounts] = useState([])
  const [isWithdrawn, setIsWithdrawn] = useState(false)
  const [ratioType, setRatioType] = useState('all')
  const theme = useTheme()
  const smUp = useMediaQuery(theme.breakpoints.up('sm'))

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
      setIsInputting(true)
      setIsWithdrawn(false)
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

      {isInputting && (
        <WithdrawInputCard
          setTx={setTx}
          isWithdrawing={isWithdrawing}
          setIsWithdrawing={setIsWithdrawing}
          selectedToken={selectedToken}
          setSelectedToken={setSelectedToken}
          rebalance={rebalance}
          poolAmounts={poolAmounts}
          isSimulating={isSimulating}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          currentBalance={currentBalance}
          currentBalanceNumber={currentBalanceNumber}
          ratioType={ratioType}
          setRatioType={setRatioType}
          onNext={() => {
            setIsInputting(false)
            setIsWithdrawn(true)
          }}
        />
      )}

      {isWithdrawn && <CardResponse currentInput={currentInput} tx={tx} rebalance={rebalance} />}
    </SmallestLayout>
  )
}

export default Withdraw
