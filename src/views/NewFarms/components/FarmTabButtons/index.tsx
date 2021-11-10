import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Toggle, Flex, ColorStyles } from 'definixswap-uikit'

const FarmTabButtons = ({ stackedOnly, setStackedOnly }) => {
  const { t } = useTranslation()
  return (
    //     *AAPR = Airdrop APR supported by our partners
    <Box className="mt-s40">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Flex alignItems="center">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              {t('Staked only')}
            </Text>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
          </Flex>
          <Box>filter box</Box>
        </Flex>
        <Box>search box</Box>
      </Flex>
    </Box>
  )
}

export default FarmTabButtons
