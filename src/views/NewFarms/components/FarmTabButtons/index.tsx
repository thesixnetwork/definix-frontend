import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Box, Text, Toggle, Flex, ColorStyles, DropdownSet, SearchInput, Grid } from 'definixswap-uikit'

const FarmTabButtons = ({ stackedOnly, setStackedOnly, defaultOptionIndex, orderOptions, orderBy, search }) => {
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
    //     *AAPR = Airdrop APR supported by our partners
    <Wrap>
      <LeftSection>
        <DropdownWrap>
          <DropdownSet
            defaultIndex={defaultOptionIndex || 0}
            options={orderOptions}
            onItemClick={(index: number) => orderBy(index)}
          />
        </DropdownWrap>
        <StakedOnlyWrap ml="S_20">
          <Text textStyle="R_14R" color={ColorStyles.DEEPGREY} mr="S_8">
            {t('Staked only')}
          </Text>
          <Toggle checked={stackedOnly} onChange={() => setStackedOnly(!stackedOnly)} />
        </StakedOnlyWrap>
      </LeftSection>
      <RightSection>
        <SearchInput
          type="text"
          placeholder="Token Name"
          onSearch={(keyword) => search(keyword.trim().toLowerCase())}
          onReset={() => search('')}
        />
      </RightSection>
    </Wrap>
  )
}

export default FarmTabButtons
