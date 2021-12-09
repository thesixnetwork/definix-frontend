import React, { useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, BalanceInput, Flex, AnountButton, Noti, NotiType } from 'definixswap-uikit-v2'
import { useForm, useFormState } from 'react-hook-form'
import BigNumber from 'bignumber.js'
import useToFixedFloor from 'hooks/useToFixedFloor'

interface ShareInputProps {
  max: number
  symbol: string
  placeholder?: string
  value: string
  decimals?: number
  onChange: (input: string) => void
  hasError?: (error: boolean) => void
}

const ShareInput: React.FC<ShareInputProps> = ({ max, onChange, value, symbol, decimals = 18, hasError }) => {
  const { t } = useTranslation()
  const { register, control } = useForm({
    defaultValues: {
      balance: 'balance',
    },
  })
  const { dirtyFields } = useFormState({
    control,
  })
  const isGreaterThanMyBalance = useMemo(() => new BigNumber(value).gt(max), [value, max])
  const underMinimum = useMemo(() => new BigNumber(value).toNumber() <= 0, [value])

  const toFixedFloor = useToFixedFloor(decimals)

  const handleChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      const input = e.currentTarget.value?.replace(/[^0-9|^.]/g, '')
      onChange(toFixedFloor(input))
    },
    [onChange, toFixedFloor],
  )

  const handleBalanceChange = useCallback(
    (precentage: number) => {
      const calval = new BigNumber(max).times(precentage / 100)
      onChange(toFixedFloor(calval.toJSON()))
    },
    [max, onChange, toFixedFloor],
  )

  useEffect(() => {
    if (typeof hasError === 'function') {
      hasError(underMinimum || isGreaterThanMyBalance)
    }
  }, [underMinimum, isGreaterThanMyBalance, hasError])

  return (
    <div>
      <Flex color="textSubtle" mb="S_8">
        <BalanceInput {...register('balance')} onChange={handleChange} placeholder="0" value={value} />
        <Text as="span" textStyle="R_14R" ml="10px" mt="12px" style={{ flexShrink: 0 }}>
          {symbol}
        </Text>
      </Flex>

      <Flex>
        <AnountButton onClick={() => handleBalanceChange(25)} className="mr-s6">
          25%
        </AnountButton>
        <AnountButton onClick={() => handleBalanceChange(50)} className="mr-s6">
          50%
        </AnountButton>
        <AnountButton onClick={() => handleBalanceChange(100)}>MAX</AnountButton>
      </Flex>

      {isGreaterThanMyBalance && (
        <Noti mt="S_12" type={NotiType.ALERT}>
          {t('Insufficient balance')}
        </Noti>
      )}
      {dirtyFields.balance && underMinimum && (
        <Noti mt="S_12" type={NotiType.ALERT}>
          {t('Less than a certain amount')}
        </Noti>
      )}
    </div>
  )
}

ShareInput.defaultProps = {
  decimals: 18,
}

export default ShareInput
