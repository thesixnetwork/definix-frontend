import { Box, Divider, styled, Typography } from '@mui/material'
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
}

const CardHeadingStyle = styled(Box)`
  padding: 20px 20px 0 20px;
  display: flex;
  position: relative;
  flex-wrap: wrap;

  .MuiDivider-root {
    display: none;
  }

  img {
    border-radius: 6px;
    width: 100%;
    height: auto;
    background: rgba(186, 191, 199, 0.12);
    margin: 0 0 24px 0;
    flex-shrink: 0;
    max-width: 400px;
  }

  ${({ theme }) => theme.breakpoints.up('lg')} {
    padding: 32px 32px 0 32px;

    .MuiDivider-root {
      display: block;
    }

    img {
      width: 160px;
      margin: 0 32px 0 0;
    }
  }
`

const CardHeading: React.FC<CardHeadingType> = ({
  className = '',

  rebalance = {},
}) => {
  return (
    <CardHeadingStyle className={className}>
      <img src={rebalance.icon[0]} alt="" />

      <Box>
        <Typography
          variant="h6"
          fontSize="1rem !important"
          textTransform="uppercase"
          fontWeight="bold"
          className="mb-1"
        >
          {rebalance.title}
        </Typography>
        <Typography variant="caption" sx={{ color: (theme) => theme.palette.text.disabled, display: 'block' }}>
          {rebalance.description}
        </Typography>
      </Box>

      <Divider sx={{ width: '100%', pt: 4, display: { xs: 'none', md: 'block' } }} />
    </CardHeadingStyle>
  )
}

export default CardHeading
