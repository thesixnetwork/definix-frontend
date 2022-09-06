import { Box, Link, styled, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'

const BoxStyle = styled(Box)`
  position: relative;
  padding: 0 0 16px 0;

  ${({ theme }) => theme.breakpoints.up('md')} {
    padding: 0 224px 24px 0;
  }
`

const ImgStyle = styled('img')`
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
  width: 200px;

  ${({ theme }) => theme.breakpoints.up('md')} {
    display: block;
  }
`

const PageTitle = ({
  title = '',
  caption = '',
  link = '',
  linkLabel = '',
  img = '',
  children = undefined,
  sx = undefined,
}) => {
  const theme = useTheme()
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))
  const lgUp = useMediaQuery(theme.breakpoints.up('lg'))

  return (
    <BoxStyle sx={sx} pr={img && mdUp ? '224px !important' : '0 !important'}>
      <Typography variant="h2">
        {title}
        {link && (
          <Link href={link} target="_blank" className="ml-3" fontSize="0.875rem" color="inherit" fontWeight="normal">
            {linkLabel}
          </Link>
        )}
      </Typography>

      {caption && (
        <Typography variant="body1" fontSize="1.125rem" color="#999999" sx={{ mt: '12px' }}>
          {caption}
        </Typography>
      )}

      {children}

      {img && lgUp && <ImgStyle src={img} alt="" />}
    </BoxStyle>
  )
}

export default PageTitle
