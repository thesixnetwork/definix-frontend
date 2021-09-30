/* eslint-disable no-nested-ternary */
import Checkbox from '@material-ui/core/Checkbox'
import _ from 'lodash'
import moment from 'moment'
import BigNumber from 'bignumber.js'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import Radio from '@material-ui/core/Radio'
import { getAbiRebalanceByName } from 'hooks/hookHelper'
import * as klipProvider from 'hooks/klipProvider'
import { getAddress } from 'utils/addressHelpers'
import { useDispatch } from 'react-redux'
import { AbiItem } from 'web3-utils'
import { provider } from 'web3-core'
import rebalanceAbi from 'config/abi/rebalance.json'
import { getCustomContract } from 'utils/erc20'
import numeral from 'numeral'
import { useWallet, KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import useTheme from 'hooks/useTheme'
import RadioGroup from '@material-ui/core/RadioGroup'
import React, { useCallback, useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import Lottie from 'react-lottie'
import { Link, Redirect } from 'react-router-dom'
import styled from 'styled-components'
import { ArrowBackIcon, Button, Card, ChevronRightIcon, Link as UiLink, Text, useMatchBreakpoints } from 'uikit-dev'
import success from 'uikit-dev/animation/complete.json'
import { LeftPanel, TwoPanelLayout } from 'uikit-dev/components/TwoPanelLayout'
import { useRebalanceBalances, useBalances } from '../../state/hooks'
import { fetchBalances, fetchRebalanceBalances } from '../../state/wallet'
import { Rebalance } from '../../state/types'
import CardHeading from './components/CardHeading'
import CurrencyInputPanel from './components/CurrencyInputPanel'
import SettingButton from './components/SettingButton'
import Share from './components/Share'
import SpaceBetweenFormat from './components/SpaceBetweenFormat'
import TwoLineFormat from './components/TwoLineFormat'
import VerticalAssetRatio from './components/VerticalAssetRatio'
import { simulateWithdraw } from '../../offline-pool'

interface WithdrawType {
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

const Coin = styled.div`
  display: flex;
  align-items: center;
  margin: 4px 16px 4px 0;

  img {
    flex-shrink: 0;
    width: 24px;
    height: 24px;
    border-radius: ${({ theme }) => theme.radii.circle};
    margin-right: 6px;
  }
`

const FormControlLabelCustom = styled(FormControlLabel)`
  height: 40px;
  margin: 0 0 0 -10px !important;

  .MuiFormControlLabel-label {
    flex-grow: 1;
  }
`

const InlineAssetRatioLabel = ({ coin, className = '' }) => {
  const thisName = (() => {
    if (coin.symbol === 'WKLAY') return 'KLAY'
    if (coin.symbol === 'WBNB') return 'BNB'
    return coin.symbol
  })()
  return (
    <div className={`flex justify-space-between align-center ${className}`}>
      <Coin className="col-8">
        <img src={`/images/coins/${coin.symbol}.png`} alt="" />
        <Text className="col-3 mr-4" bold>
          {coin.amount ? numeral(coin.amount.toNumber()).format('0,0.[0000]') : '-'}
        </Text>
        <Text>{thisName}</Text>
      </Coin>

      <Text fontSize="12px" color="textSubtle" className="col-4" textAlign="right" style={{ letterSpacing: '0' }}>
        Ratio : {coin.valueRatioCal.toFixed(2)} %
      </Text>
    </div>
  )
}

const CardInput = ({
  setTx,
  isWithdrawing,
  setIsWithdrawing,
  rebalance,
  poolAmounts,
  isSimulating,
  currentInput,
  setCurrentInput,
  onNext,
  ratioType,
  setRatioType,
  currentBalance,
  currentBalanceNumber,
  selectedToken,
  setSelectedToken,
}) => {
  const { isXl } = useMatchBreakpoints()
  const isMobile = !isXl
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()
  const { isDark } = useTheme()

  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice

  const handleLocalStorage = async (tx) => {
    const rebalanceAddress: string = getAddress(_.get(rebalance, 'address'))
    const { transactionHash } = tx
    const myInvestTxns = JSON.parse(
      localStorage.getItem(`my_invest_tx_${account}`) ? localStorage.getItem(`my_invest_tx_${account}`) : '{}',
    )

    if (myInvestTxns[rebalanceAddress]) {
      myInvestTxns[rebalanceAddress].push(transactionHash)
    } else {
      myInvestTxns[rebalanceAddress] = [transactionHash]
    }

    localStorage.setItem(`my_invest_tx_${account}`, JSON.stringify(myInvestTxns))
  }

  const onWithdraw = async () => {
    const rebalanceContract = getCustomContract(
      klaytn as provider,
      rebalanceAbi as unknown as AbiItem,
      getAddress(rebalance.address),
    )
    setIsWithdrawing(true)
    try {
      const thisInput = currentBalance.isLessThan(new BigNumber(currentInput))
        ? currentBalance
        : new BigNumber(currentInput)
      const usdToken = _.get(rebalance, 'usdToken.0', {})
      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('removeFund')),
          JSON.stringify([
            thisInput.times(new BigNumber(10).pow(18)).toJSON(),
            ratioType === 'all',
            ((rebalance || {}).tokens || []).map((token, index) => {
              const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
              return selectedToken[tokenAddress]
                ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
                : 0
            }),
            selectedToken[typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)]
              ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
              : 0,
          ]),
          setShowModal,
        )
        const tx = await klipProvider.checkResponse()
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          .removeFund(
            thisInput.times(new BigNumber(10).pow(18)).toJSON(),
            ratioType === 'all',
            ((rebalance || {}).tokens || []).map((token, index) => {
              const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
              return selectedToken[tokenAddress]
                ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
                : 0
            }),
            selectedToken[typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)]
              ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
              : 0,
          )
          .send({ from: account, gas: 5000000 })
        setTx(tx)
        handleLocalStorage(tx)
      }
      const assets = rebalance.ratio
      const assetAddresses = assets.map((a) => getAddress(a.address))
      dispatch(fetchBalances(account, assetAddresses))
      dispatch(fetchRebalanceBalances(account, [rebalance]))
      onNext()
      setIsWithdrawing(false)
    } catch {
      setIsWithdrawing(false)
    }
  }

  return (
    <Card className="mb-4">
      <div className={`bd-b ${isMobile ? 'pa-4 pt-2' : 'px-4 py-4'} `}>
        <div className="flex justify-space-between mb-2">
          <Button
            variant="text"
            as={Link}
            to="/rebalancing/detail"
            ml="-12px"
            padding="0 12px"
            size="sm"
            startIcon={<ArrowBackIcon color="textSubtle" />}
          >
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
          <SettingButton />
        </div>
        <TwoLineFormat
          title="Current investment"
          titleColor={isDark ? '#ADB4C2' : ''}
          value={`${numeral(currentBalanceNumber).format('0,0.[00]')} Shares`}
          subTitle={`$${numeral(currentBalanceNumber * rebalance.sharedPrice).format('0,0.[00]')}`}
          large
          className="mb-4"
        />
        <div className="flex flex-wrap justify-space-between align-center">
          <Text>Withdraw</Text>

          <RadioGroup
            className="flex flex-row flex-wrap"
            name="tokenType"
            value={ratioType}
            onChange={(e) => {
              setRatioType(e.target.value)
            }}
          >
            <FormControlLabel
              value="all"
              control={<Radio color="primary" size="small" />}
              label={<Text>All token</Text>}
            />
            <FormControlLabel
              className="mr-0"
              value="multi"
              control={<Radio color="primary" size="small" />}
              label={<Text>Selected token</Text>}
            />
          </RadioGroup>
        </div>

        <CurrencyInputPanel
          currency={{ symbol: 'Shares', hide: true }}
          id="withdraw-fund"
          showMaxButton
          hideBalance
          value={currentInput}
          label=""
          onUserInput={setCurrentInput}
          onMax={() => {
            setCurrentInput(new BigNumber(currentBalance).toJSON())
          }}
          onQuarter={() => {
            setCurrentInput(new BigNumber(currentBalance).times(0.25).toJSON())
          }}
          onHalf={() => {
            setCurrentInput(new BigNumber(currentBalance).times(0.5).toJSON())
          }}
        />
        <Text fontSize="12px" color="textSubtle" className="mt-1" textAlign="right">
          ~ ${numeral(usdToBeRecieve).format('0,0.[00]')}
        </Text>
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        {ratioType === 'all' ? (
          _.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])
            .map((token, index) => {
              const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
              const ratios = _.get(rebalance, `ratioCal`)
              // eslint-disable-next-line
              const ratioMerge = Object.assign({ valueRatioCal: ratios ? ratios[index] : 0 }, ratioObject)
              return {
                ...token,
                ...ratioMerge,
                amount: ((poolAmounts || [])[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
              }
            })
            .filter((rt) => rt.value)
            .map((c) => <InlineAssetRatioLabel coin={c} className="py-1" />)
        ) : (
          <FormGroup>
            {_.compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])])
              .map((token, index) => {
                const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)

                let countSelect = 0

                const keys = Object.keys(selectedToken)
                for (let i = 0; i < keys.length; i++) {
                  if (selectedToken[keys[i]] === true) ++countSelect
                }

                let valueCalRatio = 0
                for (let i = 0; i < keys.length; i++) {
                  if (selectedToken[keys[i]] === true && keys[i] === getAddress(ratioObject.address))
                    valueCalRatio = 100 / countSelect
                }
                // eslint-disable-next-line
                const ratioMerge = Object.assign({ valueRatioCal: valueCalRatio }, ratioObject)

                return {
                  ...token,
                  ...ratioMerge,
                  amount: (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
                }
              })
              .filter((rt) => rt.value)
              .map((c) => (
                <FormControlLabelCustom
                  control={
                    <Checkbox
                      size="small"
                      color="primary"
                      checked={!!selectedToken[getAddress(c.address)]}
                      onChange={(event) => {
                        setSelectedToken({ ...selectedToken, [getAddress(c.address)]: event.target.checked })
                      }}
                    />
                  }
                  label={<InlineAssetRatioLabel coin={c} />}
                />
              ))}
          </FormGroup>
        )}
      </div>

      <div className={`bd-b ${isMobile ? 'pa-4' : 'px-6 py-4'} `}>
        {/* <SpaceBetweenFormat
          className="mb-2"
          title="Price Impact"
          value="< 0.1%"
          valueColor="success"
        /> */}
        <SpaceBetweenFormat
          className="mb-2"
          title={`Management fee ${_.get(rebalance, 'fee.management', 0.2)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / _.get(rebalance, 'fee.management', 0.2))).format('0,0.[0000]')}`}
          hint="Fee collected for vault management."
        />
        <SpaceBetweenFormat
          className="mb-2"
          title={`FINIX buy back fee ${_.get(rebalance, 'fee.buyback', 1.5)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / _.get(rebalance, 'fee.buyback', 1.5))).format('0,0.[0000]')}`}
          hint="Fee collected for buyback and burn of FINIX as deflationary purpose."
        />
        <SpaceBetweenFormat
          title={`Ecosystem fee ${_.get(rebalance, 'fee.bounty', 0.3)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / _.get(rebalance, 'fee.bounty', 0.3))).format('0,0.[0000]')}`}
          hint="Reservation fee for further development of the ecosystem."
        />
      </div>

      <div className={isMobile ? 'pa-4' : 'pa-6 pt-4'}>
        {/* <SpaceBetweenFormat
          className="mb-2"
          titleElm={
            <div className="flex pr-3">
              <Text fontSize="12px" color="textSubtle">
                Early withdrawal fee
              </Text>
              <Helper text="" className="mx-2" position="top" />
              <Text fontSize="12px" color="textSubtle">
                00:00
              </Text>
            </div>
          }
          title="Early withdrawal fee 0.5%"
          value="$00 "
          hint="xx"
        /> */}
        <Button fullWidth radii="small" disabled={isWithdrawing || isSimulating} onClick={onWithdraw} className="mt-2">
          Withdraw
        </Button>
      </div>
    </Card>
  )
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
                  usdToBeRecieve / (100 / _.get(rebalance, 'fee.bounty', 0.3)) -
                  usdToBeRecieve / (100 / _.get(rebalance, 'fee.buyback', 1.5)) -
                  usdToBeRecieve / (100 / _.get(rebalance, 'fee.management', 0.2)),
              ).format('0,0.[0000]')}`}
              textAlign={isMobile ? 'center' : 'left'}
            />
          </div>
          <VerticalAssetRatio className={isMobile ? 'col-12' : 'col-5'} />
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
            value: new BigNumber(currentInput as string).times(new BigNumber(10).pow(decimal)),
            isSelected: !!selectedToken[getAddress(ratioObject.address)],
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
    <>
      <Helmet>
        <title>Explore - Definix - Advance Your Crypto Assets</title>
      </Helmet>
      <TwoPanelLayout>
        <LeftPanelAbsolute isShowRightPanel={false}>
          <MaxWidth>
            {isInputting && (
              <CardInput
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
            )}{' '}
            {isWithdrawn && <CardResponse currentInput={currentInput} tx={tx} rebalance={rebalance} />}
          </MaxWidth>
        </LeftPanelAbsolute>
      </TwoPanelLayout>
    </>
  )
}

export default Withdraw
