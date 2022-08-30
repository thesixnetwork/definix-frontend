import { Box, BoxProps, Divider, styled, Typography } from '@mui/material'
import React from 'react'
import { Rebalance } from '../../../state/types'

interface CardHeadingType {
  isSkew?: boolean
  isHorizontal?: boolean
  showAccordion?: boolean
  isOpenAccordion?: boolean
  className?: string
  setIsOpenAccordion?: (open: boolean) => void
  rebalance: Rebalance | any
  hideDescription?: boolean
  large?: boolean
}

interface CustomBoxProps {
  hideDescription?: boolean
}

const CardHeadingStyle = styled(Box)<CustomBoxProps & BoxProps>(({ theme, hideDescription = false }) => ({
  padding: '20px 20px 0 20px',
  display: 'flex',
  position: 'relative',
  flexWrap: 'wrap',
  flexDirection: 'column',

  '.MuiDivider-root': {
    display: 'none',
  },

  img: {
    borderRadius: '6px',
    width: '100%',
    height: 'auto',
    background: 'rgba(186, 191, 199, 0.12)',
    margin: '0 0 24px 0',
    flexShrink: '0',
    maxWidth: '400px',
  },

  [theme.breakpoints.up('lg')]: {
    padding: '32px 32px 0 32px',
    flexDirection: 'row',
    alignItems: hideDescription ? 'center' : 'initial',

    '.MuiDivider-root': {
      display: 'block',
    },

    img: {
      width: '160px',
      margin: '0 32px 0 0',
    },
  },
}))

const CardHeading: React.FC<CardHeadingType> = ({
  className = '',
  rebalance = {},
  hideDescription = false,
  large = false,
}) => {
  return (
    <CardHeadingStyle hideDescription={hideDescription} className={className}>
      <img src={rebalance.icon[0]} alt="" />

      <Box>
        <Typography
          variant="h6"
          fontSize={`${large ? '1.25rem' : '1rem'} !important`}
          textTransform="uppercase"
          fontWeight="bold"
        >
          {rebalance.title}
        </Typography>

        {!hideDescription && (
          <Typography
            variant="caption"
            sx={{ color: (theme) => theme.palette.text.disabled, display: 'block' }}
            className="mt-1"
          >
            {rebalance.description}
          </Typography>
        )}
      </Box>

      {!hideDescription && <Divider sx={{ width: '100%', pt: 4, display: { xs: 'none', md: 'block' } }} />}
    </CardHeadingStyle>
  )
}

export default CardHeading
