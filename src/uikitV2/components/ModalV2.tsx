import { ArrowBackIosRounded, CloseRounded } from '@mui/icons-material'
import { Box, Card, IconButton, styled, Typography } from '@mui/material'
import React from 'react'
import { InjectedProps } from 'uikit-dev/widgets/Modal/types'

interface Props extends InjectedProps {
  title?: string
  hideCloseButton?: boolean
  maxWidth?: string
  maxHeight?: string
  className?: string
  onBack?: () => void
  onDismiss?: () => void
}

const CardStyle = styled(Card)`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  border-radius: 0;
  height: 100%;
  overflow: auto;

  ${({ theme }) => theme.breakpoints.up('md')} {
    margin: 24px;
    border-radius: 1rem;
    height: auto;
  }
`

const ModalV2: React.FC<Props> = ({
  title,
  children,
  hideCloseButton = false,
  maxWidth = undefined,
  maxHeight = undefined,
  className = '',
  onDismiss,
  onBack,
}) => (
  <CardStyle sx={{ maxWidth: { md: maxWidth }, maxHeight: { md: maxHeight } }} className={className}>
    <Box px={3} py="20px">
      {onBack && (
        <IconButton onClick={onBack}>
          <ArrowBackIosRounded />{' '}
        </IconButton>
      )}

      <Typography variant="h6">{title}</Typography>

      {onDismiss && !hideCloseButton && (
        <IconButton onClick={onDismiss}>
          <CloseRounded />{' '}
        </IconButton>
      )}
    </Box>

    <Box p={3} pt={0} flexGrow={1} height="calc(100% - 68px)">
      {children}
    </Box>
  </CardStyle>
)

export default ModalV2
