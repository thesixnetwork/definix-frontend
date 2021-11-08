import BigNumber from 'bignumber.js'
import React, { useCallback, useMemo, useState } from 'react'
import useI18n from 'hooks/useI18n'
import { useTranslation } from 'react-i18next'
import { useSousUnstake } from 'hooks/useUnstake'
import useConverter from 'hooks/useConverter'
import { Button } from 'uikit-dev'
import { getBalanceNumber, getFullDisplayBalance } from 'utils/formatBalance'
import useModal from 'uikit-dev/widgets/Modal/useModal'
import ModalInput from 'components/ModalInput'
import ConfirmModal from './ConfirmModal'

interface WithdrawProps {
  sousId: number
  isOldSyrup: boolean
  tokenName: string
  totalStaked: BigNumber
  myStaked: BigNumber
  max: BigNumber
  onBack: () => void
}

const Withdraw: React.FC<WithdrawProps> = ({ sousId, isOldSyrup, tokenName, totalStaked, myStaked, max, onBack }) => {
  const { t } = useTranslation()
  console.groupCollapsed('Withdraw data: ')
  console.log('tokenName: ', tokenName)
  console.log('totalStakedPrice: ', totalStaked)
  console.log('myStaked: ', myStaked)
  console.log('max: ', max)
  console.groupEnd()
  const [val, setVal] = useState('')
  const TranslateString = useI18n()
  const { convertToUSD, convertToPriceFromSymbol } = useConverter()
  const { onUnstake } = useSousUnstake(sousId)

  const fullBalance = useMemo(() => {
    return getFullDisplayBalance(max)
  }, [max])

  const price = useMemo(() => {
    return convertToPriceFromSymbol(tokenName)
  }, [convertToPriceFromSymbol, tokenName])

  const totalStakedPrice = useMemo(() => {
    return convertToUSD(new BigNumber(getBalanceNumber(totalStaked)).multipliedBy(price), 0)
  }, [convertToUSD, totalStaked, price])

  const myStakedValue = useMemo(() => {
    return getBalanceNumber(myStaked)
  }, [myStaked])

  const myStakedPrice = useMemo(() => {
    return convertToUSD(new BigNumber(myStakedValue).multipliedBy(price), 0)
  }, [convertToUSD, myStakedValue, price])

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      setVal(e.currentTarget.value)
    },
    [setVal],
  )

  const handleSelectBalanceRate = useCallback(
    (rate: number) => {
      const balance = max.times(rate / 100)
      setVal(getFullDisplayBalance(balance))
    },
    [max, setVal],
  )

  const handleUnstake = useCallback(() => {
    onUnstake(isOldSyrup ? '0' : val)
  }, [isOldSyrup, onUnstake, val])

  /**
   * confirm modal
   */
  const [onPresentConfirmModal] = useModal(
    <ConfirmModal
      title={t('Confirm Remove')}
      buttonName={t('Remove')}
      tokenName={tokenName}
      stakedBalance={val}
      onOK={handleUnstake}
    />,
    false,
  )

  return (
    <>
      <Button onClick={onBack} fullWidth className="mt-5" radii="card">
        Back
      </Button>

      <p>totalStakedPrice: {totalStakedPrice}</p>
      <p>myStaked: {myStakedValue.toLocaleString()}</p>
      <p>myStakedPrice: {myStakedPrice}</p>

      <ModalInput
        value={val}
        onSelectBalanceRateButton={handleSelectBalanceRate}
        onChange={handleChange}
        max={fullBalance}
        symbol={tokenName}
        inputTitle={TranslateString(1070, 'Stake')}
      />
      <Button onClick={() => onPresentConfirmModal()} fullWidth className="mt-5" radii="card">
        Withdraw
      </Button>
    </>
  )
}

export default Withdraw
