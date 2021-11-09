/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import React, { useRef, useCallback, useEffect, useState, useMemo } from 'react'
import { Helmet } from 'react-helmet'
import Lottie from 'react-lottie'
import { useTranslation } from 'react-i18next'
import { Link, Redirect } from 'react-router-dom'
import { get, isEqual, compact } from 'lodash'
import { provider } from 'web3-core'

import { ArrowBackIcon, ChevronRightIcon } from 'uikit-dev'
import {
  Box,
  Button,
  Card,
  CardBody,
  CheckBIcon,
  Flex,
  Link as UiLink,
  Text,
  useMatchBreakpoints,
  useModal,
} from 'definixswap-uikit'

import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import * as klipProvider from 'hooks/klipProvider'
import { getAbiERC20ByName } from 'hooks/hookHelper'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import success from 'uikit-dev/animation/complete.json'
import { useDispatch } from 'react-redux'
import { Rebalance } from '../../state/types'
import { useBalances, useAllowances, usePriceFinixUsd } from '../../state/hooks'
import { fetchAllowances, fetchBalances } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import TwoLineFormat from './components/TwoLineFormat'
import VerticalAssetRatio from './components/VerticalAssetRatio'
import { simulateInvest, getReserves } from '../../offline-pool'
import CalculateModal from './components/CalculateModal'

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
  sumPoolAmount,
}) => {
  const { t } = useTranslation()
  const [isApproving, setIsApproving] = useState(false)
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const dispatch = useDispatch()
  const { account, klaytn, connector } = useWallet()
  const finixPrice = usePriceFinixUsd()
  const { setShowModal } = React.useContext(KlipModalContext())

  const onApprove = (token) => async () => {
    const tokenContract = getContract(klaytn as provider, getAddress(token.address))
    // eslint-disable-next-line
    // debugger;
    setIsApproving(true)
    try {
      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(token.address),
          JSON.stringify(getAbiERC20ByName('approve')),
          JSON.stringify([getAddress(rebalance.address), klipProvider.MAX_UINT_256_KLIP]),
          setShowModal,
        )
        await klipProvider.checkResponse()
        setShowModal(false)
      } else {
        await approveOther(tokenContract, getAddress(rebalance.address), account)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      setIsApproving(false)
    } catch {
      setIsApproving(false)
    }
  }

  const findAddress = (token) => {
    if (token.symbol === 'WKLAY' || token.symbol === 'WBNB') return 'main'
    return getAddress(token.address)
  }

  function toFixedCustom(num) {
    return num.toString().match(/^-?\d+(?:\.\d{0,7})?/)[0]
  }

  const coins = useMemo(
    () =>
      rebalance.ratio
        .filter((coin) => coin.value)
        .map((c) => {
          const balance = get(balances, findAddress(c))
          return {
            ...c,
            cMax: balance || new BigNumber(0),
            cAddress: getAddress(c.address),
            cBalance: balance,
          }
        }),
    [balances, rebalance],
  )

  const needsApprovalCoins = useMemo(
    () =>
      coins
        .map((c) => {
          const currentValue = parseFloat(currentInput[c.cAddress])
          const currentAllowance = (get(allowances, c.cAddress) || new BigNumber(0)).toNumber()
          const needsApproval = currentAllowance < currentValue && c.symbol !== 'WKLAY' && c.symbol !== 'WBNB'
          return {
            ...c,
            currentValue,
            needsApproval,
          }
        })
        .filter(({ currentValue }) => currentValue > 0),
    [currentInput, coins, allowances],
  )

  const allApproved = useMemo(
    () => needsApprovalCoins.every(({ needsApproval }) => !needsApproval),
    [needsApprovalCoins],
  )

  return (
    <>
      <Card className="mb-s16">
        <CardBody>
          <CardHeading
            rebalance={rebalance}
            isHorizontal={isMobile}
            className={`mb-s24 ${isMobile ? 'pb-s28' : 'pb-s24 bd-b'}`}
          />

          <Flex justifyContent="space-between" flexWrap="wrap">
            <TwoLineFormat
              className={isMobile ? 'col-6 mb-s20' : 'col-4'}
              title={t('Yield APR')}
              value={`${numeral(
                finixPrice
                  .times(get(rebalance, 'finixRewardPerYear', new BigNumber(0)))
                  .div(get(rebalance, 'totalAssetValue', new BigNumber(0)))
                  .times(100)
                  .toFixed(2),
              ).format('0,0.[00]')}%`}
              hint="A return of investment paid in FINIX calculated in annual percentage rate for the interest to be paid."
            />

            <TwoLineFormat
              className={isMobile ? 'col-6' : 'col-4 bd-l pl-s32'}
              title={t('Share Price(Since Inception)')}
              value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
              percent={`${
                rebalance.sharedPricePercentDiff >= 0
                  ? `+${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
                  : `${numeral(rebalance.sharedPricePercentDiff).format('0,0.[00]')}`
              }%`}
              percentClass={(() => {
                if (rebalance.sharedPricePercentDiff < 0) return 'failure'
                if (rebalance.sharedPricePercentDiff > 0) return 'success'
                return ''
              })()}
            />
            <TwoLineFormat
              className={isMobile ? 'col-6' : 'col-4 bd-l pl-s32'}
              title={t('Risk-0-Meter')}
              value="Medium"
            />
          </Flex>
        </CardBody>
      </Card>

      <Card className={isMobile ? 'pa-s20' : 'pa-s40'}>
        <Box mb="S_40">
          {coins.map((c) => (
            <CurrencyInputPanel
              currency={c}
              balance={c.cBalance}
              id={`invest-${c.symbol}`}
              key={`invest-${c.symbol}`}
              showMaxButton={String(c.cMax.toNumber()) !== currentInput[c.cAddress]}
              className="mb-s24"
              value={currentInput[c.cAddress]}
              onMax={() => {
                const max = String(c.cMax.toNumber())

                const testMax = toFixedCustom(max)
                setCurrentInput({
                  ...currentInput,
                  [c.cAddress]: testMax,
                })
              }}
              onQuarter={() => {
                setCurrentInput({
                  ...currentInput,
                  [c.cAddress]: String(c.cMax.times(0.25).toNumber()),
                })
              }}
              onHalf={() => {
                setCurrentInput({
                  ...currentInput,
                  [c.cAddress]: String(c.cMax.times(0.5).toNumber()),
                })
              }}
              onUserInput={(value) => {
                setCurrentInput({ ...currentInput, [c.cAddress]: value })
              }}
            />
          ))}
        </Box>

        {(() => {
          const needsApproval = rebalance.ratio.find((c) => {
            const currentValue = parseFloat(currentInput[getAddress(c.address)])
            const currentAllowance = (get(allowances, getAddress(c.address)) || new BigNumber(0)).toNumber()
            return currentAllowance < currentValue && c.symbol !== 'WKLAY' && c.symbol !== 'WBNB'
          })
          if (needsApproval) {
            return (
              <Button disabled={isApproving} onClick={onApprove(needsApproval)}>
                Approve {needsApproval.symbol}
              </Button>
            )
          }
          return null
        })()}

        <Box className="bd-b" pb="S_32" mb="S_32">
          <Text textStyle="R_16M" mb="S_12" color="textSubtle">
            {t('Total Amount')}
          </Text>
          {needsApprovalCoins.length ? (
            needsApprovalCoins.map((coin) => (
              <Flex textStyle="R_16M" mb="S_8" alignItems="center">
                <Flex alignItems="center" className="col-9">
                  <img width="32px" src={`/images/coins/${coin.symbol}.png`} alt="" />
                  <Text mr="S_8" ml="S_12">
                    {0.2264627858327316}
                  </Text>
                  <Text color="textSubtle">{coin.symbol}</Text>
                </Flex>
                <Button
                  ml="auto"
                  width="200px"
                  variant="brown"
                  disabled={isApproving || !coin.needsApproval || !coin.currentValue}
                  onClick={onApprove(coin)}
                >
                  {coin.needsApproval || <CheckBIcon opacity=".5" style={{ marginRight: '6px' }} />} Approve{' '}
                  {coin.symbol}
                </Button>
              </Flex>
            ))
          ) : (
            <Flex py="S_28" justifyContent="center">
              <Text textStyle="R_14R" color="textSubtle">
                {t('Please input the investment amount.')}
              </Text>
            </Flex>
          )}
        </Box>

        <Box mb="S_40">
          <Text textStyle="R_16M" mb="S_8" color="textSubtle">
            {t('Total Value')}
          </Text>
          <Text textStyle="R_23M">$ {numeral(sumPoolAmount).format('0,0.[0000]')}</Text>
        </Box>

        <Button
          scale="lg"
          width="100%"
          disabled={isSimulating || !allApproved || !needsApprovalCoins.length}
          onClick={onNext}
        >
          {t('Calculate invest amount')}
        </Button>
      </Card>
    </>
  )
}

const CardResponse = ({ tx, rebalance, poolUSDBalances }) => {
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const { transactionHash } = tx

  const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance])
    .div(new BigNumber(10).pow(usdToken.decimals || 18))
    .toNumber()
  const totalUserUsdAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
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
              href={`https://scope.klaytn.com/tx/${transactionHash}`}
              fontSize="12px"
              color="textSubtle"
              style={{ marginRight: '-4px' }}
            >
              KlaytnScope
              <ChevronRightIcon color="textSubtle" />
            </UiLink>
          }
          className="mb-2"
        />

        <Button as={Link} to="/rebalancing/detail" className="mt-3">
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
  const { t } = useTranslation()
  const [tx, setTx] = useState({})
  const [poolUSDBalancesState, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [sumPoolAmount, setSumPoolAmount] = useState(0)
  const [isSimulating, setIsSimulating] = useState(true)
  const [isInputting, setIsInputting] = useState(true)
  const [isInvested, setIsInvested] = useState(false)
  const [isInvesting, setIsInvesting] = useState(false)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(get(rebalance, 'address', {})))
  const prevRebalance = usePrevious(rebalance, {})
  const prevBalances = usePrevious(balances, {})
  const prevCurrentInput = usePrevious(currentInput, {})
  const [calNewImpact, setCalNewImpact] = useState(0)

  useEffect(() => {
    if (account && rebalance) {
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, [...assetAddresses, getAddress(rebalance.address)]))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
    }
  }, [dispatch, account, rebalance])

  useEffect(() => {
    return () => {
      setIsInputting(true)
      setIsInvested(false)
      setTx({})
    }
  }, [])

  const fetchData = useCallback(async () => {
    if (
      !isEqual(rebalance, prevRebalance) ||
      !isEqual(balances, prevBalances) ||
      !isEqual(currentInput, prevCurrentInput)
    ) {
      setIsSimulating(true)
      // eslint-disable-next-line
      const [__, poolAmountsData] = await simulateInvest(
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )

      const poolUSDBalancesDataProcess = getReserves(
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )

      const reservePoolAmountProcess = getReserves(
        compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
          const ratioPoint = (
            ((rebalance || {}).tokenRatioPoints || [])[index] ||
            ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
          const decimal = c.decimals
          return {
            ...c,
            symbol: c.symbol,
            address: ratioObject.address,
            ratioPoint,
            value: new BigNumber((poolAmountsData[index] || '0') as string).times(new BigNumber(10).pow(decimal)),
            balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
          }
        }),
      )
      let sumUsd = new BigNumber(0)

      const [poolUSDBalancesData, reservePoolAmount] = await Promise.all([
        poolUSDBalancesDataProcess,
        reservePoolAmountProcess,
      ])
      // Promise.all([poolUSDBalancesDataProcess, reservePoolAmountProcess]).then(data => {
      // const [poolUSDBalancesData,reservePoolAmount]  = data
      // @ts-ignore
      for (let i = 0; i < reservePoolAmount[0]?.length || 0; i++) {
        const decimal = rebalance.tokens[i]?.decimals ? rebalance.tokens[i].decimals : 6
        sumUsd = sumUsd.plus(reservePoolAmount[0][i].dividedBy(10 ** (decimal + 6)))
      }
      const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
      // @ts-ignore
      const totalUserUsdAmount = new BigNumber(get(poolUSDBalancesData, 1, '0'))
        .div(new BigNumber(10).pow(usdToken.decimals || 18))
        .toNumber()
      const calNewImpactPrice = Math.abs(((totalUserUsdAmount - +sumUsd.toFixed()) / +sumUsd.toFixed()) * 100)

      setCalNewImpact(calNewImpactPrice)
      setPoolUSDBalances(poolUSDBalancesData)
      setSumPoolAmount(+sumUsd.toFixed())
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
      // })
    }
  }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput])

  // const calReserve = useCallback(async () => {
  //   if (
  //     !isEqual(rebalance, prevRebalance) ||
  //     !isEqual(balances, prevBalances) ||
  //     !isEqual(currentInput, prevCurrentInput)
  //   ) {
  //     setIsSimulating(false)

  //     const poolUSDBalancesData = await getReserves(
  //       compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
  //         const ratioPoint = (
  //           ((rebalance || {}).tokenRatioPoints || [])[index] ||
  //           ((rebalance || {}).usdTokenRatioPoint || [])[0] ||
  //           new BigNumber(0)
  //         ).toNumber()
  //         const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === c.symbol)
  //         const decimal = c.decimals
  //         return {
  //           ...c,
  //           symbol: c.symbol,
  //           address: ratioObject.address,
  //           ratioPoint,
  //           value: new BigNumber((currentInput[c.address] || '0') as string).times(new BigNumber(10).pow(decimal)),
  //           balance: get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
  //         }
  //       }),
  //     )
  //     const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  //     const totalUserUsdAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
  //       .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //       .toNumber()
  //     console.log("diff", totalUserUsdAmount, sumPoolAmount)
  //     const calNewImpactPrice = Math.abs(((totalUserUsdAmount - sumPoolAmount) / sumPoolAmount) * 100)
  //     setCalNewImpact(calNewImpactPrice)
  //     setPoolUSDBalances(poolUSDBalancesData)
  //     setIsSimulating(true)
  //   }
  // }, [balances, currentInput, rebalance, prevRebalance, prevBalances, prevCurrentInput, poolUSDBalances, sumPoolAmount])

  // const usdToken = ((rebalance || {}).usdToken || [])[0] || {}
  // const totalUSDAmount = new BigNumber(get(poolUSDBalances, 1, '0'))
  //   .div(new BigNumber(10).pow(usdToken.decimals || 18))
  //   .toNumber()

  const [onPresentCalcModal] = useModal(
    <CalculateModal
      setTx={setTx}
      currentInput={currentInput}
      isInvesting={isInvesting}
      setIsInvesting={setIsInvesting}
      isSimulating={isSimulating}
      recalculate={fetchData}
      poolUSDBalances={poolUSDBalancesState}
      poolAmounts={poolAmounts}
      rebalance={rebalance}
      sumPoolAmount={sumPoolAmount}
      onNext={() => {
        fetchData()
        setIsInvested(true)
      }}
      calNewImpact={calNewImpact}
    />,
    false,
  )

  useEffect(() => {
    fetchData()
    // calReserve()
  }, [fetchData])

  if (!rebalance) return <Redirect to="/rebalancing" />

  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <Flex className="mb-s20">
        <Button
          variant="text"
          as={Link}
          to="/rebalancing/detail"
          height="24px"
          p="0"
          startIcon={<ArrowBackIcon color="textSubtle" />}
        >
          <Text textStyle="R_16R" color="textSubtle">
            {t('Back')}
          </Text>
        </Button>
      </Flex>
      <Text as="h2" textStyle="R_32B" className="mb-s40">
        {t('Invest')}
      </Text>

      <div>
        {isInputting && (
          <CardInput
            rebalance={rebalance}
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            balances={balances}
            allowances={allowances}
            onNext={() => {
              // setIsInputting(false)
              onPresentCalcModal()
            }}
            // totalUSDAmount={totalUSDAmount}
            isSimulating={isSimulating}
            sumPoolAmount={sumPoolAmount}
          />
        )}{' '}
        {isInvested && <CardResponse poolUSDBalances={poolUSDBalancesState} tx={tx} rebalance={rebalance} />}
      </div>
    </>
  )
}

export default Invest
