import { Box, Link, styled, Typography, useMediaQuery, useTheme } from '@mui/material'
import React from 'react'
import six from '../images/six-gray.svg'
import facebook from '../images/socials/facebook.svg'
import gitbook from '../images/socials/gitbook.svg'
import github from '../images/socials/github.svg'
import kakao from '../images/socials/kakao.svg'
import reddit from '../images/socials/reddit.svg'
import telegram from '../images/socials/telegram.svg'
import twitter from '../images/socials/twitter.svg'

const FooterStyle = styled(Box)`
  padding: 20px 0px 40px;
  display: flex;
  flex-direction: column-reverse;
  background: white;

  ${({ theme }) => theme.breakpoints.up('md')} {
    padding: 30px 60px 60px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`

const SocialStyle = styled(Box)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 0px 40px;

  a {
    cursor: pointer;
    width: 24px;
    height: 24px;

    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin-right: 0;
    }
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    width: auto;
    justify-content: center;
    padding: 0;

    a {
      margin: 0 8px;
    }
  }
`

const LeftStyle = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 20px 40px 0px;
  margin-top: 20px;
  border-top: 1px solid ${({ theme }) => theme.palette.divider};

  p {
    font-size: 0.75rem;
    line-height: 1.5;

    a {
      display: block;
      margin-top: 4px;
    }
  }

  .MuiBox-root {
    margin-top: 6px;
  }

  ${({ theme }) => theme.breakpoints.up('md')} {
    flex-direction: row;
    padding: 0 16px 0 0;
    margin-top: 0;
    border-top: none;

    .MuiBox-root {
      margin-top: 0;
    }

    p {
      display: flex;
      font-size: 0.875rem;

      a {
        margin: 0;
      }
    }
  }
`

const Social = () => {
  const socials = [
    {
      url: 'https://www.facebook.com/thesixnetwork',
      img: facebook,
    },
    {
      url: 'https://twitter.com/DefinixOfficial',
      img: twitter,
    },
    {
      url: 'https://t.me/SIXNetwork',
      img: telegram,
    },
    {
      url: 'https://open.kakao.com/o/gsh5pWGd',
      img: kakao,
    },
    {
      url: 'https://sixnetwork.gitbook.io/definix/',
      img: gitbook,
    },
    {
      url: 'https://github.com/thesixnetwork',
      img: github,
    },
    {
      url: 'https://www.reddit.com/r/sixnetwork',
      img: reddit,
    },
  ]

  return (
    <SocialStyle>
      {socials.map((s) => (
        <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
          <img src={s.img} alt="" />
        </a>
      ))}
    </SocialStyle>
  )
}

function FooterV2() {
  const theme = useTheme()
  const mdUp = useMediaQuery(theme.breakpoints.up('md'))

  return (
    <FooterStyle component="footer">
      <LeftStyle>
        <Link
          href="https://coinmarketcap.com/currencies/six/markets/"
          target="_blank"
          rel="noreferrer"
          sx={{ display: 'inline-block', flexShrink: 0, mr: 3, img: { width: { xs: 48, md: 72 } } }}
        >
          <img src={six} alt="" />
        </Link>

        {/* <Divider orientation="vertical" sx={{ alignSelf: 'stretch', height: 'auto', ml: 2, mr: 3 }} /> */}

        <Box className="flex flex-wrap">
          <Typography variant="body2" color="#999999">
            Copyright © 2022 SIX Network. All Right Reserved&nbsp;
            <Typography
              component={Link}
              variant="body2"
              color="inherit"
              fontSize="inherit"
              href="https://www.certik.org/projects/sixnetwork"
              target="_blank"
              rel="noreferrer"
              underline="none"
            >
              Audited By Certik
            </Typography>
          </Typography>

          {mdUp && (
            <Typography
              variant="caption"
              color="#999999"
              sx={{ opacity: '0.6', mt: '4px', display: 'inline-block', width: '100%' }}
            >
              This site is optimized for Chrome.
            </Typography>
          )}
        </Box>
      </LeftStyle>

      <Social />
    </FooterStyle>
  )
}

FooterV2.propTypes = {}

export default FooterV2
