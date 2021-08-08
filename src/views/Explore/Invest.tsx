/* eslint-disable no-nested-ternary */
import numeral from 'numeral'
import BigNumber from 'bignumber.js'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Lottie from 'react-lottie'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { useWallet } from '@sixnetwork/klaytn-use-wallet'
import { provider } from 'web3-core'
import {
  ArrowBackIcon,
  Button,
  Card,
  ChevronRightIcon,
  Link as UiLink,
  Text,
  useMatchBreakpoints,
  useModal,
} from 'uikit-dev'
import _ from 'lodash'
import { getAddress } from 'utils/addressHelpers'
import { approveOther } from 'utils/callHelpers'
import { getContract } from 'utils/erc20'
import success from 'uikit-dev/animation/complete.json'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { useDispatch } from 'react-redux'
import { Rebalance } from '../../state/types'
import { useBalances, useAllowances } from '../../state/hooks'
import { fetchAllowances, fetchBalances } from '../../state/wallet'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import ErrorOverLimitModal from './components/ErrorOverLimitModal'
import PriceUpdate from './components/PriceUpdate'
import SettingButton from './components/SettingButton'
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import TwoLineFormat from './components/TwoLineFormat'
import VerticalAssetRatio from './components/VerticalAssetRatio'
import { simulateInvest } from '../../offline-pool'

interface InvestType {
  rebalance: Rebalance | any
}

const SuccessOptions = {
  loop: true,
  autoplay: true,
  animationData: success,
}

const MaxWidth = styled.div`
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
`

const LeftPanelAbsolute = styled(LeftPanel)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  padding-bottom: 24px;
`

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
  const { account, klaytn } = useWallet()

  const onApprove = (token) => async () => {
    const tokenContract = getContract(klaytn as provider, getAddress(token.address))
    setIsApproving(true)
    try {
      await approveOther(tokenContract, getAddress(rebalance.address), account)
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchAllowances(account, assetAddresses, getAddress(rebalance.address)))
      setIsApproving(false)
    } catch {
      setIsApproving(false)
    }
  }

  return (
    <Card className="mb-4">
      <div className={isMobile ? 'pa-4 pt-2' : 'pa-6 pt-4'}>
        <div className="flex justify-space-between mb-2">
          <Button
            variant="text"
            as={Link}
            to="/explore/detail"
            ml="-12px"
            padding="0 12px"
            startIcon={<ArrowBackIcon />}
          >
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
          <SettingButton />
        </div>

        <TwoLineFormat
          title="Share price"
          value={`$${numeral(rebalance.sharedPrice).format('0,0.00')}`}
          percent="+0.2%"
          large
          className="mb-4"
        />

        <div className="flex">
          <Text className="mb-2">Invest</Text>
        </div>

        <div className="mb-4">
          {rebalance.ratio.map((c) => (
            <CurrencyInputPanel
              currency={c}
              balance={_.get(balances, getAddress(c.address))}
              id={`invest-${c.symbol}`}
              key={`invest-${c.symbol}`}
              showMaxButton={
                String((_.get(balances, getAddress(c.address)) || new BigNumber(0)).toNumber()) !==
                currentInput[getAddress(c.address)]
              }
              className="mb-2"
              value={currentInput[getAddress(c.address)]}
              label=""
              onMax={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address)]: String(
                    (_.get(balances, getAddress(c.address)) || new BigNumber(0)).toNumber(),
                  ),
                })
              }}
              onQuarter={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address)]: String(
                    (_.get(balances, getAddress(c.address)) || new BigNumber(0)).times(0.75).toNumber(),
                  ),
                })
              }}
              onHalf={() => {
                setCurrentInput({
                  ...currentInput,
                  [getAddress(c.address)]: String(
                    (_.get(balances, getAddress(c.address)) || new BigNumber(0)).times(0.5).toNumber(),
                  ),
                })
              }}
              onUserInput={(value) => {
                setCurrentInput({ ...currentInput, [getAddress(c.address)]: value })
              }}
            />
          ))}
        </div>

        <SpaceBetweenFormat
          className="mb-4"
          title="Total value"
          value={`$${numeral(totalUSDAmount).format('0,0.[0000]')}`}
        />

        {(() => {
          const totalInput = rebalance.ratio.map((c) => currentInput[getAddress(c.address)]).join('')
          const needsApproval = rebalance.ratio.find((c) => {
            const currentValue = parseFloat(currentInput[getAddress(c.address)])
            const currentAllowance = (_.get(allowances, getAddress(c.address)) || new BigNumber(0)).toNumber()
            return currentAllowance < currentValue
          })
          if (needsApproval) {
            return (
              <Button fullWidth radii="small" disabled={isApproving} onClick={onApprove(needsApproval)}>
                Approve {needsApproval.symbol}
              </Button>
            )
          }
          return (
            <Button fullWidth radii="small" disabled={isSimulating || totalInput.length === 0} onClick={onNext}>
              Calculate invest amount
            </Button>
          )
        })()}
      </div>
    </Card>
  )
}

const CardCalculate = ({ isSimulating, recalculate, poolUSDBalances, poolAmounts, onBack, onNext, rebalance }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

  // @ts-ignore
  const totalUsdPool = new BigNumber([rebalance.sumCurrentPoolUsdBalance]).div(new BigNumber(10).pow(18)).toNumber()
  const totalUserUsdAmount = new BigNumber(_.get(poolUSDBalances, 1, '0')).div(new BigNumber(10).pow(18)).toNumber()
  // @ts-ignore
  const totalSupply = new BigNumber([rebalance.totalSupply[0]]).div(new BigNumber(10).pow(18)).toNumber()
  const currentShare = (totalUserUsdAmount / totalUsdPool) * totalSupply

  return (
    <Card className="mb-4">
      <div className={`bd-b ${isMobile ? 'pa-4 pt-2' : 'px-6 py-4'} `}>
        <Button variant="text" ml="-12px" mb="8px" padding="0 12px" startIcon={<ArrowBackIcon />} onClick={onBack}>
          <Text fontSize="14px" color="textSubtle">
            Back
          </Text>
        </Button>

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
              share={numeral(currentShare).format('0,0.[00]')}
              usd={`~${numeral(totalUserUsdAmount).format('0,0.[00]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
            <PriceUpdate className="mt-3" onClick={recalculate} />
          </div>
        </div>

        <Text fontSize="12px" textAlign={isMobile ? 'center' : 'left'}>
          Output is estimated. You will receive at least{' '}
          <strong>{numeral(totalUserUsdAmount).format('0,0.[00]')} USD</strong> or the transaction will revert.
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
          value="< 0.1%"
          valueColor="success" /* || failure */
        />
        <SpaceBetweenFormat className="mb-2" title="Liquidity Provider Fee" value="0.003996 SIX" />

        <Button fullWidth radii="small" className="mt-2" disabled={isSimulating} onClick={onNext}>
          Invest
        </Button>
      </div>
    </Card>
  )
}

