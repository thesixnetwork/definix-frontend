/* eslint-disable no-nested-ternary */
import { useWallet } from '@binance-chain/bsc-use-wallet'
import { Box, Button, Divider, useMediaQuery, useTheme } from '@mui/material'
import BigNumber from 'bignumber.js'
import rebalanceAbi from 'config/abi/rebalance.json'
import _ from 'lodash'
import moment from 'moment'
import numeral from 'numeral'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Lottie from 'react-lottie'
import { useDispatch } from 'react-redux'
import { Link, Redirect } from 'react-router-dom'
import { ChevronRightIcon, Link as UiLink, Text, useMatchBreakpoints } from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
import BackV2 from 'uikitV2/components/BackV2'
import Card from 'uikitV2/components/Card'
import CurrencyInputV2 from 'uikitV2/components/CurrencyInputV2'
import PageTitle from 'uikitV2/components/PageTitle'
import SmallestLayout from 'uikitV2/components/SmallestLayout'
import TwoLineFormatV2 from 'uikitV2/components/TwoLineFormatV2'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract, getCustomContract } from 'utils/erc20'
import { provider } from 'web3-core'
import { AbiItem } from 'web3-utils'
import { simulateInvest } from '../../offline-pool'
import { useAllowances, useBalances, usePriceFinixUsd, useSlippage } from '../../state/hooks'
import { fetchRebalances } from '../../state/rebalance'
import { Rebalance } from '../../state/types'
import { fetchAllowances, fetchBalances, fetchRebalanceBalances, fetchRebalanceRewards } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import PriceUpdate from './components/PriceUpdate'
import SettingButton from './components/SettingButton'
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import VerticalAssetRatio from './components/VerticalAssetRatio'

interface InvestType {
  rebalance: Rebalance | any
}

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const CardInput = ({
  isSimulating,
  balances,
  allowances,
  onNext,
  rebalance,
  setCurrentInput,
  currentInput,
  totalUSDAmount,
}) => {
  const [isApproving, setIsApproving] = useState(false)
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const dispatch = useDispatch()
  const { account, ethereum } = useWallet()

  const onApprove = (token) => async () => {
    const tokenContract = getContract(ethereum as provider, getAddress(token.address).toLowerCase())
    setIsApproving(true)
    try {
      await approveOther(tokenContract, getAddress(rebalance.address).toLowerCase(), account)

      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address).toLowerCase())
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address).toLowerCase()))
      setIsApproving(false)
    } catch {
      setIsApproving(false)
    }
  }

  const findAddress = (token) => {
    if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') return 'main'
    return getAddress(token.address).toLowerCase()
  }
  function toFixedCustom(num) {
    return num.toString().match(/^-?\d+(?:\.\d{0,7})?/)[0]
  }
  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4 pt-2' : 'pa-6 pt-4'}>
        <div className="flex justify-space-between align-center mb-2">
          <SettingButton />
        </div>

        <Box>
          {rebalance.ratio.map((c) => (
            <CurrencyInputV2
              currency={c}
              balance={_.get(balances, findAddress(c))}
              id={`invest-${c.symbol}`}
              key={`invest-${c.symbol}`}
              showMaxButton={
                String((_.get(balances, findAddress(c)) || new BigNumber(0)).toNumber()) !==
                currentInput[getAddress(c.address).toLowerCase()]
              }
              value={currentInput[getAddress(c.address).toLowerCase()]}
              label=""
              onMax={() => {
                const max = String((_.get(balances, findAddress(c)) || new BigNumber(0)).toNumber())

                const testMax = toFixedCustom(max)
                // eslint-disable-next-line
                // debugger
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address).toLowerCase()]: testMax,
                })
              }}
              onQuarter={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address).toLowerCase()]: String(
                    (_.get(balances, findAddress(c)) || new BigNumber(0)).times(0.25).toNumber(),
                  ),
                })
              }}
              onHalf={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address).toLowerCase()]: String(
                    (_.get(balances, findAddress(c)) || new BigNumber(0)).times(0.5).toNumber(),
                  ),
                })
              }}
              onUserInput={(value) => {
                setCurrentInput({ ...currentInput, [getAddress(c.address).toLowerCase()]: value })
              }}
            />
          ))}
        </Box>

        <Box my={4}>
          <TwoLineFormatV2 extraLarge title="Total Amount" value="" />
        </Box>

        <Divider />

        <Box my={4}>
          <TwoLineFormatV2 extraLarge title="Total Value" value={`$${numeral(totalUSDAmount).format('0,0.[0000]')}`} />
        </Box>

        {(() => {
          const totalInput = rebalance.ratio.map((c) => currentInput[getAddress(c.address).toLowerCase()]).join('')
          const needsApproval = rebalance.ratio.find((c) => {
            const currentValue = parseFloat(currentInput[getAddress(c.address).toLowerCase()])
            const currentAllowance = (
              _.get(allowances, getAddress(c.address).toLowerCase()) ||
              _.get(allowances, getAddress(c.address)) ||
              new BigNumber(0)
            ).toNumber()
            return currentAllowance < currentValue && c.symbol !== 'WKLAY' && c.symbol !== 'WBNB'
          })
          if (needsApproval) {
            return (
              <Button size="large" fullWidth disabled={isApproving} onClick={onApprove(needsApproval)}>
                Approve {needsApproval.symbol}
              </Button>
            )
          }
          return (
            <Button size="large" fullWidth disabled={isSimulating || totalInput.length === 0} onClick={onNext}>
              Calculate Invest amount
            </Button>
          )
        })()}
      </div>
    </Card>
  )
}

