import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { useLocation } from 'react-router-dom'
import { Flex, Text, ImgTokenFinixIcon, AnountButton, AlertIcon } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

interface BalanceProps {
  hasAccount: boolean
  minimum: number
  inputBalance: string
  setInputBalance: React.Dispatch<React.SetStateAction<string>>
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  balancefinix: number
}

const FlexBalance = styled(Flex)`
  padding: 24px 0;
  width: 100%;
  justify-content: space-between;
`

const StyledInput = styled.input`
  color: ${({ theme }) => theme.colors.black};
  width: 100%;
  outline: none;
  border: none;
  background-color: transparent;
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 0 20px 0 0;

  ${({ theme }) => theme.textStyle.R_28M}
  ${({ theme }) => theme.mediaQueries.mobile} {
    ${({ theme }) => theme.textStyle.R_23M}
  }

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`

const StyledAnountButton = styled(AnountButton)<{ $selected: boolean }>`
  margin-right: 6px;
  /* color: ${({ theme, $selected }) => ($selected ? theme.colors.white : theme.colors.deepgrey)};
  background-color: ${({ theme, $selected }) => ($selected ? theme.colors.orange : 'transparent')};
  border-color: ${({ theme, $selected }) => ($selected ? theme.colors.orange : theme.colors.lightgrey)}; */

  &:last-child {
    margin-right: 0;
  }
`

const StyledText = styled(Text)`
  margin-top: 5px;
`

const BalanceFinix: React.FC<BalanceProps> = ({
  hasAccount,
  minimum,
  inputBalance,
  setInputBalance,
  error,
  setError,
  balancefinix,
}) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<number>(0)
  const { pathname } = useLocation()

  const onChangeBalance = (value: string) => {
    const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

    if (value === '' || inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      setInputBalance(value)
    }

    if (selected) setSelected(0)
  }

  const onClickRate = (rate: number) => {
    setInputBalance(String(balancefinix * rate))
    setSelected(rate)
  }

  useEffect(() => {
    if (pathname === '/super-stake') {
      if (!inputBalance) setError('noInput')
      else setError('')
      return
    }

    if (!inputBalance) {
      setError('noInput')
    } else if (new BigNumber(inputBalance).dp() > 18) {
      setError('Less than a certain amount')
    } else if (Number(inputBalance) < minimum) {
      setError('The amount of FINIX')
    } else if (balancefinix < Number(inputBalance)) {
      setError('Insufficient balance')
    } else setError('')
  }, [minimum, balancefinix, inputBalance, setError, pathname])

  useEffect(() => {
    if (!hasAccount) {
      setInputBalance('')
      setSelected(0)
    }
  }, [hasAccount, setInputBalance, setSelected])

  return (
    <>
      <FlexBalance>
        <Flex width="100%" flexDirection="column">
          <Flex mb="S_4">
            <Text mr="S_4" textStyle="R_14R" color="deepgrey">
              {t('Balance')}
            </Text>
            <Text textStyle="R_14B" color="deepgrey">
              {hasAccount ? Math.floor(balancefinix * 1000000) / 1000000 : 0}
            </Text>
          </Flex>
          <StyledInput
            type="text"
            inputMode="decimal"
            title="Token Amount"
            placeholder="0"
            value={inputBalance}
            onChange={(e) => onChangeBalance(e.target.value)}
            pattern="^[0-9]*[.]?[0-9]*$"
            minLength={1}
            maxLength={79}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          <Flex mt="S_8" mb="S_12">
            <StyledAnountButton $selected={selected === 0.25} onClick={() => onClickRate(0.25)}>
              25%
            </StyledAnountButton>
            <StyledAnountButton $selected={selected === 0.5} onClick={() => onClickRate(0.5)}>
              50%
            </StyledAnountButton>
            <StyledAnountButton $selected={selected === 1} onClick={() => onClickRate(1)}>
              {t('MAX')}
            </StyledAnountButton>
          </Flex>
          {error !== 'noInput' && !!error && (
            <Flex alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red">
                {t(error)}
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
