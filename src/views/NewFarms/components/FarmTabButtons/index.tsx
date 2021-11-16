import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Toggle, Flex, ColorStyles, DropdownSet, SearchInput } from 'definixswap-uikit'

const FarmTabButtons = ({ stackedOnly, setStackedOnly, defaultOptionIndex, orderOptions, orderBy, search }) => {
  const { t } = useTranslation()
  return (
    //     *AAPR = Airdrop APR supported by our partners
    <Box className="mt-s40">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <DropdownSet
            defaultIndex={defaultOptionIndex || 0}
            options={orderOptions}
            onItemClick={(index: number) => orderBy(index)}
          />
          <Flex alignItems="center" className="ml-s20">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              {t('Staked only')}
            </Text>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
          </Flex>
        </Flex>
        <Box>
          <SearchInput
            type="text"
            placeholder="Token Name"
            onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          />
        </Box>
      </Flex>
    </Box>
  )
}

export default FarmTabButtons
