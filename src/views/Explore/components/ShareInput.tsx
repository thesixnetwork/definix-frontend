import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Text, BalanceInput, Flex, AnountButton, Noti, NotiType } from 'definixswap-uikit'
import { useForm, useFormState } from 'react-hook-form'

interface ShareInputProps {
  max: number
  symbol: string
  placeholder?: string
  value: string
  addLiquidityUrl?: string
  onChange: (e: React.FormEvent<HTMLInputElement>) => void
  onSelectBalanceRateButton: (rate: number) => void
}

const ShareInput: React.FC<ShareInputProps> = ({ max, onChange, value, symbol, onSelectBalanceRateButton }) => {
  const { t } = useTranslation()
  const { register, control } = useForm({
    defaultValues: {
      balance: 'balance',
    },
  })
  const { dirtyFields } = useFormState({
    control,
  })
  const isGreaterThanMyBalance = useMemo(() => parseFloat(value) > max, [value, max])
  const underMinimum = useMemo(() => parseFloat(value) <= 0, [value])

  return (
    <div>
      <Flex color="textSubtle" mb="S_8">
        <BalanceInput {...register('balance')} onChange={onChange} placeholder="0" value={value} />
        <Text as="span" textStyle="R_14R" ml="10px" mt="12px" style={{ flexShrink: 0 }}>
          {symbol}
        </Text>
      </Flex>

      <Flex>
        <AnountButton onClick={() => onSelectBalanceRateButton(25)} className="mr-s6">
          25%
        </AnountButton>
        <AnountButton onClick={() => onSelectBalanceRateButton(50)} className="mr-s6">
          50%
        </AnountButton>
        <AnountButton onClick={() => onSelectBalanceRateButton(100)}>MAX</AnountButton>
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

export default ShareInput
