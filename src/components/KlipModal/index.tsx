import React from 'react'
import {
  Flex,
  Modal,
  ModalBody,
  Text,
  LogoWalletKlipIcon,
  CloseWIcon,
  IconButton,
  Box,
  ModalFooter,
  ArrowRightGIcon,
  InjectedModalProps,
} from '@fingerlabs/definixswap-uikit-v2'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

interface Props extends InjectedModalProps {
  onHide?: () => void
}

const StyledModalBody = styled(ModalBody)`
  padding: 24px;
  background-color: ${({ theme }) => theme.colors.deepbrown};
`

const WrapHeader = styled(Flex)`
  align-items: center;
  justify-content: space-between;
  padding-bottom: 22px;
`

const Title = styled(Text)`
  ${({ theme }) => theme.textStyle.R_16B}
  margin-left: 10px;
  color: ${({ theme }) => theme.colors.white};
`

const CloseButton = styled(IconButton)``

const WrapBody = styled(Flex)`
  align-items: center;
  flex-direction: column;
`

const QrBox = styled(Box)`
  width: 180px;
  height: 180px;
  background-color: white;
`

const WrapTime = styled(Flex)`
  margin-top: 20px;
  align-items: center;

  .time {
    ${({ theme }) => theme.textStyle.R_12R}
    color: ${({ theme }) => theme.colors.white80};
  }

  .interval {
    white-space: normal;
    margin-left: 8px;
    ${({ theme }) => theme.textStyle.R_12B}
    color: ${({ theme }) => theme.colors.orange};
  }
`

const DescText = styled(Text)`
  margin-top: 16px;
  ${({ theme }) => theme.textStyle.R_14R}
  color: ${({ theme }) => theme.colors.white};
`

const StyledModalFooter = styled(ModalFooter)`
  background-color: ${({ theme }) => theme.colors.white};
  padding: 24px 0;

  justify-content: center;
`

const WrapGuide = styled(Flex)`
  justify-content: center;
`

const GuideItem = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;

  img {
    width: 36px;
    height: 36px;
  }

  .text {
    margin-top: 8px;
    ${({ theme }) => theme.textStyle.R_12M}
    color: ${({ theme }) => theme.colors.black};
  }
`

const StyledArrowRightGIcon = styled(ArrowRightGIcon)`
  margin-top: 10px;
`

const GuideText = styled(Text)`
  ${({ theme }) => theme.textStyle.R_12R}
  color: ${({ theme }) => theme.colors.mediumgrey};
  margin-top: 10px;
  text-align: center;
`

const KlipModal: React.FC<Props> = ({ onDismiss, onHide }) => {
  const { t } = useTranslation()

  return (
    <Modal hideHeader noPadding>
      <StyledModalBody isBody>
        <WrapHeader>
          <Flex>
            <LogoWalletKlipIcon />
            <Title>{t('Connect to Kakao Klip via QR Code')}</Title>
          </Flex>
          <CloseButton
            onClick={() => {
              onDismiss()
              onHide && onHide()
            }}
          >
            <CloseWIcon />
          </CloseButton>
        </WrapHeader>
        <WrapBody>
          <QrBox className="klip-qr"></QrBox>
          <WrapTime>
            <Text className="time">{t('Time Remaining')}</Text>
            <Text className="interval klip-interval"></Text>
          </WrapTime>
          <DescText>{t('Scan the QR code through a QR code reader or the KakaoTalk app.')}</DescText>
        </WrapBody>
      </StyledModalBody>
      <StyledModalFooter isFooter>
        <WrapGuide>
          <GuideItem>
            <img src="./images/klip/Connect-to-KLIP-02.png" />
            <Text className="text">Open Kakaotalk</Text>
          </GuideItem>
          <StyledArrowRightGIcon />
          <GuideItem>
            <img src="./images/klip/Connect-to-KLIP-03.png" />
            <Text className="text">Open Kakaotalk</Text>
          </GuideItem>
          <StyledArrowRightGIcon />
          <GuideItem>
            <img src="./images/klip/Connect-to-KLIP-04.png" />
            <Text className="text">Open Kakaotalk</Text>
          </GuideItem>
        </WrapGuide>
        <GuideText>Klip Code Scan (from side menu) can be used</GuideText>
      </StyledModalFooter>
    </Modal>
  )
}

export default KlipModal
