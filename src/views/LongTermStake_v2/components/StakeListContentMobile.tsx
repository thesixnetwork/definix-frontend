import React from 'react'
import { useTranslation } from 'react-i18next'
import { Flex, Text, Button, Divider } from 'definixswap-uikit-v2'

interface ItemType {
  period: number
  amount: string
  end: string
}

interface ContentProps {
  data: ItemType[]
  onPresentUnstakeModal: () => any
}

const StakeListContentMobile: React.FC<ContentProps> = ({ data, onPresentUnstakeModal }) => {
  const { t } = useTranslation()

  return (
    <>
      {data.slice(0, 3).map((item) => {
        return (
          <Flex flexDirection="column" width="100%" key={item.end}>
            <Flex mb="S_16">
              <Flex width="50%" flexDirection="column">
                <Text mb="S_2" textStyle="R_12R" color="mediumgrey">
                  {t('Stake Period')}
                </Text>
                <Text textStyle="R_14R" color="black">
                  {item.period} {t('days')}
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
              {t('Early Unstake')}
            </Button>

            <Divider my="S_20" width="100%" backgroundColor="lightGrey50" />
          </Flex>
        )
      })}
    </>
  )
}

export default StakeListContentMobile