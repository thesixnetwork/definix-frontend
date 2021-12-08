/* eslint-disable no-nested-ternary */
import { compact, get } from 'lodash'
import BigNumber from 'bignumber.js'
import { getAddress } from 'utils/addressHelpers'
import numeral from 'numeral'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Card,
  ButtonGroup,
  Divider,
  Flex,
  Text,
  CheckboxLabel,
  Checkbox,
  useModal,
} from 'definixswap-uikit'
import { useTranslation } from 'react-i18next'
import { useDeepEqualMemo } from 'hooks/useDeepEqualMemo'
import { simulateWithdraw } from 'offline-pool'
import SpaceBetweenFormat from './SpaceBetweenFormat'
import InlineAssetRatioLabel from './InlineAssetRatioLabel'
import ShareInput from './ShareInput'
import WithdrawCalculateModal from './WithdrawCalculateModal'

export enum RatioType {
  Original = 'Original',
  Equal = 'Equal',
  Single = 'Single',
}
const ratioTypes = Object.keys(RatioType)

interface WithdrawInputCardProp {
  isMobile
  setTx
  rebalance
  rebalanceBalances
  balances
  currentBalance
  onNext
}

const WithdrawInputCard: React.FC<WithdrawInputCardProp> = ({
  isMobile,
  setTx,
  rebalance,
  rebalanceBalances,
  balances,
  currentBalance,
  onNext,
}) => {
  const { t } = useTranslation()

  const [isSimulating, setIsSimulating] = useState(false)
  const [poolAmounts, setPoolAmounts] = useState([])
  const [ratioType, setRatioType] = useState(RatioType.Original)
  const [selectedToken, setSelectedToken] = useState({})
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
        return selectedAddress.includes(token.address) ? ratio : 0
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

  const [onPresentCalcModal] = useModal(
    <WithdrawCalculateModal
      setTx={setTx}
      currentInput={currentInput}
      isSimulating={isSimulating}
      toAllAssets={ratioType === RatioType.Original}
      rebalance={rebalance}
      selectedToken={selectedToken}
      currentBalance={currentBalance}
      tokenList={tokenList}
      estimatedValue={`$${numeral(usdToBeRecieve).format('0,0.[00]')}`}
      onNext={onNext}
    />,
    false,
  )
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
    <Card p={isMobile ? 'S_20' : 'S_40'} mb={isMobile ? 'S_40' : 'S_80'}>
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
          hint={t('Fee collected for vault')}
        />
        <SpaceBetweenFormat
          className="mb-2"
          title={`FINIX buy back fee ${get(rebalance, 'fee.buyback', 1.5)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.buyback', 1.5))).format('0,0.[0000]')}`}
          hint={t('Fee collected for buyback')}
        />
        <SpaceBetweenFormat
          title={`Ecosystem fee ${get(rebalance, 'fee.bounty', 0.3)}%`}
          value={`$${numeral(usdToBeRecieve / (100 / get(rebalance, 'fee.bounty', 0.3))).format('0,0.[0000]')}`}
          hint={t('Reservation fee for further')}
        />
      </Box>

      <Divider my="S_32" />

      <Flex flexWrap="wrap" justifyContent="space-between" alignItems="center" mb={isMobile ? 'S_16' : 'S_32'}>
        <Text textStyle="R_16M" color="mediumgrey" mb={isMobile ? 'S_20' : ''}>
          {t('Withdrawal ratio')}
        </Text>
        <ButtonGroup width={isMobile ? '100%' : 'fit-content'}>
          {ratioTypes.map((label) => (
            <Button
              scale="sm"
              width={isMobile ? '33.333%' : '102px'}
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
      <Box mb={isMobile ? 'S_32' : 'S_40'}>
        {ratioType === RatioType.Single
          ? tokenList.map((c) => (
              <CheckboxLabel
                key={c.symbol}
                width="100%"
                className="flex"
                control={
                  <Checkbox
                    scale="sm"
                    color="primary"
                    className="mt-s12"
                    checked={!!selectedToken[getAddress(c.address)]}
                    onChange={(event) => {
                      setSelectedToken({ [getAddress(c.address)]: event.target.checked })
                    }}
                  />
                }
              >
                <InlineAssetRatioLabel coin={c} column={isMobile} flexGrow={1} />
              </CheckboxLabel>
            ))
          : tokenList.map((c) => <InlineAssetRatioLabel key={c.symbol} coin={c} column={isMobile} />)}
      </Box>

      <Button
        scale="lg"
        width="100%"
        isLoading={isSimulating}
        disabled={!currentInput || (ratioType === RatioType.Single && !selectedLength)}
        onClick={onPresentCalcModal}
      >
        {t('Withdraw')}
      </Button>
    </Card>
  )
}

export default WithdrawInputCard
