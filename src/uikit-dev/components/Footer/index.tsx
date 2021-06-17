/**
 *
 * Footer
 *
 */

import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import certikWhite from '../../images/Audit/certik-white.png'
import certik from '../../images/Audit/certik.png'
import six from '../../images/Footer-Icon/Powered-by-SIX.png'
import facebookWhite from '../../images/for-ui-v2/footer/facebook-white.png'
import facebook from '../../images/for-ui-v2/footer/facebook.png'
import gitbookWhite from '../../images/for-ui-v2/footer/gitbook-white.png'
import gitbook from '../../images/for-ui-v2/footer/gitbook.png'
import githubWhite from '../../images/for-ui-v2/footer/github-white.png'
import github from '../../images/for-ui-v2/footer/github.png'
import kakaoWhite from '../../images/for-ui-v2/footer/kakao-white.png'
import kakao from '../../images/for-ui-v2/footer/kakao.png'
import redditWhite from '../../images/for-ui-v2/footer/reddit-white.png'
import reddit from '../../images/for-ui-v2/footer/reddit.png'
import telegramWhite from '../../images/for-ui-v2/footer/telegram-white.png'
import telegram from '../../images/for-ui-v2/footer/telegram.png'
import twitterWhite from '../../images/for-ui-v2/footer/twitter-white.png'
import twitter from '../../images/for-ui-v2/footer/twitter.png'
import { Text } from '../Text'

const FooterStyled = styled.footer`
  flex-shrink: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.backgroundFooter};
  .container {
    height: 100%;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }

  .g1 {
    display: flex;
    align-items: center;

    a {
      display: block;
      margin-right: 16px;
    }

    img {
      height: 28px;
      display: block;
    }
  }

  .social {
    display: flex;
    margin-top: 1rem;

    a {
      cursor: pointer;
      margin: 0 8px;

      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0;
      }
    }

    img {
      height: 14px;
      display: block;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    .container {
      justify-content: space-between;
      padding: 1rem 24px;
    }

    .g2 {
      display: flex;
      align-items: center;
    }

    .logo {
      margin: 0 1rem 0 0;
    }

    p {
      font-size: 12px;
      margin-top: 4px;
    }

    .social {
      margin: 0;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    height: 60px;
  }
`

function Footer() {
  const { isDark } = useTheme()
  const socials = [
    {
      url: 'https://www.facebook.com/thesixnetwork',
      img: facebook,
      imgDarkMode: facebookWhite,
    },
    {
      url: 'https://twitter.com/DefinixOfficial',
      img: twitter,
      imgDarkMode: twitterWhite,
    },
    {
      url: 'https://t.me/SIXNetwork',
      img: telegram,
      imgDarkMode: telegramWhite,
    },
    {
      url: 'https://open.kakao.com/o/gQNRT5K',
      img: kakao,
      imgDarkMode: kakaoWhite,
    },
    {
      url: 'https://app.gitbook.com/@sixnetwork/s/definix',
      img: gitbook,
      imgDarkMode: gitbookWhite,
    },
    {
      url: 'https://github.com/thesixnetwork',
      img: github,
      imgDarkMode: githubWhite,
    },
    {
      url: 'https://www.reddit.com/r/sixnetwork',
      img: reddit,
      imgDarkMode: redditWhite,
    },
  ]

  return (
    <FooterStyled>
      <div className="container">
        <div className="g1">
          <a
            href="https://coinmarketcap.com/currencies/six/markets/"
            target="_blank"
            rel="noreferrer"
            className="six-logo"
          >
            <img src={six} alt="" />
          </a>
          <div>
            <Text color="textSubtle" fontSize="12px" className="mr-2">
              Audited by
            </Text>
          </div>
          <a href="https://www.certik.org/projects/sixnetwork" target="_blank" rel="noreferrer">
            <img src={isDark ? certikWhite : certik} alt="" />
          </a>
        </div>

        <div className="social">
          {socials.map((s) => (
            <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
              <img src={isDark ? s.imgDarkMode : s.img} alt="" />
            </a>
          ))}
        </div>
      </div>
    </FooterStyled>
  )
}

Footer.propTypes = {}

export default Footer
