import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text } from 'definixswap-uikit'
import styled from 'styled-components'

import { DataType } from './types'

interface AprButtonProps {
  days: string
  setDays: React.Dispatch<React.SetStateAction<string>>
  data: DataType[]
}

const FlexVFinix = styled(Flex)`
  width: calc(100% / 3);
  flex-direction: column;
  margin-right: 12px;

  &:last-child {
    margin-right: 0;
  }
`

const FlexDays = styled(Flex)<{ focus: boolean }>`
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px 0;
  border-radius: 8px;
  background-color: ${({ theme, focus }) => (focus ? theme.colors.orange : theme.colors.lightbrown)};
  box-shadow: ${({ focus }) => focus && '0 8px 10px 0 rgba(255, 104, 40, 0.19)'};
  cursor: pointer;
`

const FlexApr = styled(Flex)`
  justify-content: space-between;
  padding-top: 20px;
`

const TextApr = styled(Text)`
  margin-bottom: 4px;

  &:last-child {
    margin-bottom: 0;
  }
`

const AprButtonMobile: React.FC<AprButtonProps> = ({ days, setDays, data }) => {
  const { t } = useTranslation()
  const [focusDays, setFocusDays] = useState<DataType>(data.find((item) => item.day === days))

  useEffect(() => {
    setFocusDays(data.find((item) => item.day === days))
  }, [days, data])

  return (
    <>
      <Flex mb="S_24" width="100%" flexDirection="column">
        <Flex width="100%">
          {data.map((item) => {
            return (
              <FlexVFinix>
                <FlexDays focus={days === item.day} onClick={() => setDays(item.day)}>
                  <Text width="100%" textAlign="center" textStyle="R_14M" color="white">
                    {item.day}
                  </Text>
                </FlexDays>
              </FlexVFinix>
            )
          })}
        </Flex>

        <FlexApr>
          <Flex flexDirection="column">
            <TextApr textStyle="R_14R" color="mediumgrey">
              {t('APR')}
            </TextApr>
            <TextApr textStyle="R_14R" color="mediumgrey">
              {t('Minimum stake')}
            </TextApr>
            <TextApr textStyle="R_14R" color="mediumgrey">
              {t('vFINIX Multiples')}
            </TextApr>
          </Flex>
          <Flex flexDirection="column" alignItems="flex-end">
            <TextApr textStyle="R_14B" color="black">
              {focusDays.apr}%
            </TextApr>
            <TextApr textStyle="R_14B" color="black">
              {focusDays.minStake} {t('FINIX')}
            </TextApr>
            <TextApr textStyle="R_14B" color="red">
              {focusDays.multiple}
            </TextApr>
          </Flex>
        </FlexApr>
      </Flex>
    </>
  )
}

export default AprButtonMobile
