import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Text from '../components/Text/Text'
import { Flex, FlexProps } from '../components/Box'
import { ArrowBackIcon } from '../components/Svg'
import { IconButton } from '../components/Button'
import { ModalProps } from './types'
import { CloseBIcon } from '../components/Icon'
import { spacing, mediaQueries } from '../base'

const NAV_HEIGHT_MOBILE = 56

interface BodyProps extends FlexProps {
  isBody: boolean
}

interface FooterProps extends FlexProps {
  isFooter: boolean
}

const StyledModal = styled(Flex)<{ mobileFull: boolean }>`
  flex-direction: column;
  background: #ffffff;
  border-radius: ${spacing.S_16}px;
  width: 100%;
  z-index: 100;
  overflow-y: auto;
  align-self: center;
  max-height: 100%;

  ${mediaQueries.xs} {
    width: auto;
    min-width: 300px;
  }

  ${({ mobileFull, theme }) =>
    mobileFull &&
    `
    border-radius: ${spacing.S_16}px;
    ${mediaQueries.mobile} {
      max-width: 100% !important;
      align-self: flex-start;
      flex: 1 1 auto;
      border-radius: 0;
      padding-bottom: calc(constant(safe-area-inset-bottom) + 30px);
      padding-bottom: calc(env(safe-area-inset-bottom) + 30px);
      min-height: calc(100vh - ${NAV_HEIGHT_MOBILE}px);
    }
  `}
`

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  align-items: center;
  padding: 22px 20px;

  ${mediaQueries.xs} {
    padding-left: 24px;
    padding-right: 24px;
  }
`

const ModalTitle = styled(Flex)`
  align-items: center;
  flex: 1;
`

const StyledModalBody = styled(Flex)<{ noPadding: boolean; mobileFull: boolean }>`
  position: relative;
  flex: 1;
  overflow: hidden;
  ${({ noPadding, theme }) =>
    !noPadding &&
    `
    padding: 0px 20px 24px;
    ${theme.mediaQueries.xs} {
      padding-left: 24px;
      padding-right: 24px;
      .modal-body {
        overflow: auto;
        overscroll-behavior: contain;
      }
    }
  `};

  ${({ mobileFull, theme }) =>
    mobileFull &&
    `
    ${mediaQueries.mobile} {
      flex: 4;
      .modal-body {
        max-height: initial;
      }
    }
  `}
`

const StyledModalFooter = styled(Flex)<{ noPadding: boolean; mobileFull: boolean }>`
  width: 100%;
  flex: 1;
  ${({ noPadding, theme }) =>
    !noPadding &&
    `
    padding: 0px 20px 24px;
    ${mediaQueries.xs} {
      padding-left: 24px;
      padding-right: 24px;
    }
  `};

  ${({ mobileFull, theme }) =>
    mobileFull &&
    `
    ${mediaQueries.mobile} {
      padding-bottom: calc(constant(safe-area-inset-bottom) + 30px);
      padding-bottom: calc(env(safe-area-inset-bottom) + 30px);
      flex: 1;
    }
  `}
`

const Modal: React.FC<ModalProps> = ({
  title,
  onDismiss,
  onBack,
  children,
  hideHeader = false,
  hideCloseButton = false,
  mobileFull = false,
  noPadding = false,
  maxWidth = 'initial',
}) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!modalRef.current) return
    // modalRef.current.focus();
    // const firstFocusElement = modalRef.current.querySelectorAll("input, button, a")[0];
    // (firstFocusElement as HTMLButtonElement).focus();
  }, [])

  return (
    <StyledModal ref={modalRef} mobileFull={mobileFull} maxWidth={maxWidth}>
      {!hideHeader && (
        <ModalHeader>
          <ModalTitle>
            {onBack && (
              <IconButton onClick={onBack} area-label="go back" mr="8px">
                <ArrowBackIcon />
              </IconButton>
            )}
            {title && <Text textStyle="R_18M">{title}</Text>}
          </ModalTitle>
          {!hideCloseButton && (
            <IconButton p="2px" onClick={onDismiss} aria-label="Close the dialog">
              <CloseBIcon />
            </IconButton>
          )}
        </ModalHeader>
      )}
      <StyledModalBody flexDirection="column" noPadding={noPadding} mobileFull={mobileFull}>
        {React.Children.map(children, (child: React.ReactNode) => {
          if (!React.isValidElement(child)) {
            return <></>
          }
          if (child.props.isBody) {
            return React.cloneElement(child)
          }
        })}
      </StyledModalBody>
      {React.Children.map(children, (child: React.ReactNode) => {
        if (!React.isValidElement(child)) {
          return <></>
        }
        if (child.props.isFooter) {
          return (
            <StyledModalFooter noPadding={noPadding} mobileFull={mobileFull}>
              {React.cloneElement(child)}
            </StyledModalFooter>
          )
        }
      })}
    </StyledModal>
  )
}

export const ModalBody: React.FC<BodyProps> = ({ children, ...props }) => {
  return (
    <Flex className="modal-body" position="relative" flexDirection="column" width="100%" {...props}>
      {children}
    </Flex>
  )
}

export const ModalFooter: React.FC<FooterProps> = ({ children, ...props }) => {
  return (
    <Flex
      className="modal-footer"
      position="relative"
      flexDirection="column"
      width="100%"
      justifyContent="flex-end"
      {...props}
    >
      {children}
    </Flex>
  )
}

export default Modal
