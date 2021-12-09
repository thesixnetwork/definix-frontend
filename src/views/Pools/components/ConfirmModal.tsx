import React from 'react'
import { getTokenImageUrl } from 'utils/getTokenImage'
import { Button, Modal, ButtonVariants, Box, Flex, Text, ColorStyles, Image, ModalBody, ModalFooter } from 'definixswap-uikit-v2'

const ConfirmModal = ({ title, buttonName, tokenName, stakedBalance, onOK = () => null, onDismiss = () => null }) => {
  return (
    <Modal
      title={title}
      onDismiss={onDismiss}
      // isRainbow={false}
      // bodyPadding="0 32px 32px 32px"
      // classHeader="bd-b-n"
    >
      <ModalBody width="464px" className="mt-s16 mb-s40">
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
      </ModalBody>
      <ModalFooter>
        <Button
          onClick={() => {
            onOK()
            onDismiss()
          }}
          variant={ButtonVariants.RED}
          lg
        >
          {buttonName}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmModal
