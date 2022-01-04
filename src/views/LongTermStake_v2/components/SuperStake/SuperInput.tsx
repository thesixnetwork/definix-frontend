import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import BigNumber from 'bignumber.js'
import { Flex, Text, AlertIcon, PlusIcon } from '@fingerlabs/definixswap-uikit-v2'
import styled from 'styled-components'

import { IsMobileType } from '../types'

interface SuperInputProps extends IsMobileType {
  inputFinix: string
  setInputFinix: React.Dispatch<React.SetStateAction<string>>
  inputHarvest: string
  setInputHarvest: React.Dispatch<React.SetStateAction<string>>
  error: string
  setError: React.Dispatch<React.SetStateAction<string>>
  balancefinix: number
}

const StyledInput = styled.input`
  color: ${({ theme }) => theme.colors.black};
  width: 100%;
  outline: none;
  border: 1px solid ${({ theme }) => theme.colors.lightgrey};
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  text-overflow: ellipsis;
  padding: 14px 16px;

  ${({ theme }) => theme.textStyle.R_14R}

  ::placeholder {
    color: ${({ theme }) => theme.colors.placeholder};
  }
`

const SuperInput: React.FC<SuperInputProps> = ({
  isMobile,
  inputFinix,
  setInputFinix,
  inputHarvest,
  setInputHarvest,
  error,
  setError,
  balancefinix,
}) => {
  const { t } = useTranslation()

  const onChangeBalance = (value: string) => {
    const inputRegex = RegExp(`^\\d*(?:\\\\[.])?\\d*$`)

    if (value === '' || inputRegex.test(value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))) {
      setInputFinix(value)
    }
  }

  useEffect(() => {
    if (!inputFinix || !Number(inputFinix)) {
      setError('noInput')
    } else if (new BigNumber(inputFinix).dp() > 18) {
      setError('Less than a certain amount')
    } else if (balancefinix < Number(inputFinix)) {
      setError('Insufficient balance')
    } else setError('')
  }, [balancefinix, inputFinix, setError])

  useEffect(() => {
    if (inputHarvest) setError('')
    if (!inputFinix && !inputHarvest) setError('noInput')
    if (Number(inputHarvest) <= 0) setInputHarvest('')
  }, [inputFinix, inputHarvest, setError, setInputHarvest])

  return (
    <Flex mt="S_24" flexDirection="column">
      <Flex flexDirection={isMobile ? 'column' : 'row'} justifyContent="space-between" alignItems="center">
        <Flex width="100%" flexDirection="column">
          <Flex mb="S_12" justifyContent="space-between">
            <Text textStyle="R_12R" color="mediumgrey">
              {t('From your wallet')}
            </Text>
            <Text textStyle="R_12R" color="black">
              {Math.floor(balancefinix * 100) / 100}
            </Text>
          </Flex>
          <StyledInput
            type="text"
            inputMode="decimal"
            title="Token Amount"
            placeholder="0.00"
            value={inputFinix}
            onChange={(e) => onChangeBalance(e.target.value)}
            pattern="^[0-9]*[.]?[0-9]*$"
            minLength={1}
            maxLength={79}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
          />
          {isMobile && error !== 'noInput' && !!error && (
            <Flex mt="S_8" alignItems="flex-start">
              <Flex mt="S_2">
                <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
              </Flex>
              <Text ml="S_4" textStyle="R_14R" color="red">
                {t(error)}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex mx="S_8" mb={isMobile && 'S_8'} mt={isMobile ? 'S_12' : 'S_28'}>
          <PlusIcon viewBox="0 0 16 16" width="18px" height="18px" />
        </Flex>
        <Flex width="100%" flexDirection="column">
          <Flex mb="S_12">
            <Text textStyle="R_12R" color="mediumgrey">
              {t('Pending rewards')}
            </Text>
          </Flex>
          <StyledInput
            type="text"
            inputMode="decimal"
            title="Token Amount"
            placeholder="0.00"
            value={inputHarvest}
            pattern="^[0-9]*[.]?[0-9]*$"
            minLength={1}
            maxLength={79}
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            readOnly
          />
        </Flex>
      </Flex>

      {!isMobile && error !== 'noInput' && !!error && (
        <Flex mt="S_8" alignItems="flex-start">
          <Flex mt="S_2">
            <AlertIcon viewBox="0 0 16 16" width="16px" height="16px" />
          </Flex>
          <Text ml="S_4" textStyle="R_14R" color="red">
            {t(error)}
          </Text>
        </Flex>
      )}
    </Flex>
  )
}

export default SuperInput
