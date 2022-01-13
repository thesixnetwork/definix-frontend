import React, { useState, useCallback, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import {
  Modal,
  ModalBody,
  ModalFooter,
  Flex,
  Coin,
  Text,
  CheckBIcon,
  AnountButton,
} from '@fingerlabs/definixswap-uikit-v2'
import NumericalInput from 'components/NumericalInput'

const ModalBodyWrap = styled(ModalBody)`
  margin-top: ${({ theme }) => theme.spacing.S_16}px;
  margin-bottom: ${({ theme }) => theme.spacing.S_40}px;
  width: 464px;
  ${({ theme }) => theme.mediaQueries.mobile} {
    width: 100%;
  }
`

const StyledAnountButton = styled(AnountButton)`
  margin-left: ${({ theme }) => theme.spacing.S_6}px;
  background: ${({ theme }) => rgba(theme.colors.lightgrey, 0.3)};
`

const VoteModal = ({
  onDismiss = () => null,
}) => {
  const { t } = useTranslation();
  const [value, setValue] = useState();
  return (
    <Modal title={t('Voting')} onDismiss={onDismiss} mobileFull>
      <ModalBodyWrap isBody>
        <Flex flexDirection="column">
          <Flex alignItems="center">
            <Coin symbol="VFINIX" size="40px" />
            <Flex flexDirection="column" ml="16px">
              <Text textStyle="R_14R" color="mediumgrey">{t('Balance')}</Text>
              <Flex mt="2px" alignItems="flex-end">
                <Text textStyle="R_20M" color="black">3123123</Text>
                <Text textStyle="R_14R" color="black" ml="6px">{t('vFINIX')}</Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex flexDirection="column" mt="14px">
          <Flex flexDirection="column" pt="32px">
            <Flex alignItems="center">
              <CheckBIcon />
              <Text ml="8px" textStyle="R_14R" color="deepgrey">Yes, agree with you</Text>
            </Flex>
            <NumericalInput
              value={value}
              onUserInput={() => {
                console.log('onUserInput')
              })}
            />
            <div className="flex align-center justify-end">
              <StyledAnountButton onClick={() => console.log('25')}>25%</StyledAnountButton>
              <StyledAnountButton onClick={() => console.log('25')}>50%</StyledAnountButton>
              <StyledAnountButton onClick={() => console.log('25')}>MAX</StyledAnountButton>
            </div>
          </Flex>
        </Flex>
      </ModalBodyWrap>
      <ModalFooter isFooter>
        {/* <Button lg variant={ButtonVariants.RED} isLoading={isPendingTX} onClick={handleComplete}>
          {currentTexts.buttonName}
        </Button> */}
      </ModalFooter>
    </Modal>
  )
}

export default VoteModal
