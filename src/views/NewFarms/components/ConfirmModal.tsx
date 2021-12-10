import React from 'react'
import { getLpImageUrls } from 'utils/getTokenImage'
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
} from 'definixswap-uikit-v2'

const ConfirmModal = ({ title, lpSymbol, buttonName, stakedBalance, onOK = () => null, onDismiss = () => null }) => {
  const [firstCoinImageUrl, secondCoinImageUrl] = getLpImageUrls(lpSymbol)
  return (
    <Modal title={title} onDismiss={onDismiss}>
      <ModalBody isBody width="464px" className="mt-s16 mb-s40">
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
      </ModalBody>
      <ModalFooter isFooter>
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

      {/* <Button
        onClick={() => {
          onOK()
          onDismiss()
        }}
        fullWidth
        className="mt-5"
        radii="card"
      >
        {type}
      </Button> */}
    </Modal>
  )
}

export default ConfirmModal
