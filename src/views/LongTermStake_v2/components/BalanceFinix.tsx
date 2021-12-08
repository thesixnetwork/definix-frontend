import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, ImgTokenFinixIcon, AnountButton, AlertIcon } from 'definixswap-uikit'
import styled from 'styled-components'

import { DataType } from './types'

interface BalanceProps {
  days: number
  data: DataType[]
}

const FlexBalance = styled(Flex)`
  padding: 24px 0;
  width: 100%;
  justify-content: space-between;
`

const StyledInput = styled.input`
  ${({ theme }) => theme.textStyle.R_28M};
  color: ${({ theme }) => theme.colors.black};
  width: 95%;
  height: 40px;
  padding: 0;
  outline: none;
  border: none;
  caret-color: ${({ theme }) => theme.colors.red};

  &::placeholder {
    color: ${({ theme }) => theme.colors.mediumgrey};
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
`

const StyledAnountButton = styled(AnountButton)<{ selected: boolean }>`
  margin-right: 6px;
  color: ${({ theme, selected }) => (selected ? theme.colors.white : theme.colors.deepgrey)};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.orange : 'transparent')};
  border-color: ${({ theme, selected }) => (selected ? theme.colors.orange : theme.colors.lightgrey)};

  &:last-child {
    margin-right: 0;
  }
`

const StyledText = styled(Text)`
  margin-top: 5px;
`

const BalanceFinix: React.FC<BalanceProps> = ({ days, data }) => {
  const { t } = useTranslation()
  const [balance, setBalance] = useState<number>(1200.20002)
  const [inputBalance, setInputBalance] = useState<string>()
  const [inSufficient, setInSufficient] = useState<boolean>(false)
  const [selected, setSelected] = useState<string>('')

  const onChangeBalance = (e: React.FormEvent<HTMLInputElement>) => {
    const { value } = e.currentTarget

    setInputBalance(value)
    if (selected) setSelected('')
  }

  const onClickRate = (value: string) => {
    if (value === '25%') setInputBalance((balance * 0.25).toFixed(6))
    else if (value === '50%') setInputBalance((balance * 0.5).toFixed(6))
    else if (value === 'MAX') setInputBalance(balance.toFixed(6))

    setSelected(value)
  }

  useEffect(() => {
    const minValue = data.find((v) => v.day === days).minStake

    setInSufficient(balance < minValue)
  }, [days, data, balance])

  return (
    <>
      <FlexBalance>
        <Flex width="100%" flexDirection="column">
          <Flex mb="S_4">
            <Text mr="S_4" textStyle="R_14R" color="deepgrey">
              {t('Balance')}
            </Text>
            <Text textStyle="R_14B" color="deepgrey">
              {balance.toFixed(6)}
            </Text>
          </Flex>
          <StyledInput
            type="number"
            inputMode="decimal"
            value={inputBalance}
            onChange={onChangeBalance}
            placeholder="0"
          />
          <Flex mt="S_8" mb="S_12">
            {['25%', '50%', 'MAX'].map((value) => {
              return (
                <StyledAnountButton key={value} selected={selected === value} onClick={() => onClickRate(value)}>
                  {value}
                </StyledAnountButton>
              )
            })}
          </Flex>
          {inSufficient && (
            <Flex alignItems="center">
              <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              <Text ml="S_4" textStyle="R_14R" color="red">
                {t('Insufficient balance')}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex mt="S_16" flexDirection="column" alignItems="center">
          <ImgTokenFinixIcon viewBox="0 0 48 48" width="40px" height="40px" />
          <StyledText textStyle="R_14B" color="black">
            {t('FINIX')}
          </StyledText>
        </Flex>
      </FlexBalance>
    </>
  )
}

export default BalanceFinix
