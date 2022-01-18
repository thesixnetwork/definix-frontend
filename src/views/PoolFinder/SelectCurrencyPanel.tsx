import { Coin, ColorStyles, Flex, useModal, Text, Box, ArrowBottomGIcon } from '@fingerlabs/definixswap-uikit-v2';
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal';
import React from 'react'
import { useTranslation } from 'react-i18next';

const SelectCurrencyPanel = React.memo(({currency, onCurrencySelect, handleSearchDismiss}: any) => {
  const { t } = useTranslation();

  const [onPresentCurrencySearchModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={onCurrencySelect}
      onDismiss={handleSearchDismiss}
      selectedCurrency={currency}
    />
  , false)

  return (
    <Flex
      position="relative"
      height="48px"
      borderRadius="8px"
      border="1px solid"
      borderColor={ColorStyles.LIGHTGREY}
      onClick={onPresentCurrencySearchModal}
      justifyContent="center"
      alignItems="center"
      style={{ cursor: 'pointer' }}
    >
      {currency ? (
        <>
          <Flex>
            <Coin symbol={currency.symbol} size="32px" />
            <Text ml="10px" textStyle="R_16M" color={ColorStyles.BLACK} style={{ alignSelf: 'center' }}>
              {currency.symbol}
            </Text>
          </Flex>
        </>
      ) : (
        <Text textStyle="R_14M" color={ColorStyles.MEDIUMGREY}>
          {t('Select a token')}
        </Text>
      )}
      <Box position="absolute" right="20px">
        <ArrowBottomGIcon />
      </Box>
    </Flex>
  )
});

export default SelectCurrencyPanel;