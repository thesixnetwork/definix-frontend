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
import React, { useCallback, useMemo } from 'react'
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
import { fetchBalances, fetchRebalanceBalances } from 'state/wallet'
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
  setTx;
  isWithdrawing;
  setIsWithdrawing;
  rebalance;
  poolAmounts;
  isSimulating;
  currentInput;
  setCurrentInput;
  onNext;
  ratioType;
  setRatioType;
  currentBalance;
  currentBalanceNumber;
  selectedToken;
  setSelectedToken;
}

const WithdrawInputCard: React.FC<WithdrawInputCardProp> = ({
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
  const { t } = useTranslation()
  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = !isXl && !isXxl
  const { setShowModal } = React.useContext(KlipModalContext())
  const { account, klaytn, connector } = useWallet()
  const dispatch = useDispatch()

  const usdToBeRecieve = parseFloat(currentInput) * rebalance.sharedPrice

  const tokens = useMemo(
    () => compact([...((rebalance || {}).tokens || []), ...((rebalance || {}).usdToken || [])]),
    [rebalance],
  )

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

      const lpAmount = thisInput.times(new BigNumber(10).pow(18)).toJSON();
      const toAllAssets = ratioType === RatioType.Original;
      const outputRatios = ((rebalance || {}).tokens || []).map((token, index) => {
        const tokenAddress = typeof token.address === 'string' ? token.address : getAddress(token.address)
        return selectedToken[tokenAddress]
          ? (((rebalance || {}).tokenRatioPoints || [])[index] || new BigNumber(0)).toNumber()
          : 0
      });
      const outputUSDRatio = selectedToken[typeof usdToken.address === 'string' ? usdToken.address : getAddress(usdToken.address)]
      ? (((rebalance || {}).usdTokenRatioPoint || [])[0] || new BigNumber(0)).toNumber()
      : 0;

      if (connector === 'klip') {
        klipProvider.genQRcodeContactInteract(
          getAddress(rebalance.address),
          JSON.stringify(getAbiRebalanceByName('removeFund')),
          JSON.stringify([
            lpAmount,
            toAllAssets,
            outputRatios,
            outputUSDRatio,
          ]),
          setShowModal,
        )
        const tx = await klipProvider.checkResponse()
        setTx(tx)
        handleLocalStorage(tx)
      } else {
        const tx = await rebalanceContract.methods
          .removeFund(
            lpAmount,
            toAllAssets,
            outputRatios,
            outputUSDRatio,
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
    } catch (e) {
      // eslint-disable-next-line
      debugger;
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

  return (
    <Card p={isMobile ? 'S_20' : 'S_40'}>
      <Box mb="S_40">
        <Text display="flex" color="textSubtle" textStyle="R_16M">{t('Withdrawal Amount')}</Text>

        <ShareInput
          onSelectBalanceRateButton={handleBalanceChange}
          onChange={handleChange}
          value={currentInput}
          max={currentBalance}
          symbol={t('SHR')}
        />
        <Text fontSize="12px" color="textSubtle" className="mt-1" textAlign="right">
          ~ ${numeral(usdToBeRecieve).format('0,0.[00]')}
        </Text>
      </Box>

      <Box>
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
                setRatioType(label)
              }}
            >
              {t(label)}
            </Button>
          ))}
        </ButtonGroup>
      </Flex>
      <Box mb="S_40">
        {ratioType === RatioType.Original ? (
          tokens
            .map((token, index) => {
              const ratioObject = ((rebalance || {}).ratio || []).find((r) => r.symbol === token.symbol)
              const ratios = get(rebalance, `ratioCal`)
              // eslint-disable-next-line
              const ratioMerge = Object.assign({ valueRatioCal: ratios ? ratios[index] : 0 }, ratioObject)
              return {
                ...token,
                ...ratioMerge,
                amount: ((poolAmounts || [])[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
              }
            })
            .filter((rt) => rt.value)
            .map((c) => <InlineAssetRatioLabel coin={c} />)
        ) : ratioType === RatioType.Equal ? (
          <>
          {tokens
            .map((token, index) => {
              return {
                ...token,
                valueRatioCal: 100 / tokens.length,
                // amount: (poolAmounts[index] || new BigNumber(0)).div(new BigNumber(10).pow(token.decimals)),
              }
            })
            // .filter((rt) => rt.value)
            .map((c) => <InlineAssetRatioLabel coin={c} />)
            }
            </>
        ) : (
          <>
            {tokens
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
              ))}
          </>
        )}
      </Box>

      <Button scale="lg" width="100%" disabled={isWithdrawing || isSimulating || ratioType === RatioType.Single && !selectedToken.length } onClick={onWithdraw}>
        {t('Withdraw')}
      </Button>
    </Card>
  )
}

export default WithdrawInputCard;