/* eslint-disable no-nested-ternary */
import { compact, get } from 'lodash'
import BigNumber from 'bignumber.js'
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
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  ButtonGroup,
  Divider,
  Flex,
  Text,
  useMatchBreakpoints,
  CheckboxLabel,
  Checkbox,
} from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import { useDeepEqualMemo } from 'hooks/useDeepEqualMemo'
import { fetchBalances, fetchRebalanceBalances } from 'state/wallet'
import { simulateWithdraw } from 'offline-pool'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import InlineAssetRatioLabel from './InlineAssetRatioLabel'
import ShareInput from './ShareInput'

export enum RatioType {
  Original = 'Original',
  Equal = 'Equal',
  Single = 'Single',
}
const ratioTypes = Object.keys(RatioType)

interface WithdrawInputCardProp {
  setTx
  rebalance
  rebalanceBalances
  balances
  currentBalance
  onNext
}

const WithdrawInputCard: React.FC<WithdrawInputCardProp> = ({
  setTx,
  rebalance,
  rebalanceBalances,
  balances,
  currentBalance,
  onNext,
}) => {
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()

  const [isSimulating, setIsSimulating] = useState(false)
  const [poolAmounts, setPoolAmounts] = useState([])
  const [ratioType, setRatioType] = useState(RatioType.Original)
  const [selectedToken, setSelectedToken] = useState({})
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [currentInput, setCurrentInput] = useState('')

  const mRebalance = useDeepEqualMemo(rebalance)
  const usdToBeRecieve = parseFloat(currentInput) * mRebalance.sharedPrice
  const tokens = useMemo(() => compact([...(mRebalance?.tokens || []), ...(mRebalance?.usdToken || [])]), [mRebalance])
  const tokenLength = useDeepEqualMemo(tokens?.length)
  const selectedLength = useMemo(() => Object.values(selectedToken).filter((val) => val).length, [selectedToken])

  const tokenRatios = useMemo(() => {
    if (ratioType === RatioType.Original) {
      return mRebalance?.ratioCal
    }
    if (ratioType === RatioType.Single) {
      const selectedAddress = Object.entries(selectedToken)
        .map(([key, value]) => value && key)
        .filter((value) => value)
      const ratio = selectedLength > 0 ? 100 / selectedLength : 0
      return tokens.map((token) => {
        return selectedAddress.includes(getAddress(token?.address)) ? ratio : 0
      })
    }
    return Array(tokenLength).fill(100 / tokenLength)
  }, [tokens, selectedLength, tokenLength, ratioType, mRebalance, selectedToken])

  const tokenList = useMemo(() => {
    return tokens
      .map((token, index) => {
        const ratioObject = (mRebalance?.ratio || []).find((r) => r.symbol === token.symbol)
        return {
          ...token,
          ...ratioObject,
          valueRatioCal: tokenRatios ? tokenRatios[index] : 0,
          amount: (poolAmounts?.[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
        }
      })
      .filter((rt) => rt.value)
  }, [tokens, poolAmounts, mRebalance, tokenRatios])

  const fetchData = useCallback(async () => {
    if (rebalance && new BigNumber(currentInput).toNumber() > 0) {
      setIsSimulating(true)
      const thisRebalanceBalance = get(rebalance, 'enableAutoCompound', false) ? rebalanceBalances : balances
      const myBalance = get(thisRebalanceBalance, getAddress(rebalance.address), new BigNumber(0))
      const thisInput = myBalance.isLessThan(new BigNumber(currentInput)) ? myBalance : new BigNumber(currentInput)
      const [, poolAmountsData] = await simulateWithdraw(
        thisInput,
        tokens.map((c, index) => {
          const ratioPoint = (
            rebalance?.tokenRatioPoints?.[index] ||
            rebalance?.usdTokenRatioPoint?.[0] ||
            new BigNumber(0)
          ).toNumber()
          const ratioObject = (rebalance?.ratio || []).find((r) => r.symbol === c.symbol)
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
        [(rebalance?.totalSupply || [])[0]],
        ratioType === RatioType.Original,
      )
      setPoolAmounts(poolAmountsData)
      setIsSimulating(false)
    }
    if (new BigNumber(currentInput).toNumber() <= 0) {
      setPoolAmounts([])
    }
  }, [tokens, selectedToken, currentInput, rebalance, ratioType, balances, rebalanceBalances])

  const handleLocalStorage = async (tx) => {
    const rebalanceAddress: string = getAddress(get(rebalance, 'address'))
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
      const usdToken = get(rebalance, 'usdToken.0', {})

      const lpAmount = thisInput.times(new BigNumber(10).pow(18)).toJSON()
      const toAllAssets = ratioType === RatioType.Original
      const outputRatios = (rebalance?.tokens || []).map((token, index) => {
        const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
        return selectedToken[tokenAddress]
          ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          : 0
      })
      const outputUSDRatio = selectedToken[
        typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)
      ]
        ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
        : 0

      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('removeFund')),
          JSON.stringify([lpAmount, toAllAssets, outputRatios, outputUSDRatio]),
          setShowModal,
        )
        const tx = await klipProvider.checkResponse()
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          .removeFund(lpAmount, toAllAssets, outputRatios, outputUSDRatio)
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
    } catch (e) {
      setIsWithdrawing(false)
    }
  }

  const handleBalanceChange = useCallback(
    (precentage: number) => {
      setCurrentInput(new BigNumber(currentBalance).times(precentage / 100).toJSON())
    },
    [currentBalance, setCurrentInput],
  )

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setCurrentInput(e.currentTarget.value)
    },
    [setCurrentInput],
  )

  useEffect(() => {
    return () => {
      setRatioType(RatioType.Original)
    }
  }, [])

  useEffect(() => {
    if (ratioType === RatioType.Equal) {
      setSelectedToken(tokens.reduce((all, c) => ({ ...all, [c.address]: true }), {}))
    }
  }, [tokens, ratioType])
  useEffect(() => {
    if (ratioType === RatioType.Single) {
      setSelectedToken({})
    }
  }, [ratioType])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Card p={isMobile ? 'S_20' : 'S_40'}>
      <Box mb="S_40">
        <Text display="flex" color="textSubtle" textStyle="R_16M" mb="S_20">
          {t('Withdrawal Amount')}
        </Text>

        <ShareInput
          onSelectBalanceRateButton={handleBalanceChange}
          onChange={handleChange}
          value={currentInput}
          max={currentBalance}
          symbol={t('SHR')}
        />
      </Box>

      <Box color="textSubtle" textStyle="R_14R">
        <SpaceBetweenFormat
          className="mb-2"
          title={`Management fee ${get(rebalance, 'fee.management', 0.2)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.management', 0.2))).format('0,0.[0000]')}`}
          hint="Fee collected for vault management."
        />
        <SpaceBetweenFormat
          className="mb-2"
          title={`FINIX buy back fee ${get(rebalance, 'fee.buyback', 1.5)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.buyback', 1.5))).format('0,0.[0000]')}`}
          hint="Fee collected for buyback and burn of FINIX as deflationary purpose."
        />
        <SpaceBetweenFormat
          title={`Ecosystem fee ${get(rebalance, 'fee.bounty', 0.3)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.bounty', 0.3))).format('0,0.[0000]')}`}
          hint="Reservation fee for further development of the ecosystem."
        />
      </Box>

      <Divider my="S_32" />

      <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" mb="S_32">
        <Text textStyle="R_16M" color="mediumgrey">
          {t('Withdrawal ratio')}
        </Text>
        <ButtonGroup>
          {ratioTypes.map((label) => (
            <Button
              scale="sm"
              width="102px"
              height="32px"
              variant={label === ratioType ? 'primary' : 'text'}
              onClick={() => {
                setRatioType(label as RatioType)
              }}
            >
              {t(label)}
            </Button>
          ))}
        </ButtonGroup>
      </Flex>
      <Box mb="S_40">
        {ratioType === RatioType.Single
          ? tokenList.map((c) => (
              <CheckboxLabel
                width="100%"
                className="flex align-center"
                control={
                  <Checkbox
                    scale="sm"
                    color="primary"
                    checked={!!selectedToken[getAddress(c.address)]}
                    onChange={(event) => {
                      setSelectedToken({ [getAddress(c.address)]: event.target.checked })
                    }}
                  />
                }
              >
                <InlineAssetRatioLabel coin={c} />
              </CheckboxLabel>
            ))
          : tokenList.map((c) => <InlineAssetRatioLabel coin={c} />)}
      </Box>

      <Button
        scale="lg"
        width="100%"
        disabled={isWithdrawing || isSimulating || (ratioType === RatioType.Single && !selectedLength)}
        onClick={onWithdraw}
      >
        {t('Withdraw')}
      </Button>
    </Card>
  )
}

export default WithdrawInputCard
