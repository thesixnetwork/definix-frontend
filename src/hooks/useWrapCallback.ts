import { Currency, currencyEquals, ETHER, WETH } from 'definixswap-sdk'
import { useCallback, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useToast } from 'state/toasts/hooks'
import { tryParseAmount } from '../state/swap/hooks'
import { useTransactionAdder } from '../state/transactions/hooks'
import { useCurrencyBalance } from '../state/wallet/hooks'
import { useActiveWeb3React } from './index'
import { useWETHContract } from './useContract'

export enum WrapType {
  NOT_APPLICABLE,
  WRAP,
  UNWRAP
}

interface IProps {
  wrapType: WrapType;
  execute?: undefined | (() => Promise<void>);
  loading?: boolean;
  inputError?: string;
}

const NOT_APPLICABLE = { wrapType: WrapType.NOT_APPLICABLE }
/**
 * Given the selected input and output currency, return a wrap callback
 * @param inputCurrency the selected input currency
 * @param outputCurrency the selected output currency
 * @param typedValue the user input value
 */
export default function useWrapCallback(
  inputCurrency: Currency | undefined,
  outputCurrency: Currency | undefined,
  typedValue: string | undefined
): IProps {
  const [loading, setLoading] = useState<boolean>(false);

  const { chainId, account } = useActiveWeb3React()
  const wethContract = useWETHContract()
  const balance = useCurrencyBalance(account ?? undefined, inputCurrency)
  // we can always parse the amount typed as the input currency, since wrapping is 1:1
  const inputAmount = useMemo(() => tryParseAmount(typedValue, inputCurrency), [inputCurrency, typedValue])
  const addTransaction = useTransactionAdder()
  const { t } = useTranslation();
  const { toastSuccess, toastError } = useToast()

  const executeWrap = useCallback(async () => {
    setLoading(true);
    try {
      const txReceipt = await wethContract.deposit({ value: `0x${inputAmount.raw.toString(16)}` })
      addTransaction(txReceipt, { summary: `Wrap ${inputAmount.toSignificant(6)} KLAY to WKLAY` })
      setLoading(false);
      toastSuccess(
        t('{{Action}} Complete', {
          Action: t('actionWrap'),
        }),
      )
    } catch (err: unknown) {
      setLoading(false);
      toastError(
        t('{{Action}} Failed', {
          Action: t('actionWrap'),
        })
      )
    }
  }, [addTransaction, inputAmount, t, toastError, toastSuccess, wethContract]);

  const executeUnWrap = useCallback(async () => {
    setLoading(true);
    try {
      const txReceipt = await wethContract.withdraw(`0x${inputAmount.raw.toString(16)}`)
      addTransaction(txReceipt, { summary: `Unwrap ${inputAmount.toSignificant(6)} WKLAY to KLAY` });
      setLoading(false);
      toastSuccess(
        t('{{Action}} Complete', {
          Action: t('actionUnwrap'),
        }),
      )
    } catch (err: unknown) {
      setLoading(false);
      toastError(
        t('{{Action}} Failed', {
          Action: t('actionUnwrap'),
        })
      )
    }
  }, [addTransaction, inputAmount, t, toastError, toastSuccess, wethContract]);

  return useMemo(() => {
    if (!wethContract || !chainId || !inputCurrency || !outputCurrency) return NOT_APPLICABLE

    const sufficientBalance = inputAmount && balance && !balance.lessThan(inputAmount)

    if (inputCurrency === ETHER && currencyEquals(WETH(chainId), outputCurrency)) {
      return {
        wrapType: WrapType.WRAP,
        execute:
          sufficientBalance && inputAmount
            ? executeWrap
            : undefined,
        loading,
        inputError: sufficientBalance ? undefined : t('Insufficient balance'),
      }
    } if (currencyEquals(WETH(chainId), inputCurrency) && outputCurrency === ETHER) {
      return {
        wrapType: WrapType.UNWRAP,
        execute:
          sufficientBalance && inputAmount
            ? executeUnWrap
            : undefined,
        loading,
        inputError: sufficientBalance ? undefined : t('Insufficient balance'),
      }
    } 
      return NOT_APPLICABLE
    
  }, [wethContract, chainId, inputCurrency, outputCurrency, inputAmount, balance, executeWrap, loading, t, executeUnWrap])
}
