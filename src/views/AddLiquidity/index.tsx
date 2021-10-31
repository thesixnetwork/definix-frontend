/* eslint-disable react/jsx-no-bind */
import numeral from 'numeral'
import Caver from 'caver-js'
import { ethers } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'
import { abi as IUniswapV2Router02ABI } from '@uniswap/v2-periphery/build/IUniswapV2Router02.json'
import BigNumberJs from 'bignumber.js'
import { BorderCard } from 'components/Card'
import { AutoColumn, ColumnCenter } from 'components/Column'
import ConnectWalletButton from 'components/ConnectWalletButton'
import CurrencyInputPanel from 'components/CurrencyInputPanel'
import DoubleCurrencyLogo from 'components/DoubleLogo'
import { AddRemoveTabs } from 'components/NavigationTabs'
import { MinimalPositionCard } from 'components/PositionCard'
import { KlipModalContext } from '@sixnetwork/klaytn-use-wallet'
import { useCaverJsReact } from '@sixnetwork/caverjs-react-core'
import { RowBetween, RowFixed } from 'components/Row'
import { KlipConnector } from "@sixnetwork/klip-connector"
import { Dots } from 'components/swap/styleds'
import tp from 'tp-js-sdk'
import {sendAnalyticsData} from 'utils/definixAnalytics'
// import { Transaction } from "@ethersproject/transactios";
import TransactionConfirmationModal, {
  ConfirmationModalContent,
  TransactionErrorContent,
  TransactionSubmittedContent
} from 'components/TransactionConfirmationModal'
import { PairState } from 'data/Reserves'
import { Currency, currencyEquals, ETHER, TokenAmount, WETH } from 'definixswap-sdk'
import { useActiveWeb3React } from 'hooks'
import { useCurrency } from 'hooks/Tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import React, { useCallback, useState, useContext } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import { Field } from 'state/mint/actions'
import { useDerivedMintInfo, useMintActionHandlers, useMintState } from 'state/mint/hooks'
import { useTransactionAdder } from 'state/transactions/hooks'
import { KlaytnTransactionResponse } from 'state/transactions/actions'
import { useIsExpertMode, useUserDeadline, useUserSlippageTolerance } from 'state/user/hooks'
import { AddIcon, Button, CardBody, Text, Text as UIKitText } from 'uikit-dev'
import liquidity from 'uikit-dev/animation/liquidity.json'
import { LeftPanel, MaxWidthLeft } from 'uikit-dev/components/TwoPanelLayout'
import { calculateGasMargin, calculateSlippageAmount, getRouterContract } from 'utils'
import { currencyId } from 'utils/currencyId'
import { maxAmountSpend } from 'utils/maxAmountSpend'
import { wrappedCurrency } from 'utils/wrappedCurrency'
import UseDeParam from 'hooks/useDeParamSwapInterface'
import { ROUTER_ADDRESS, HERODOTUS_ADDRESS } from 'config/constants'
import farms from 'config/constants/farm'
import { getAbiByName } from 'hooks/hookHelper'
import HERODOTUS_ABI from 'config/abi/herodotus.json'
import AppBody from '../AppBody'
import { Wrapper } from '../Pool/styleds'
import { ConfirmAddModalBottom } from './ConfirmAddModalBottom'
import { PoolPriceBar } from './PoolPriceBar'
import { useHerodotusContract } from '../../hooks/useContract'
import * as klipProvider from '../../hooks/klipProvider'
// import { AppDispatch, AppState } from '../../state/index'
// import { addTransaction as addTxn } from '../../state/transactions/actions'

