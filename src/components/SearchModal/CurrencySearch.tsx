import { Currency, ETHER, Token } from 'definixswap-sdk'
import React, { KeyboardEvent, RefObject, useCallback, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Box, Flex, SearchIcon } from '@fingerlabs/definixswap-uikit-v2'
import { useAllTokens, useToken } from '../../hooks/Tokens'
import { isAddress } from '../../utils'
import CurrencyList from './CurrencyList'
import { filterTokens } from './filtering'
import { useTokenComparator } from './sorting'
import { SearchInput } from './styleds'

interface CurrencySearchProps {
  onDismiss: () => void
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
}

const SearchInputWithIcon = styled(Box)`
  position: relative;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  svg {
    position: absolute;
    right: 12px;
    width: 16px;
    height: 16px;
  }
  input {
    padding-right: 46px;
  }
`

const WrapCurrencyList = styled(Flex)<{ listLength: number }>`
  flex-direction: column;
  height: ${({ listLength }) => listLength * 60}px;
  margin-top: 20px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    height: auto;
    flex: 1;
  }
`

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  onDismiss,
}: CurrencySearchProps) {
  const { t } = useTranslation()

  const [searchQuery, setSearchQuery] = useState<string>('')
  const allTokens = useAllTokens()

  // if they input an address, use it
  const isAddressSearch = useMemo(() => isAddress(searchQuery), [searchQuery])
  const searchToken = useToken(searchQuery)

  const showETH: boolean = useMemo(() => {
    const s = searchQuery.toLowerCase().trim()
    return s === '' || s === 'k' || s === 'kl' || s === 'kla' || s === 'klay'
    // return s === '' || s === 'e' || s === 'et' || s === 'eth'
  }, [searchQuery])

  const tokenComparator = useTokenComparator(false)

  const filteredTokens: Token[] = useMemo(() => {
    if (isAddressSearch) return searchToken ? [searchToken] : []
    return filterTokens(Object.values(allTokens), searchQuery)
  }, [isAddressSearch, searchToken, allTokens, searchQuery])

  const filteredSortedTokens: Token[] = useMemo(() => {
    if (searchToken) return [searchToken]
    const sorted = filteredTokens.sort(tokenComparator)
    const symbolMatch = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((s) => s.length > 0)
    if (symbolMatch.length > 1) return sorted

    return [
      ...(searchToken ? [searchToken] : []),
      // sort any exact symbol matches first
      ...sorted.filter((token) => token.symbol?.toLowerCase() === symbolMatch[0]),
      ...sorted.filter((token) => token.symbol?.toLowerCase() !== symbolMatch[0]),
    ]
  }, [filteredTokens, searchQuery, searchToken, tokenComparator])

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency)
      onDismiss()
    },
    [onDismiss, onCurrencySelect] // , audioPlay]
  )

  // manage focus on modal show
  const inputRef = useRef<HTMLInputElement>()
  const handleInput = useCallback((event) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = searchQuery.toLowerCase().trim()
        if (s === 'eth') {
          handleCurrencySelect(ETHER)
        } else if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === searchQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            handleCurrencySelect(filteredSortedTokens[0])
          }
        }
      }
    },
    [filteredSortedTokens, handleCurrencySelect, searchQuery]
  )

  const currencies = useMemo(() => (showETH ? [Currency.ETHER, ...filteredSortedTokens] : [...filteredSortedTokens]), [
    filteredSortedTokens,
    showETH,
  ])

  return (
    <Flex flexDirection="column" height="100%">
      <SearchInputWithIcon>
        <SearchInput
          type="text"
          id="token-search-input"
          placeholder={t('Search token name or address')}
          value={searchQuery}
          ref={inputRef as RefObject<HTMLInputElement>}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
        <SearchIcon />
      </SearchInputWithIcon>

      <WrapCurrencyList listLength={Object.keys(allTokens).length + 1}>
        {currencies.length > 0 && (
          <CurrencyList
            currencies={currencies}
            onCurrencySelect={handleCurrencySelect}
            otherCurrency={otherSelectedCurrency}
            selectedCurrency={selectedCurrency}
          />
        )}
        {currencies.length <= 0 && (
          <Flex mt="-20px" height="100%" alignItems="center" justifyContent="center">
            {t('No search results')}
          </Flex>
        )}
      </WrapCurrencyList>
    </Flex>
  )
}

export default CurrencySearch
