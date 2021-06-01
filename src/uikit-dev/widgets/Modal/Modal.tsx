import React from 'react'
import styled from 'styled-components'
import { Text } from 'uikit-dev/components/Text'
import Flex from '../../components/Box/Flex'
import { Button, IconButton } from '../../components/Button'
import Heading from '../../components/Heading/Heading'
import { ArrowBackIcon, CloseIcon } from '../../components/Svg'
import colorStroke from '../../images/Color-stroke.png'
import { InjectedProps } from './types'

interface Props extends InjectedProps {
  title: string
  hideCloseButton?: boolean
  onBack?: () => void
  bodyPadding?: string
  isRainbow?: boolean
  classHeader?: string
  maxWidth?: string
}

const StyledModal = styled.div<{ isRainbow: boolean }>`
  background: ${({ theme }) => theme.modal.background};
  box-shadow: 0px 20px 36px -8px rgba(14, 14, 44, 0.1), 0px 1px 1px rgba(0, 0, 0, 0.05);
  border-radius: ${({ theme }) => theme.radii.default};
  width: 100%;
  z-index: ${({ theme }) => theme.zIndices.modal};
  overflow-y: auto;
  ${({ theme }) => theme.mediaQueries.xs} {
    width: auto;
    min-width: 360px;
    max-width: 100%;
  }
  position: relative;
  padding-bottom: ${({ isRainbow }) => (isRainbow ? '4px' : '0')};

  .color-stroke {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    height: 4px;
    width: 100%;
  }
`

const ModalHeader = styled.div<{ className?: string }>`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 8px 8px 8px 24px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`

const Modal: React.FC<Props> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideCloseButton = false,
  bodyPadding = '24px',
  isRainbow = true,
  classHeader = '',
  maxWidth = '',
}) => (
  <StyledModal isRainbow={isRainbow} style={{ maxWidth }}>
    <ModalHeader className={classHeader}>
      <ModalTitle>
        {onBack && (
          <Button variant="text" onClick={onBack} ml="-12px" padding="0 12px" startIcon={<ArrowBackIcon />}>
            <Text fontSize="14px" color="textSubtle">
              Back
            </Text>
          </Button>
        )}
        <Heading>{title}</Heading>
      </ModalTitle>

      {!hideCloseButton && (
        <IconButton variant="text" onClick={onDismiss} aria-label="Close the dialog">
          <CloseIcon color="primary" />
        </IconButton>
      )}
    </ModalHeader>

    <Flex flexDirection="column" p={bodyPadding}>
      {children}
    </Flex>

    {isRainbow && <img className="color-stroke" alt="" src={colorStroke} />}
  </StyledModal>
)

export default Modal