export default function AddLiquidity({
  match: {
    params: { currencyIdA, currencyIdB }
  },
  history
}: RouteComponentProps<{ currencyIdA?: string; currencyIdB?: string }>) {
  const { account, chainId, library } = useActiveWeb3React()
  const { connector } = useCaverJsReact()
  const { setShowModal } = useContext(KlipModalContext())
  const currencyA = useCurrency(currencyIdA)
  const currencyB = useCurrency(currencyIdB)

  const herodotusContract = useHerodotusContract()
  const herodotusAddress = HERODOTUS_ADDRESS[chainId || '']

  const oneCurrencyIsWETH = Boolean(
    chainId &&
    ((currencyA && currencyEquals(currencyA, WETH(chainId))) ||
      (currencyB && currencyEquals(currencyB, WETH(chainId))))
  )
  const expertMode = useIsExpertMode()

  // mint state
  const { independentField, typedValue, otherTypedValue } = useMintState()
  const {
    dependentField,
    currencies,
    pair,
    pairState,
    currencyBalances,
    parsedAmounts,
    price,
    noLiquidity,
    liquidityMinted,
    poolTokenPercentage,
    error
  } = useDerivedMintInfo(currencyA ?? undefined, currencyB ?? undefined)
  const { onFieldAInput, onFieldBInput } = useMintActionHandlers(noLiquidity)

  const isValid = !error

  // modal, loading, error
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false) // clicked confirm
  const [errorMsg, setErrorMsg] = useState<string>('')

  // txn values
  const [deadline] = useUserDeadline() // custom from users settings
  const [allowedSlippage] = useUserSlippageTolerance() // custom from users
  const [txHash, setTxHash] = useState<string>('')

  // get formatted amounts
  const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: noLiquidity ? otherTypedValue : parsedAmounts[dependentField]?.toSignificant(6) ?? ''
  }

  // get the max amounts user can add
  const maxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmountSpend(currencyBalances[field])
      }
    },
    {}
  )

  const atMaxAmounts: { [field in Field]?: TokenAmount } = [Field.CURRENCY_A, Field.CURRENCY_B].reduce(
    (accumulator, field) => {
      return {
        ...accumulator,
        [field]: maxAmounts[field]?.equalTo(parsedAmounts[field] ?? '0')
      }
    },
    {}
  )

  // check whether the user has approved the router on the tokens
  const [approvalA, approveACallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_A], ROUTER_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')])
  const [approvalB, approveBCallback] = useApproveCallback(parsedAmounts[Field.CURRENCY_B], ROUTER_ADDRESS[chainId || parseInt(process.env.REACT_APP_CHAIN_ID || '0')])
  const [approvalLP, approveLPCallback] = useApproveCallback(liquidityMinted, herodotusAddress)

  const addTransaction = useTransactionAdder()
  const sendDefinixAnalytics = () =>{
    if (tp.isConnected()) {
      const firstToken = currencies[Field.CURRENCY_A]
      const secondToken = currencies[Field.CURRENCY_B]
      const farm = farms.find(
        x =>
          x.pid !== 0 &&
          x.pid !== 1 &&
          ((x.tokenSymbol === firstToken?.symbol && x.quoteTokenSymbol === secondToken?.symbol) ||
            (x.tokenSymbol === secondToken?.symbol && x.quoteTokenSymbol === firstToken?.symbol))
      )
      if(farm && account ){
        tp.getDeviceId().then(res=>{
          sendAnalyticsData(farm.pid,account,res.device_id)
        })
        
      }
    }
  }
  async function onAdd() {
    if (!chainId || !library || !account) return
    const router = getRouterContract(chainId, library, account)

    const { [Field.CURRENCY_A]: parsedAmountA, [Field.CURRENCY_B]: parsedAmountB } = parsedAmounts
    if (!parsedAmountA || !parsedAmountB || !currencyA || !currencyB) {
      return
    }

    const amountsMin = {
      [Field.CURRENCY_A]: calculateSlippageAmount(parsedAmountA, noLiquidity ? 0 : allowedSlippage)[0],
      [Field.CURRENCY_B]: calculateSlippageAmount(parsedAmountB, noLiquidity ? 0 : allowedSlippage)[0]
    }

    const deadlineFromNow = Math.ceil(Date.now() / 1000) + deadline

    let estimate
    let method: (...args: any) => Promise<KlaytnTransactionResponse>
    let args: Array<string | string[] | number>
    let value: BigNumber | null
    let methodName

    if (currencyA === ETHER || currencyB === ETHER) {
      const tokenBIsETH = currencyB === ETHER
      estimate = router.estimateGas.addLiquidityETH
      method = router.addLiquidityETH
      methodName = "addLiquidityETH"
      args = [
        wrappedCurrency(tokenBIsETH ? currencyA : currencyB, chainId)?.address ?? '', // token
        (tokenBIsETH ? parsedAmountA : parsedAmountB).raw.toString(), // token desired
        amountsMin[tokenBIsETH ? Field.CURRENCY_A : Field.CURRENCY_B].toString(), // token min
        amountsMin[tokenBIsETH ? Field.CURRENCY_B : Field.CURRENCY_A].toString(), // eth min
        account,
        deadlineFromNow
      ]
      value = BigNumber.from((tokenBIsETH ? parsedAmountB : parsedAmountA).raw.toString())
    } else {
      estimate = router.estimateGas.addLiquidity
      method = router.addLiquidity
      methodName = "addLiquidity"
      args = [
        wrappedCurrency(currencyA, chainId)?.address ?? '',
        wrappedCurrency(currencyB, chainId)?.address ?? '',
        parsedAmountA.raw.toString(),
        parsedAmountB.raw.toString(),
        amountsMin[Field.CURRENCY_A].toString(),
        amountsMin[Field.CURRENCY_B].toString(),
        account,
        deadlineFromNow
      ]
      value = null
    }

    setAttemptingTxn(true)
    const valueNumber = (Number(value ? (+value).toString() : "0") / (10 ** 18)).toString()
    const valueklip = Number.parseFloat(valueNumber).toFixed(6)
    // let expectValue = (`${(Number(valueklip) + 0.00001) / (10 ** 18)}`)
    // expectValue = expectValue.slice(0, -13)
    // valueklip*(10**18).slice(0, -13)+"0000000000000"
    // Number(klipValue)

    if (isKlipConnector(connector)) {
      setShowModal(true)
      klipProvider.genQRcodeContactInteract(
        router.address,
        JSON.stringify(getAbiByName(methodName)),
        JSON.stringify(args),
        // @ts-ignore
        +valueklip !==0 ? `${Math.ceil(+valueklip)}000000000000000000` : "0",
        setShowModal
      )
      const tx = await klipProvider.checkResponse()
      setTxHash(tx)
      setAttemptingTxn(false)
      setShowModal(false)
     
      addTransaction(undefined, {
        type: 'removeLiquidity',
        klipTx: tx,
        data: {
          firstToken: currencyA?.symbol,
          firstTokenAmount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
          secondToken: currencyB?.symbol,
          secondTokenAmount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
        },
        summary: `Remove ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencyA?.symbol
          } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencyB?.symbol}`
      })

    } else {
      const iface = new ethers.utils.Interface(IUniswapV2Router02ABI)
      
      // swap-interface
      const flagFeeDelegate = await UseDeParam(chainId, 'KLAYTN_FEE_DELEGATE', 'N')
      const flagDefinixAnalaytics = await UseDeParam(chainId, 'GA_TP', 'N')
      // const flagFeeDelegate = await UseDeParam(chainId, 'KLAYTN_FEE_DELEGATE')
      // const flagDefinixAnalaytics = await UseDeParam(chainId, 'GA_TP')

      await estimate(...args, value ? { value } : {})
        .then(estimatedGasLimit => {
          if (flagFeeDelegate === "Y") {
            const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
            const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

            // @ts-ignore
            const caver = new Caver(window.caver)
            caver.klay.signTransaction({
              type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
              from: account,
              to: ROUTER_ADDRESS[chainId],
              gas: calculateGasMargin(estimatedGasLimit),
              value,
              data: iface.encodeFunctionData(methodName, [...args]),
            })
              .then(function (userSignTx) {
                // console.log('userSignTx tx = ', userSignTx)
                const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
                // console.log('userSigned tx = ', userSigned)
                userSigned.feePayer = feePayerAddress
                // console.log('userSigned After add feePayer tx = ', userSigned)

                caverFeeDelegate.rpc.klay.signTransactionAsFeePayer(userSigned).then(function (feePayerSigningResult) {
                  // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
                  if(flagDefinixAnalaytics==='Y'){
                    sendDefinixAnalytics()
                  }
                  
                  // console.log("feePayerSigningResult",flagDefinixAnalaytics)
                  caver.rpc.klay.sendRawTransaction(feePayerSigningResult.raw).then((response: KlaytnTransactionResponse) => {
                    // document.write(JSON.stringify(response.transactionHash))

                    // console.log(methodName, ' tx = ', response)
                    setAttemptingTxn(false)
                    setTxHash(response.transactionHash)
                    addTransaction(response, {
                      type: 'addLiquidity',
                      data: {
                        firstToken: currencies[Field.CURRENCY_A]?.symbol,
                        firstTokenAmount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
                        secondToken: currencies[Field.CURRENCY_B]?.symbol,
                        secondTokenAmount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
                      },
                      summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[Field.CURRENCY_A]?.symbol
                        } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
                    })

                  }).catch(e => {
                    setAttemptingTxn(false)
                    // we only care if the error is something _other_ than the user rejected the tx
                    if (e?.code !== 4001) {
                      console.error(e)
                      setErrorMsg(e)
                    }
                  })
                  
                  
                })
                
              })
              .catch(e => {
                setAttemptingTxn(false)
                alert(`err ${e}`)
                // we only care if the error is something _other_ than the user rejected the tx
                if (e?.code !== 4001) {
                  console.error(e)
                  setErrorMsg(e)
                }
              })
          } else {
            
            method(...args, {
              ...(value ? { value } : {}),
              gasLimit: calculateGasMargin(estimatedGasLimit)
            }).then(response => {
              if(flagDefinixAnalaytics==='Y'){
                sendDefinixAnalytics()
              }
              
              setAttemptingTxn(false)

              addTransaction(response, {
                type: 'addLiquidity',
                data: {
                  firstToken: currencies[Field.CURRENCY_A]?.symbol,
                  firstTokenAmount: parsedAmounts[Field.CURRENCY_A]?.toSignificant(3),
                  secondToken: currencies[Field.CURRENCY_B]?.symbol,
                  secondTokenAmount: parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)
                },
                summary: `Add ${parsedAmounts[Field.CURRENCY_A]?.toSignificant(3)} ${currencies[Field.CURRENCY_A]?.symbol
                  } and ${parsedAmounts[Field.CURRENCY_B]?.toSignificant(3)} ${currencies[Field.CURRENCY_B]?.symbol}`
              })
              console.log('~~~response', response)
              setTxHash(response?.hash)
            })
          }
        })
        .catch(e => {
          setAttemptingTxn(false)

          // we only care if the error is something _other_ than the user rejected the tx
          if (e?.code !== 4001) {
            console.error(e)
            setErrorMsg(e)
          }
        })
    }
  }

  const modalHeader = useCallback(() => {
    return (
      <div>
        {noLiquidity ? (
          <RowFixed mb="0 !important">
            <DoubleCurrencyLogo
              currency0={currencies[Field.CURRENCY_A]}
              currency1={currencies[Field.CURRENCY_B]}
              size={40}
            />
            <UIKitText fontSize="24px" ml="3" fontWeight="500">
              {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
            </UIKitText>
          </RowFixed>
        ) : (
          <AutoColumn gap="24px">
            <RowBetween align="center">
              <RowFixed mb="0 !important">
                <DoubleCurrencyLogo
                  currency0={currencies[Field.CURRENCY_A]}
                  currency1={currencies[Field.CURRENCY_B]}
                  size={40}
                />
                <UIKitText fontSize="24px" ml="3" fontWeight="500">
                  {`${currencies[Field.CURRENCY_A]?.symbol}/${currencies[Field.CURRENCY_B]?.symbol}`}
                </UIKitText>
              </RowFixed>

              <UIKitText fontSize="24px" fontWeight="500">
                {liquidityMinted?.toSignificant(6)}
              </UIKitText>
            </RowBetween>

            <UIKitText>
              Output is estimated. If the price changes by more than
              <strong className="mx-1">{allowedSlippage / 100}%</strong>your transaction will revert.
            </UIKitText>
          </AutoColumn>
        )}
      </div>
    )
  }, [allowedSlippage, currencies, liquidityMinted, noLiquidity])

  const modalBottom = () => {
    return (
      <ConfirmAddModalBottom
        price={price}
        currencies={currencies}
        parsedAmounts={parsedAmounts}
        noLiquidity={noLiquidity}
        onAdd={onAdd}
        poolTokenPercentage={poolTokenPercentage}
      />
    )
  }

  const handleCurrencyASelect = useCallback(
    (currA: Currency) => {
      const newCurrencyIdA = currencyId(currA)
      if (newCurrencyIdA === currencyIdB) {
        history.push(`/add/${currencyIdB}/${currencyIdA}`)
      } else {
        history.push(`/add/${newCurrencyIdA}/${currencyIdB}`)
      }
    },
    [currencyIdB, history, currencyIdA]
  )
  const handleCurrencyBSelect = useCallback(
    (currB: Currency) => {
      const newCurrencyIdB = currencyId(currB)
      if (currencyIdA === newCurrencyIdB) {
        if (currencyIdB) {
          history.push(`/add/${currencyIdB}/${newCurrencyIdB}`)
        } else {
          history.push(`/add/${newCurrencyIdB}`)
        }
      } else {
        history.push(`/add/${currencyIdA || 'KLAY'}/${newCurrencyIdB}`)
      }
    },
    [currencyIdA, history, currencyIdB]
  )

  const submittedContent = useCallback(
    () => (
      <TransactionSubmittedContent
        title="Add Liquidity Complete"
        date={`${new Date().toDateString()}, ${new Date().toTimeString().split(" ")[0]}`}
        chainId={chainId}
        hash={txHash}
        content={modalHeader}
        button={
          <Button
            onClick={() => {
              const firstToken = currencies[Field.CURRENCY_A]
              const secondToken = currencies[Field.CURRENCY_B]
              const farm = farms.find(
                x =>
                  x.pid !== 0 &&
                  x.pid !== 1 &&
                  ((x.firstSymbol === firstToken?.symbol && x.secondSymbol === secondToken?.symbol) ||
                    (x.firstSymbol === secondToken?.symbol && x.secondSymbol === firstToken?.symbol))
              )

              if (farm && farm.pid !== 1 && farm.pid !== 0 && liquidityMinted) {
                return new Promise((resolve, reject) => {
                  setAttemptingTxn(true)
                  if (approvalLP !== ApprovalState.APPROVED) {
                    approveLPCallback()
                      .then(() => {
                        resolve(true)
                      })
                      .catch(err => {
                        reject(err)
                      })
                  } else {
                    resolve(true)
                  }
                })
                  .then(() => {
                    const args = [
                      farm.pid,
                      new BigNumberJs(liquidityMinted.toExact()).times(new BigNumberJs(10).pow(18)).toString()
                    ]
                    return herodotusContract?.estimateGas.deposit(...args)
                  })
                  .then(estimatedGasLimit => {
                    if (estimatedGasLimit) {
                      const args = [
                        farm.pid,
                        new BigNumberJs(liquidityMinted.toExact()).times(new BigNumberJs(10).pow(18)).toString()
                      ]

                      const iface = new ethers.utils.Interface(HERODOTUS_ABI)

                      // swap-interface
                      // UseDeParam(chainId, 'KLAYTN_FEE_DELEGATE', 'N')
                      return UseDeParam(chainId, 'KLAYTN_FEE_DELEGATE', 'N').then((flagFeeDelegate) => {
                        if (flagFeeDelegate === 'Y') {
                          const caverFeeDelegate = new Caver(process.env.REACT_APP_SIX_KLAYTN_EN_URL)
                          const feePayerAddress = process.env.REACT_APP_FEE_PAYER_ADDRESS

                          // @ts-ignore
                          const caver = new Caver(window.caver)

                          return caver.klay
                            .signTransaction({
                              type: 'FEE_DELEGATED_SMART_CONTRACT_EXECUTION',
                              from: account,
                              to: herodotusAddress,
                              gas: calculateGasMargin(estimatedGasLimit),
                              data: iface.encodeFunctionData('deposit', [...args]),
                            })
                            .then(function (userSignTx) {
                              // console.log('userSignTx tx = ', userSignTx)
                              const userSigned = caver.transaction.decode(userSignTx.rawTransaction)
                              // console.log('userSigned tx = ', userSigned)
                              userSigned.feePayer = feePayerAddress
                              // console.log('userSigned After add feePayer tx = ', userSigned)

                              return caverFeeDelegate.rpc.klay
                                .signTransactionAsFeePayer(userSigned)
                                .then(function (feePayerSigningResult) {
                                  // console.log('feePayerSigningResult tx = ', feePayerSigningResult)
                                  return caverFeeDelegate.rpc.klay
                                    .sendRawTransaction(feePayerSigningResult.raw)
                                    .on('transactionHash', (depositTx) => {
                                      console.log('deposit tx = ', depositTx)
                                      return depositTx.transactionHash
                                    })
                                })
                            })
                            .catch(function (tx) {
                              console.log('deposit error tx = ', tx)
                              return tx.transactionHash
                            })
                        }

                        return herodotusContract?.deposit(...args, {
                          gasLimit: calculateGasMargin(estimatedGasLimit)
                        })
                      })
                    }
                    return true
                  })
                  .then(function (tx) {
                    // window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/farm`
                    history.push('/farm')
                    return true
                  })
                  .catch(function (tx) {
                    // window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/farm`
                    history.push('/farm')
                    return true
                  })
              }
              // window.location.href = `${process.env.REACT_APP_FRONTEND_URL}/farm`
              history.push('/farm')
              return true
            }}
            radii="card"
            fullWidth
          >
            Add this Liquidity to Farm
          </Button>
        }
      />
    ),
    [chainId, modalHeader, txHash, currencies, herodotusContract, herodotusAddress, liquidityMinted, approvalLP, approveLPCallback, account, history]
  )

  const errorContent = useCallback(
    () => (
      <TransactionErrorContent
        title="Add Liquidity Failed"
        date={`${new Date().toDateString()}, ${new Date().toTimeString().split(" ")[0]}`}
        chainId={chainId}
        hash={txHash}
        content={modalHeader}
        button={
          <Button
            onClick={() => {
              console.log('Add Liquidity Again')
            }}
            radii="card"
            fullWidth
          >
            Add Liquidity Again
          </Button>
        }
      />
    ),
    [chainId, modalHeader, txHash]
  )

  const handleDismissConfirmation = useCallback(() => {
    setShowConfirm(false)
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onFieldAInput('')
    }
    setTxHash('')
    setErrorMsg('')
  }, [onFieldAInput, txHash])

  return (
    <>
      {!showConfirm ? (
        <LeftPanel isShowRightPanel={false}>
          <MaxWidthLeft>
            <AppBody>
              <AddRemoveTabs adding />

              <Wrapper>
                <CardBody p="32px !important">
                  <div>
                    {noLiquidity && (
                      <BorderCard className="mb-4">
                        <AutoColumn gap="12px">
                          <Text>You are the first liquidity provider.</Text>
                          <Text>The ratio of tokens you add will set the price of this pool.</Text>
                          <Text>Once you are happy with the rate click supply to review.</Text>
                        </AutoColumn>
                      </BorderCard>
                    )}

                    <CurrencyInputPanel
                      value={formattedAmounts[Field.CURRENCY_A]}
                      onUserInput={onFieldAInput}
                      onMax={() => {
                        onFieldAInput(maxAmounts[Field.CURRENCY_A]?.toExact() ?? '')
                      }}
                      onQuarter={() => {
                        onFieldAInput(
                          numeral(parseFloat(maxAmounts[Field.CURRENCY_A]?.toExact() || '') / 4).format('0.00') ?? ''
                        )
                      }}
                      onHalf={() => {
                        onFieldAInput(
                          numeral(parseFloat(maxAmounts[Field.CURRENCY_A]?.toExact() || '') / 2).format('0.00') ?? ''
                        )
                      }}
                      onCurrencySelect={handleCurrencyASelect}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_A]}
                      currency={currencies[Field.CURRENCY_A]}
                      id="add-liquidity-input-tokena"
                      showCommonBases={false}
                      className="mb-4"
                    />

                    <ColumnCenter>
                      <AddIcon color="textSubtle" />
                    </ColumnCenter>

                    <CurrencyInputPanel
                      value={formattedAmounts[Field.CURRENCY_B]}
                      onUserInput={onFieldBInput}
                      onCurrencySelect={handleCurrencyBSelect}
                      onMax={() => {
                        onFieldBInput(maxAmounts[Field.CURRENCY_B]?.toExact() ?? '')
                      }}
                      onQuarter={() => {
                        onFieldBInput(
                          numeral(parseFloat(maxAmounts[Field.CURRENCY_B]?.toExact() || '') / 4).format('0.00') ?? ''
                        )
                      }}
                      onHalf={() => {
                        onFieldBInput(
                          numeral(parseFloat(maxAmounts[Field.CURRENCY_B]?.toExact() || '') / 2).format('0.00') ?? ''
                        )
                      }}
                      showMaxButton={!atMaxAmounts[Field.CURRENCY_B]}
                      currency={currencies[Field.CURRENCY_B]}
                      id="add-liquidity-input-tokenb"
                      showCommonBases={false}
                    />
                  </div>
                </CardBody>

                <div className="pa-6 bd-t">
                  {currencies[Field.CURRENCY_A] && currencies[Field.CURRENCY_B] && pairState !== PairState.INVALID && (
                    <div className="mb-5">
                      <Text color="textSubtle" fontSize="14px" className="mb-1">
                        {noLiquidity ? 'Initial Prices and Pool Share' : 'Prices and Pool Share'}
                      </Text>
                      <BorderCard>
                        <PoolPriceBar
                          currencies={currencies}
                          poolTokenPercentage={poolTokenPercentage}
                          noLiquidity={noLiquidity}
                          price={price}
                        />
                      </BorderCard>
                    </div>
                  )}

                  {!account ? (
                    <ConnectWalletButton fullWidth />
                  ) : (
                    <AutoColumn gap="md">
                      {(approvalA === ApprovalState.NOT_APPROVED ||
                        approvalA === ApprovalState.PENDING ||
                        approvalB === ApprovalState.NOT_APPROVED ||
                        approvalB === ApprovalState.PENDING) &&
                        isValid && (
                          <RowBetween>
                            {approvalA !== ApprovalState.APPROVED && (
                              <Button
                                onClick={approveACallback}
                                disabled={approvalA === ApprovalState.PENDING}
                                style={{ width: approvalB !== ApprovalState.APPROVED ? '48%' : '100%' }}
                                radii="card"
                              >
                                {approvalA === ApprovalState.PENDING ? (
                                  <Dots>Approving {currencies[Field.CURRENCY_A]?.symbol}</Dots>
                                ) : (
                                  `Approve ${currencies[Field.CURRENCY_A]?.symbol}`
                                )}
                              </Button>
                            )}
                            {approvalB !== ApprovalState.APPROVED && (
                              <Button
                                onClick={approveBCallback}
                                disabled={approvalB === ApprovalState.PENDING}
                                style={{ width: approvalA !== ApprovalState.APPROVED ? '48%' : '100%' }}
                                radii="card"
                              >
                                {approvalB === ApprovalState.PENDING ? (
                                  <Dots>Approving {currencies[Field.CURRENCY_B]?.symbol}</Dots>
                                ) : (
                                  `Approve ${currencies[Field.CURRENCY_B]?.symbol}`
                                )}
                              </Button>
                            )}
                          </RowBetween>
                        )}
                      <Button
                        onClick={() => {
                          if (expertMode) {
                            onAdd()
                          } else {
                            setShowConfirm(true)
                          }
                        }}
                        disabled={
                          !isValid || approvalA !== ApprovalState.APPROVED || approvalB !== ApprovalState.APPROVED
                        }
                        variant={
                          !isValid && !!parsedAmounts[Field.CURRENCY_A] && !!parsedAmounts[Field.CURRENCY_B]
                            ? 'danger'
                            : 'primary'
                        }
                        fullWidth
                        radii="card"
                      >
                        {error ?? 'Supply'}
                      </Button>
                    </AutoColumn>
                  )}
                </div>

                {pair && !noLiquidity && pairState !== PairState.INVALID ? (
                  <div className="pa-6 bd-t">
                    <MinimalPositionCard showUnwrapped={oneCurrencyIsWETH} pair={pair} />
                  </div>
                ) : null}
              </Wrapper>
            </AppBody>
          </MaxWidthLeft>
        </LeftPanel>
      ) : (
        <TransactionConfirmationModal
          isOpen={showConfirm}
          isPending={!!attemptingTxn}
          isSubmitted={!!txHash}
          isError={!!errorMsg}
          confirmContent={() => (
            <ConfirmationModalContent
              mainTitle="Confirm Liquidity"
              title={noLiquidity ? 'You are creating a pool' : 'You will receive'}
              topContent={modalHeader}
              bottomContent={modalBottom}
            />
          )}
          pendingIcon={liquidity}
          submittedContent={submittedContent}
          errorContent={errorContent}
          onDismiss={handleDismissConfirmation}
        />
      )}
    </>
  )
}

const isKlipConnector = (connector) => connector instanceof KlipConnector
