import React from 'react'
import { useTranslation } from 'react-i18next'
import { Box, Text, Toggle, Flex, ColorStyles, DropdownSet, SearchInput } from 'definixswap-uikit'

const PoolTabButtons = ({
  stackedOnly,
  setStackedOnly,
  liveOnly,
  setLiveOnly,
  defaultOptionIndex,
  orderOptions,
  orderBy,
  search
}) => {
  const { t } = useTranslation()
  return (
    <Box className="mt-s40">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex>
          <DropdownSet
            defaultIndex={defaultOptionIndex || 0}
            options={orderOptions}
            onItemClick={(index: number) => orderBy(index)}
          />

          <Flex alignItems="center" className="mx-s24">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              {t('Staked only')}
            </Text>
            <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
          </Flex>

          <Flex alignItems="center">
            <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
              Finished
            </Text>
            <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
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

export default PoolTabButtons
