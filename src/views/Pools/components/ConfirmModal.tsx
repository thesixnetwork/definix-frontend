import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { getTokenImageUrl } from 'utils/getTokenImage'
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
  buttonName,
  tokenName,
  stakedBalance,
  onOK = () => null,
  onDismiss = () => null,
  goList = () => null,
}) => {
  const { t } = useTranslation()
  const { toastSuccess, toastError } = useToast()
  const [isPendingTX, setIsPendingTX] = useState(false)
  const title = useMemo(() => t(`Confirm ${buttonName}`), [t, buttonName])
  const handleComplete = useCallback(async () => {
    if (isPendingTX) return
    try {
      setIsPendingTX(true)
      await onOK()
      toastSuccess(t(`${buttonName} Complete`))
      goList()
      onDismiss()
    } catch (error) {
      toastError(t(`${buttonName} Failed`))
    } finally {
      setIsPendingTX(false)
    }
  }, [isPendingTX, toastSuccess, toastError, t, onOK, onDismiss, goList, buttonName])
  return (
    <Modal title={title} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Box width={48} className="mr-s12">
              <Image src={getTokenImageUrl(tokenName)} width={48} height={48} />
            </Box>
            <Text textStyle="R_16M" color={ColorStyles.BLACK}>
              {tokenName}
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
