import useUserSlippageTolerance from 'hooks/useUserSlippageTolerance'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Button, ColorStyles, Flex, Helper, Input, SettingIcon, Text, TextStyles } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'

const MAX_SLIPPAGE = 5000
const RISKY_SLIPPAGE_LOW = 50
const RISKY_SLIPPAGE_HIGH = 500

const StyledSlippageToleranceSettings = styled.div`
  margin-bottom: 24px;
`

const Option = styled.div`
  padding: 0 4px;
`

const Options = styled.div`
  align-items: strech;
  display: flex;
  flex-direction: column;

  ${Option}:first-child {
    padding-left: 0;
  }

  ${Option}:last-child {
    padding-right: 0;
  }

  > :last-child {
    padding-top: 1rem;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;

    > :last-child {
      padding-top: 0;
    }
  }
`

const Label = styled.div`
  align-items: center;
  display: flex;
  margin: 16px 0;
`

const predefinedValues = [
  { label: '0.1%', value: 0.1 },
  { label: '0.5%', value: 0.5 },
  { label: '1%', value: 1 },
]

const SlippageToleranceSettings = () => {
  const { t } = useTranslation()
  const [userSlippageTolerance, setUserslippageTolerance] = useUserSlippageTolerance()
  const [value, setValue] = useState(userSlippageTolerance / 100)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputValue } = evt.target
    setValue(parseFloat(inputValue))
  }

  // Updates local storage if value is valid
  useEffect(() => {
    try {
      const rawValue = value * 100
      if (!Number.isNaN(rawValue) && rawValue > 0 && rawValue < MAX_SLIPPAGE) {
        setUserslippageTolerance(rawValue)
        setError(null)
      } else {
        setError('Enter a valid slippage percentage')
      }
    } catch {
      setError('Enter a valid slippage percentage')
    }
  }, [value, setError, setUserslippageTolerance])

  // Notify user if slippage is risky
  useEffect(() => {
    if (userSlippageTolerance < RISKY_SLIPPAGE_LOW) {
      setError('Your transaction may fail')
    } else if (userSlippageTolerance > RISKY_SLIPPAGE_HIGH) {
      setError('Your transaction may be frontrun')
    }
  }, [userSlippageTolerance, setError])

  return (
    <StyledSlippageToleranceSettings>
      <Label>
        <Text textStyle={TextStyles.R_16M} color={ColorStyles.DEEPGREY} mr="S_6">
          {t('Slippage tolerance')}
        </Text>
        <Helper
          text={t('Your transaction will revert if the price changes unfavorably by more than this percentage.')}
        />
      </Label>
      <Options>
        <Flex mb={['8px', 0]} mr={[0, '8px']}>
          {predefinedValues.map(({ label, value: predefinedValue }) => {
            const handleClick = () => setValue(predefinedValue)

            return (
              <Option key={predefinedValue}>
                <Button
                  width="88px"
                  md
                  variant={value === predefinedValue ? 'red' : 'lightbrown'}
                  onClick={handleClick}
                >
                  {label}
                </Button>
              </Option>
            )
          })}
        </Flex>
        <Flex alignItems="center">
          <Input
            type="number"
            step={0.1}
            min={0.1}
            placeholder="5%"
            value={value}
            onChange={handleChange}
            isWarning={error !== null}
            width="154px"
            endIcon={<Text fontSize="16px">%</Text>}
          />
        </Flex>
      </Options>
      {error && (
        <Flex mt="S_12">
          <SettingIcon />
          <Text ml="5px" textStyle={TextStyles.R_14R} color={ColorStyles.RED}>
            {error}
          </Text>
        </Flex>
      )}
    </StyledSlippageToleranceSettings>
  )
}

export default SlippageToleranceSettings
