import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Box } from 'definixswap-uikit'
import styled from 'styled-components'

import ImgTokenFinix from '../../../assets/images/img-token-finix.png'
import ImgTokenFinix2x from '../../../assets/images/img-token-finix@2x.png'
import ImgTokenFinix3x from '../../../assets/images/img-token-finix@3x.png'
import IconAlert from '../../../assets/images/ico-16-alert.png'
import IconAlert2x from '../../../assets/images/ico-16-alert@2x.png'
import IconAlert3x from '../../../assets/images/ico-16-alert@3x.png'

import { IsMobileType, DataType } from './types'

interface BalanceProps extends IsMobileType {
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

const BoxRate = styled(Box)<{ selected: boolean }>`
  padding: 3px 10px;
  margin-right: 6px;
  border-radius: 13px;
  border-width: 1px;
  border-style: solid;
  border-color: ${({ theme, selected }) => (selected ? theme.colors.orange : theme.colors.lightgrey)};
  cursor: pointer;
  background-color: ${({ theme, selected }) => (selected ? theme.colors.orange : 'none')};

  &:last-child {
    margin-right: 0;
  }
`

const BalanceFinix: React.FC<BalanceProps> = ({ isMobile, days, data }) => {
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
                <BoxRate selected={selected === value} onClick={() => onClickRate(value)}>
                  <Text textStyle="R_14R" color={`${selected === value ? 'white' : 'deepgrey'}`}>
                    {value}
                  </Text>
                </BoxRate>
              )
            })}
          </Flex>
          {inSufficient && (
            <Flex alignItems="center">
              <img
                width={16}
                height={16}
                src={IconAlert}
                srcSet={`${IconAlert2x} 2x, ${IconAlert3x} 3x`}
                alt="Icon-Alert"
              />
              <Text ml="S_4" textStyle="R_14R" color="red">
                {t('Insufficient balance')}
              </Text>
            </Flex>
          )}
        </Flex>
        <Flex mt="S_16" flexDirection="column" alignItems="center">
          <img
            style={{ marginBottom: '5px' }}
            width={40}
            height={40}
            src={ImgTokenFinix}
            srcSet={`${ImgTokenFinix2x} 2x, ${ImgTokenFinix3x} 3x`}
            alt="Token-Finix"
          />
          <Text textStyle="R_14B" color="black">
            {t('FINIX')}
          </Text>
        </Flex>
      </FlexBalance>
    </>
  )
}

export default BalanceFinix