const CardCalculate = ({
  setTx,
  currentInput,
  isInvesting,
  setIsInvesting,
  isSimulating,
  recalculate,
  poolUSDBalances,
  poolAmounts,
  onBack,
  onNext,
  rebalance,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const slippage = useSlippage()
  const { account, ethereum }: { account: string; ethereum: provider } = useWallet()
  const dispatch = useDispatch()

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
      const tx = await rebalanceContract.methods
        // .addFund(arrayTokenAmount, usdTokenAmount, minUsdAmount)
        .addFund(arrayTokenAmount, 0)
        .send({ from: account, gas: 2000000, ...(containMainCoin ? { value: mainCoinValue } : {}) })
      setTx(tx)

      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address).toLowerCase())
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address).toLowerCase()))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      dispatch(fetchRebalanceRewards(account, [rebalance]))
      dispatch(fetchRebalances())
      onNext()
      setIsInvesting(false)
    } catch {
      setIsInvesting(false)
    }
  }

  return (
    <Card className="mb-4">
      <div className={`bd-b ${isMobile ? 'pa-4 pt-2' : 'px-6 py-4'} `}>
        <CardHeading rebalance={rebalance} />
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        <Text fontSize="24px" bold lineHeight="1.3" className="mb-3">
          Invest
        </Text>

        <div className="flex align-center flex-wrap mb-3">
          <VerticalAssetRatio
            rebalance={rebalance}
            poolAmounts={poolAmounts}
            className={isMobile ? 'col-12' : 'col-5'}
          />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share
              share={
                currentShare <= 0 || Number.isNaN(currentShare)
                  ? numeral(totalUserUsdAmount).format('0,0.[00]')
                  : numeral(currentShare).format('0,0.[00]')
              }
              usd={`~${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
            {false && <PriceUpdate className="mt-3" onClick={recalculate} />}
          </div>
        </div>

        <Text fontSize="12px" textAlign={isMobile ? 'center' : 'left'}>
          Output is estimated. You will receive at least{' '}
          <strong>
            {numeral(totalUserUsdAmount - totalUserUsdAmount / (100 / (slippage / 100))).format('0,0.[00]')} USD
          </strong>{' '}
          or the transaction will revert.
        </Text>
      </div>

      <div className={isMobile ? 'pa-4' : 'pa-6 pt-4'}>
        <SpaceBetweenFormat
          className="mb-2"
          title="Minimum Received"
          value={`${numeral(currentShare).format('0,0.[00]')} SHARE`}
        />
        <SpaceBetweenFormat
          className="mb-2"
          title="Price Impact"
          value={`${priceImpactDisplay <= 0.1 ? '< 0.1' : priceImpactDisplay}%`}
          valueColor="success" /* || failure */
        />
        {/* <SpaceBetweenFormat className="mb-2" title="Liquidity Provider Fee" value="0.003996 SIX" /> */}

        <Button fullWidth className="mt-2" disabled={isInvesting || isSimulating} onClick={onInvest}>
          Invest
        </Button>
      </div>
    </Card>
  )
}

const CardResponse = ({ tx, rebalance, poolUSDBalances }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
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
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4' : 'pa-6'}>
        <div className="flex flex-column align-center justify-center mb-6">
          <Lottie options={SuccessOptions} height={120} width={120} />
          {/* <ErrorIcon width="80px" color="failure" className="mb-3" /> */}
          <Text fontSize="24px" bold textAlign="center">
            Invest Complete
          </Text>
          <Text color="textSubtle" textAlign="center" className="mt-1" fontSize="12px">
            {moment(new Date()).format('DD MMM YYYY, HH:mm')}
          </Text>

          <CardHeading className="mt-6" rebalance={rebalance} />
        </div>

        <div className="flex align-center flex-wrap mb-6">
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share
              share={
                currentShare <= 0 || Number.isNaN(currentShare)
                  ? numeral(totalUserUsdAmount).format('0,0.[00]')
                  : numeral(currentShare).format('0,0.[00]')
              }
              usd={`~${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
          </div>
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

        <Button component={Link} to="/rebalancing/detail" fullWidth className="mt-3">
          Back to Rebalancing
        </Button>
      </div>
    </Card>
  )
}

const usePrevious = (value, initialValue) => {
  const ref = useRef(initialValue)
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const Invest: React.FC<InvestType> = ({ rebalance }) => {
  const [tx, setTx] = useState({})
  const [poolUSDBalances, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [isInputting, setIsInputting] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isInvested, setIsInvested] = useState(false)
  const [isInvesting, setIsInvesting] = useState(false)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(_.get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})
  const theme = useTheme()
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))
  const finixPrice = usePriceFinixUsd()

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address).toLowerCase())
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address).toLowerCase()]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address).toLowerCase()))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setIsInputting(true)
      setIsCalculating(false)
      setIsInvested(false)
      setTx({})
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (
      !_.isEqual(rebalance, prevRebalance) ||
      !_.isEqual(balances, prevBalances) ||
      !_.isEqual(currentInput, prevCurrentInput)
    ) {
      setIsSimulating(true)
      const [poolUSDBalancesData, poolAmountsData] = await simulateInvest(
        _.compact([...((rebalance || {}).tokens || [])]).map((c, index) => {
          const ratioPoint = (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((currentInput[c.address.toLowerCase()] || '0') as string).times(
              new BigNumber(10).pow(decimal),
            ),
            balance:
              _.get(balances, c.address.toLowerCase(), new BigNumber(0)).times(new BigNumber(10).pow(decimal)) ||
              _.get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
            router: rebalance.router[index],
            factory: rebalance.factory[index],
            initCodeHash: rebalance.initCodeHash[index],
          }
        }),
      )
      setPoolUSDBalances(poolUSDBalancesData)
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
    }
  }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  if (!rebalance) return <Redirect to="/rebalancing" />

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  const totalUSDAmount = new BigNumber(_.get(poolUSDBalances, 1, '0'))
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  return (
    <SmallestLayout>
      <BackV2 to="/rebalancing/detail" />
      <PageTitle title="Invest" caption="Invest in auto rebalancing products." sx={{ mb: '20px' }} />

      <Card className="mb-3">
        <CardHeading rebalance={rebalance} hideDescription large />
        <Box display="flex" flexWrap="wrap" pb={{ xs: '20px', lg: 4 }} pt={{ xs: '20px', lg: 3 }}>
          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? 'bd-r' : 'col-6 mb-3'}>
            <TwoLineFormatV2
              large
              title="Yield APR"
              value={numeral(
                finixPrice
                  .times(_.get(rebalance, 'finixRewardPerYearFromApollo', new BigNumber(0)))
                  .div(_.get(rebalance, 'totalAssetValue', new BigNumber(0)))
                  .times(100)
                  .toFixed(2),
              ).format('0,0.[00]')}
              tooltip="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />
          </Box>
          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? 'bd-r' : 'col-6'}>
            <TwoLineFormatV2
              large
              title="Share Price (Since inception)"
              value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
              percent={`${
                rebalance.sharedPricePercentDiff >= 0
                  ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                  : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
              }%`}
              percentColor={(() => {
                if (rebalance.sharedPricePercentDiff < 0) return 'error.main'
                if (rebalance.sharedPricePercentDiff > 0) return 'success.main'
                return ''
              })()}
            />
          </Box>
          <Box px={{ xs: '20px', lg: 4 }} className={lgUp ? '' : 'col-6'}>
            <TwoLineFormatV2 large title="Risk-O-Meter" value="Medium" />
          </Box>
        </Box>
      </Card>

      {isInputting && (
        <CardInput
          rebalance={rebalance}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          balances={balances}
          allowances={allowances}
          onNext={() => {
            setIsInputting(false)
            setIsCalculating(true)
          }}
          totalUSDAmount={totalUSDAmount}
          isSimulating={isSimulating}
        />
      )}

      {isCalculating && (
        <CardCalculate
          setTx={setTx}
          currentInput={currentInput}
          isInvesting={isInvesting}
          setIsInvesting={setIsInvesting}
          isSimulating={isSimulating}
          recalculate={fetchData}
          poolUSDBalances={poolUSDBalances}
          poolAmounts={poolAmounts}
          rebalance={rebalance}
          onBack={() => {
            setIsCalculating(false)
            setIsInputting(true)
          }}
          onNext={() => {
            setIsCalculating(false)
            setIsInvested(true)
          }}
        />
      )}
      {isInvested && <CardResponse poolUSDBalances={poolUSDBalances} tx={tx} rebalance={rebalance} />}
    </SmallestLayout>
  )
}

export default Invest
