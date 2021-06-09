/**
 *
 * Footer
 *
 */

import React from 'react'
import styled from 'styled-components'
import certik from '../../images/Audit/AW-42.png'
import six from '../../images/Footer-Icon/Powered-by-SIX.png'
import facebook from '../../images/for-ui-v2/footer/facebook.png'
import gitbook from '../../images/for-ui-v2/footer/gitbook.png'
import github from '../../images/for-ui-v2/footer/github.png'
import kakao from '../../images/for-ui-v2/footer/kakao.png'
import reddit from '../../images/for-ui-v2/footer/reddit.png'
import telegram from '../../images/for-ui-v2/footer/telegram.png'
import twitter from '../../images/for-ui-v2/footer/twitter.png'

const FooterStyled = styled.footer`
  flex-shrink: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.white};
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
      height: 32px;
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
      height: 16px;
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
      url: 'https://open.kakao.com/o/gQNRT5K',
      img: kakao,
    },
    {
      url: 'https://app.gitbook.com/@sixnetwork/s/definix',
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
          <a href="https://www.certik.org/projects/sixnetwork" target="_blank" rel="noreferrer">
            <img src={certik} alt="" />
          </a>
        </div>

        <div className="social">
          {socials.map((s) => (
            <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
              <img src={s.img} alt="" />
            </a>
          ))}
        </div>
      </div>
    </FooterStyled>
  )
}

Footer.propTypes = {}

export default Footer