const CardResponse = ({ rebalance }) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl

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
            27 June 2021, 15:32
          </Text>

          <CardHeading className="mt-6" rebalance={rebalance} />
        </div>

        <div className="flex align-center flex-wrap mb-6">
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
          <div className={`flex flex-column ${isMobile ? 'col-12 pt-4 align-center' : 'col-7 pl-4 align-end'}`}>
            <Share share="100" usd="~192,803.00" textAlign={isMobile ? 'center' : 'left'} />
          </div>
        </div>

        <SpaceBetweenFormat
          titleElm={
            <div className="flex">
              <Text fontSize="12px" color="textSubtle" className="mr-2">
                Transaction Hash
              </Text>
              <Text fontSize="12px" color="primary" bold>
                0x91….24xd
              </Text>
            </div>
          }
          valueElm={
            <UiLink
              href="https://scope.klaytn.com/account/}"
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

        <Button as={Link} to="/explore/detail" fullWidth radii="small" className="mt-3">
          Back to Explore
        </Button>
      </div>
    </Card>
  )
}

const Invest: React.FC<InvestType> = ({ rebalance }) => {
  const [poolUSDBalances, setPoolUSDBalances] = useState([])
  const [poolAmounts, setPoolAmounts] = useState([])
  const [isSimulating, setIsSimulating] = useState(true)
  const [isInputting, setIsInputting] = useState(true)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isInvested, setIsInvested] = useState(false)
  const [onPresentErrorOverLimitModal] = useModal(<ErrorOverLimitModal />)
  const [currentInput, setCurrentInput] = useState<Record<string, unknown>>({})
  const dispatch = useDispatch()
  const { account } = useWallet()
  const balances = useBalances(account)
  const allowances = useAllowances(account, getAddress(_.get(rebalance, 'address', {})))

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
      setIsCalculating(false)
      setIsInvested(false)
    }
  }, [])

  const fetchData = useCallback(async () => {
    setIsSimulating(true)
    const [poolUSDBalancesData, poolAmountsData] = await simulateInvest(
      _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]).map((c, index) => {
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
          balance: _.get(balances, c.address, new BigNumber(0)).times(new BigNumber(10).pow(decimal)),
        }
      }),
    )
    setPoolUSDBalances(poolUSDBalancesData)
    setPoolAmounts(poolAmountsData)
    setIsSimulating(false)
  }, [balances, currentInput, rebalance])

  useEffect(() => {
    fetchData()
  }, [balances, currentInput, rebalance, fetchData])

  if (!rebalance) return <Redirect to="/explore" />

  const totalUSDAmount = new BigNumber(_.get(poolUSDBalances, 1, '0')).div(new BigNumber(10).pow(18)).toNumber()
  return (
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>

      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            {isInputting && (
              <CardInput
                rebalance={rebalance}
                currentInput={currentInput}
                setCurrentInput={setCurrentInput}
                balances={balances}
                allowances={allowances}
                onNext={() => {
                  if (totalUSDAmount > 100) {
                    onPresentErrorOverLimitModal()
                  } else {
                    setIsInputting(false)
                    setIsCalculating(true)
                  }
                }}
                totalUSDAmount={totalUSDAmount}
                isSimulating={isSimulating}
              />
            )}{' '}
            {isCalculating && (
              <CardCalculate
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
            {isInvested && <CardResponse rebalance={rebalance} />}
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Invest
