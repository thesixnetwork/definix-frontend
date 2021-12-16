import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getLpImageUrls } from 'utils/getTokenImage'
import { useToast } from 'state/hooks'
import {
  Button,
  Modal,
  ButtonVariants,
  Box,
  Flex,
  Text,
  ColorStyles,
  Image,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'

const ModalBodyWrap = styled(ModalBody)`
  margin-top: ${({ theme }) => theme.spacing.S_16}px;
  margin-bottom: ${({ theme }) => theme.spacing.S_40}px;
  width: 464px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
  }
`

const ConfirmModal = ({
  lpSymbol,
  buttonName,
  stakedBalance,
  onOK = () => null,
  onDismiss = () => null,
  goList = () => null,
}) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const [isPendingTX, setIsPendingTX] = useState(false)
  const [firstCoinImageUrl, secondCoinImageUrl] = getLpImageUrls(lpSymbol)
  const title = useMemo(() => t(`Confirm ${buttonName}`), [t, buttonName])
  const handleComplete = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onOK()
      toastSuccess(t('{{Action}} Complete', { Action: buttonName }))
      goList()
      onDismiss()
    } catch (error) {
      toastError(t('{{Action}} Failed', { Action: buttonName }))
    } finally {
      setIsPendingTX(false)
    }
  }, [isPendingTX, toastSuccess, toastError, t, onOK, onDismiss, goList, buttonName])

  return (
    <Modal title={title} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Flex className="mr-s12">
              <Box width={32} style={{ zIndex: 1 }}>
                <Image src={firstCoinImageUrl} alt={lpSymbol} width={32} height={32} />
              </Box>
              <Box width={32} style={{ marginLeft: '-10px' }}>
                <Image src={secondCoinImageUrl} alt={lpSymbol} width={32} height={32} />
              </Box>
            </Flex>
            <Text textStyle="R_16M" color={ColorStyles.BLACK}>
              {lpSymbol}
            </Text>
          </Flex>
          <Text textStyle="R_16R" color={ColorStyles.BLACK}>
            {stakedBalance}
          </Text>
        </Flex>
      </ModalBodyWrap>
      <ModalFooter isFooter>
        <Button lg variant={ButtonVariants.RED} isLoading={isPendingTX} onClick={handleComplete}>
          {t(buttonName)}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal
