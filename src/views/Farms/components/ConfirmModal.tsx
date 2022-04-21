import React, { useState, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useToast } from 'state/hooks'
import {
  Button,
  Modal,
  ButtonVariants,
  Flex,
  Text,
  ColorStyles,
  ModalBody,
  ModalFooter,
  Lp,
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
  type,
  lpSymbol,
  stakedBalance,
  onOK = () => null,
  onDismiss = () => null,
  goList = () => null,
}) => {
  const { t } = useTranslation()
  const currentTexts = useMemo(() => {
    const textTable = {
      deposit: {
        title: t('Confirm Deposit'),
        buttonName: t('Deposit'),
        actionName: t('actionDeposit'),
      },
      withdraw: {
        title: t('Confirm Remove'),
        buttonName: t('Remove'),
        actionName: t('actionRemove'),
      },
    }
    return textTable[type]
  }, [t, type])
  const { toastSuccess, toastError } = useToast()
  const [isPendingTX, setIsPendingTX] = useState(false)
  const handleComplete = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      const tx = await onOK()
      if (!tx || tx === null) {
        throw new Error()
      }
      toastSuccess(t('{{Action}} Complete', { Action: currentTexts.actionName }))
      goList()
    } catch (error) {
      toastError(t('{{Action}} Failed', { Action: currentTexts.actionName }))
    } finally {
      onDismiss()
      setIsPendingTX(false)
    }
  }, [isPendingTX, toastSuccess, toastError, t, onOK, onDismiss, goList, currentTexts])

  return (
    <Modal title={currentTexts.title} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Flex className="mr-s12">
              <Lp lpSymbols={lpSymbol.split('-')} size="32" />
              {/* <Box width={32} style={{ zIndex: 1 }}>
                <Image src={firstCoinImageUrl} alt={lpSymbol} width={32} height={32} />
              </Box>
              <Box width={32} style={{ marginLeft: '-10px' }}>
                <Image src={secondCoinImageUrl} alt={lpSymbol} width={32} height={32} />
              </Box> */}
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
          {currentTexts.buttonName}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal