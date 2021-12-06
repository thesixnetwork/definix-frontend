import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Box, Text, Toggle, Flex, ColorStyles, DropdownSet, SearchInput, useMatchBreakpoints } from 'definixswap-uikit'

const PoolFilter = ({
  stackedOnly,
  setStackedOnly,
  liveOnly,
  setLiveOnly,
  defaultOptionIndex,
  orderOptions,
  orderBy,
  search,
}) => {
  const { t } = useTranslation()
  const { isMaxXl } = useMatchBreakpoints()

  const ToggleSection = styled(Flex)`
    align-items: center;
    justify-content: flex-end;
  `
  const DropdownSection = () => (
    <DropdownSet
      defaultIndex={defaultOptionIndex || 0}
      options={orderOptions}
      onItemClick={(index: number) => orderBy(index)}
    />
  )
  const StakedOnlySection = () => (
    <>
      <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
        {t('Staked only Pools')}
      </Text>
      <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
    </>
  )
  const LiveOnlySection = () => (
    <>
      <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
        {t('Finished pool')}
      </Text>
      <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
    </>
  )

  if (isMaxXl) {
    return (
      <Flex flexDirection="column">
        <Flex alignItems="center">
          <ToggleSection>
            <StakedOnlySection />
          </ToggleSection>
          <ToggleSection ml="S_20">
            <LiveOnlySection />
          </ToggleSection>
        </Flex>
        <Flex mt="S_12">
          <Box minWidth={128} mr="S_6">
            <DropdownSection />
          </Box>
          <SearchInput
            type="text"
            placeholder={t('Token name')}
            onSearch={(keyword) => search(keyword.trim().toLowerCase())}
            onReset={() => search('')}
          />
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="row" justifyContent="space-between">
      <Flex justifyContent="space-between" alignItems="center">
        <Box width={128}>
          <DropdownSection />
        </Box>
        <ToggleSection ml="S_24">
          <StakedOnlySection />
        </ToggleSection>
        <ToggleSection ml="S_24">
          <LiveOnlySection />
        </ToggleSection>
      </Flex>
      <Box>
        <SearchInput
          type="text"
          placeholder={t('Token name')}
          onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          onReset={() => search('')}
        />
      </Box>
    </Flex>
  )
}

export default PoolFilter
