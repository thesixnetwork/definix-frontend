import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button } from 'definixswap-uikit'
import styled from 'styled-components'

interface ItemType {
  period: string
  amount: string
  end: string
}

interface ContentProps {
  data: ItemType[]
  onPresentUnstakeModal: () => any
}

const StyledFlex = styled(Flex)`
  flex-direction: column;
  width: 100%;
  padding: 20px 0;
  border-bottom: 1px solid #e0e0e07f;

  &:first-child {
    padding-top: 0;
  }
`

const StakeListContentMobile: React.FC<ContentProps> = ({ data, onPresentUnstakeModal }) => {
  const { t } = useTranslation()

  return (
    <>
      {data.slice(0, 3).map((item) => {
        return (
          <StyledFlex>
            <Flex mb="S_16">
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Stake Period')}
                </Text>
                <Text textStyle="R_14R" color="black">
                  {item.period}
                </Text>
              </Flex>
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Amount')}
                </Text>
                <Text textStyle="R_14R" color="black">
                  {item.amount} {t('FINIX')}
                </Text>
              </Flex>
            </Flex>

            <Flex mb="S_20" flexDirection="column">
              <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                {t('Period End')}
              </Text>
              <Flex alignItems="center">
                <Text textStyle="R_14R" color="black">
                  {item.end}
                </Text>
                <Text ml="S_8" textStyle="R_12R" color="mediumgrey">
                  {t('*Asia/Seoul')}
                </Text>
              </Flex>
            </Flex>

            <Button width="100%" variant="lightbrown" onClick={onPresentUnstakeModal}>
              {t('Unstake')}
            </Button>
          </StyledFlex>
        )
      })}
    </>
  )
}

export default StakeListContentMobile
