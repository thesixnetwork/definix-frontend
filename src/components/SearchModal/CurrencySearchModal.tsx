import { Currency } from 'definixswap-sdk'
import { Modal, Box, ModalBody, useMatchBreakpoints } from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import React, { useMemo } from 'react'
import { CurrencySearch } from './CurrencySearch'

interface CurrencySearchModalProps {
  isOpen?: boolean;
  onDismiss?: () => void;
  selectedCurrency?: Currency | null
  onCurrencySelect: (currency: Currency) => void
  otherSelectedCurrency?: Currency | null
  // eslint-disable-next-line react/no-unused-prop-types
  showCommonBases?: boolean
}

export default function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
}: CurrencySearchModalProps) {
  const { t } = useTranslation();

  const { isXl, isXxl } = useMatchBreakpoints()
  const isMobile = useMemo(() => !isXl && !isXxl, [isXl, isXxl])

  return (
    <Modal title={t('Select a token')} mobileFull onDismiss={onDismiss}>
      <ModalBody isBody>
        <Box
          width={isMobile ? "100%" : "416px"}
          height={isMobile ? "100vh" : "auto"}
        >
          <CurrencySearch
            onCurrencySelect={onCurrencySelect}
            selectedCurrency={selectedCurrency}
            otherSelectedCurrency={otherSelectedCurrency}
            onDismiss={onDismiss}
          />
        </Box>
      </ModalBody>
    </Modal>
  )
}
