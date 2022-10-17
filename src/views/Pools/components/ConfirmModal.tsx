import React, { useState, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useToast } from 'state/hooks'
import { Flex, Text, ModalBody, ModalFooter } from '@fingerlabs/definixswap-uikit-v2'
import { mediaQueries, spacing } from 'uikitV2/base'
import { textStyle } from 'uikitV2/text'
import ModalV2 from 'uikitV2/components/ModalV2'
import { Button } from '@mui/material'
import Coin from 'uikitV2/components/Coin'

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
  tokenName,
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
    <ModalV2 title={currentTexts.title} onDismiss={onDismiss}>
      <ModalBodyWrap isBody>
        <Flex justifyContent="space-between" alignItems="center">
          <Flex alignItems="center">
            <Coin symbol={tokenName} size={48} />
            {/* <Box width={48} className="mr-s12">
              <Image src={getTokenImageUrl(tokenName)} width={48} height={48} />
            </Box> */}
            <Text style={{ ...textStyle.R_16M, marginLeft: 12 }} color="#222">
              {tokenName}
            </Text>
          </Flex>
          <Text style={textStyle.R_16R} color="#222">
            {stakedBalance}
          </Text>
        </Flex>
      </ModalBodyWrap>
      <ModalFooter isFooter>
        <Button variant="contained" color="error" disabled={isPendingTX} onClick={handleComplete}>
          {currentTexts.buttonName}
        </Button>
      </ModalFooter>
    </ModalV2>
  )
}

export default ConfirmModal
