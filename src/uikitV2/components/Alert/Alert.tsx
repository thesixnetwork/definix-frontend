import React from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { CheckCompleteIcon, CheckFailedIcon, SmallCloseIcon } from '../Icon'
import { Text } from '../Text'
import { IconButton } from '../Button'
import Box from '../Box/Box'
import Flex from '../Box/Flex'
import { AlertProps, variants } from './types'
import { ColorStyles } from '../../colors'
import { light as alert } from './theme'

const getIcon = (variant: AlertProps['variant'] = variants.INFO) => {
  switch (variant) {
    case variants.DANGER:
      return CheckFailedIcon
    case variants.WARNING:
      return CheckFailedIcon
    case variants.SUCCESS:
      return CheckCompleteIcon
    case variants.INFO:
    default:
      return CheckCompleteIcon
  }
}

const StyledAlert = styled(Flex)`
  position: relative;
  background-color: ${alert.background};
  border: 1px solid ${alert.border};
  border-radius: 16px;
  box-shadow: 0 8px 8px 0 rgba(254, 169, 72, 0.3);
`

const Alert: React.FC<AlertProps> = ({ title, children, variant, onClick }) => {
  const Icon = getIcon(variant)

  return (
    <StyledAlert className="px-s16 py-s12" alignItems="center">
      <Icon color="currentColor" width="24px" />
      <Box className="ml-s12" style={{ flex: 1 }} width="100%">
        <Flex justifyContent="space-between">
          <Text textStyle="R_14M" color={ColorStyles.BLACK}>
            {title}
          </Text>
          {onClick && (
            <IconButton
              onClick={onClick}
              style={{
                alignItems: 'flex-start',
                padding: 0,
                height: 'auto',
              }}
            >
              <SmallCloseIcon />
            </IconButton>
          )}
        </Flex>
        {children || null}
      </Box>
    </StyledAlert>
  )
}

export default Alert
