import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, Divider } from 'definixswap-uikit'
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
  align-items: center;
  width: 100%;
  padding: 16px 0;
`

const StakeListContentPc: React.FC<ContentProps> = ({ data, onPresentUnstakeModal }) => {
  const { t } = useTranslation()

  return (
    <>
      {data.map((item) => {
        return (
          <>
            <StyledFlex>
              <Text width="20%" textStyle="R_14R" color="black">
                {item.period} {t('days')}
              </Text>
              <Text width="20%" textStyle="R_14R" color="black">
                {item.amount}
              </Text>
              <Flex width="60%" justifyContent="space-between">
                <Flex flexDirection="column" justifyContent="center">
                  <Text textStyle="R_14R" color="black">
                    {item.end}
                  </Text>
                  <Text textStyle="R_12R" color="mediumgrey">
                    {t('*Asia/Seoul')}
                  </Text>
                </Flex>
                <Button width="128px" variant="lightbrown" onClick={onPresentUnstakeModal}>
                  {t('Early Unstake')}
                </Button>
              </Flex>
            </StyledFlex>
            <Divider width="100%" backgroundColor="lightGrey50" />
          </>
        )
      })}
    </>
  )
}

export default StakeListContentPc
