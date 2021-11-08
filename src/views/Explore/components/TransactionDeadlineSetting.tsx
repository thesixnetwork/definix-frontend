import useUserDeadline from 'hooks/useUserDeadline'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Input, Text, TextStyles, ColorStyles, Flex, SettingIcon } from 'definixswap-uikit'
import Helper from 'uikit-dev/components/Helper'

const StyledTransactionDeadlineSetting = styled.div`
  margin-top: 4px;
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin: 16px 0;
`

const TransactionDeadlineSetting = () => {
  const { t } = useTranslation();
  const [deadline, setDeadline] = useUserDeadline()
  const [value, setValue] = useState(deadline / 60) // deadline in minutes
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseInt(inputValue, 10))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 60
      if (!Number.isNaN(rawValue) && rawValue > 0) {
        setDeadline(rawValue)
        setError(null)
      } else {
        setError('Enter a valid deadline')
      }
    } catch {
      setError('Enter a valid deadline')
    }
  }, [value, setError, setDeadline])

  return (
    <StyledTransactionDeadlineSetting>
      <Label>
        <Text textStyle={TextStyles.R_16M} color={ColorStyles.DEEPGREY} mr="S_6">{t("Transaction deadline")}</Text>
        <Helper text={t("Your transaction will revert if it is pending for more than this long.")} />
      </Label>
      <Flex alignItems="center">
        <Input
          type="number" step="1" min="1" value={value} onChange={handleChange}
          width="184px"
          endIcon={<Text fontSize="16px">Minutes</Text>}
        />
      </Flex>
      {error && (
        <Flex mt="S_12">
        <SettingIcon />
        <Text ml="5px" textStyle={TextStyles.R_14R} color={ColorStyles.RED}>
          {error}
        </Text>
      </Flex>
      )}
    </StyledTransactionDeadlineSetting>
  )
}

export default TransactionDeadlineSetting
