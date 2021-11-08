import React from 'react'
import { Button, Modal, ButtonVariants, ButtonScales, Box, Flex, Text, ColorStyles } from 'definixswap-uikit'

const ConfirmModal = ({ title, buttonName, tokenName, stakedBalance, onOK = () => null, onDismiss = () => null }) => {
  return (
    <Modal
      title={title}
      mobileFull
      onDismiss={onDismiss}
      // isRainbow={false}
      // bodyPadding="0 32px 32px 32px"
      // classHeader="bd-b-n"
    >
      <Box width="464px" className="mt-s16 mb-s40">
        <Flex justifyContent="space-between">
          <Text textStyle="R_16M" color={ColorStyles.BLACK}>
            {tokenName}
          </Text>
          <Text textStyle="R_16R" color={ColorStyles.BLACK}>
            {stakedBalance}
          </Text>
        </Flex>
      </Box>
      <Button
        onClick={() => {
          onOK()
          onDismiss()
        }}
        variant={ButtonVariants.RED}
        scale={ButtonScales.S_48}
      >
        {buttonName}
      </Button>
    </Modal>
  )
}

export default ConfirmModal
