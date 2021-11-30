import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Box, Text, Toggle, Flex, ColorStyles, DropdownSet, SearchInput } from 'definixswap-uikit'

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

  const Wrap = styled(Flex)`
    flex-direction: row;
    justify-content: space-between;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      flex-direction: column;
    }
  `
  const LeftSection = styled(Flex)`
    align-items: center;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      justify-content: space-between;
    }
  `
  const DropdownWrap = styled(Box)`
    width: 128px;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      width: 50%;
    }
  `
  const StakedOnlyWrap = styled(Flex)`
    align-items: center;
    margin-left: ${({ theme }) => theme.spacing.S_20}px;
    white-space: nowrap;
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      width: 50%;
      justify-content: flex-end;
    }
  `
  const RightSection = styled(Box)`
    ${({ theme }) => theme.mediaQueries.mobileXl} {
      margin-top: ${({ theme }) => theme.spacing.S_12}px;
    }
  `

  return (
    <Wrap>
      <LeftSection>
        <DropdownWrap>
          <DropdownSet
            defaultIndex={defaultOptionIndex || 0}
            options={orderOptions}
            onItemClick={(index: number) => orderBy(index)}
          />
        </DropdownWrap>

        <StakedOnlyWrap>
          <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
            {t('View Finished Pools')}
          </Text>
          <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        </StakedOnlyWrap>

        {/* <Flex alignItems="center">
          <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} className="mr-s8">
            Finished
          </Text>
          <Toggle checked={!liveOnly} onChange={() => setLiveOnly(!liveOnly)} />
        </Flex> */}
      </LeftSection>
      <RightSection>
        <SearchInput
          type="text"
          placeholder={t('Token name')}
          onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          onReset={() => search('')}
        />
      </RightSection>
    </Wrap>
  )
}

export default PoolFilter
