import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useToast } from 'state/hooks'
import Button from 'uikitV2/components/Button/Button';
import Lp from 'uikitV2/components/Coin/Lp';
import {
  Modal,
  ButtonVariants,
  Flex,
  Text,
  ColorStyles,
  ModalBody,
  ModalFooter,
} from '@fingerlabs/definixswap-uikit-v2'
import { mediaQueries, spacing } from 'uikitV2/base'

const ModalBodyWrap = styled(ModalBody)`
  margin-top: ${spacing.S_16}px;
  margin-bottom: ${spacing.S_40}px;
  width: 464px;
  ${mediaQueries.mobile} {
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
  const currentTexts = useMemo(() => {
    const textTable = {
      deposit: {
        title: 'Confirm Deposit',
        buttonName: 'Deposit',
        actionName: 'actionDeposit',
      },
      withdraw: {
        title: 'Confirm Remove',
        buttonName: 'Remove',
        actionName: 'actionRemove',
      },
    }
    return textTable[type]
  }, [type])
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
      toastSuccess(`${currentTexts.actionName} Complete`)
      goList()
    } catch (error) {
      toastError(`${currentTexts.actionName} Failed`)
    } finally {
      onDismiss()
      setIsPendingTX(false)
    }
  }, [isPendingTX, toastSuccess, toastError, onOK, onDismiss, goList, currentTexts])
  return (
    <Modal title={currentTexts.title} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Lp lpSymbols={lpSymbol.split('-')} size="32" />
            {/* <Box width={48} className="mr-s12">
              <Image src={getTokenImageUrl(tokenName)} width={48} height={48} />
            </Box> */}
            <Text ml="12px" textStyle="R_16M" color={ColorStyles.BLACK}>
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
