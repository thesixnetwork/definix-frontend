/**
 *
 * Footer
 *
 */

import React from 'react'
import styled from 'styled-components'
import definixBlackLogo from '../../images/Definix-advance-crypto-assets.png'
import poweredbySIX from '../../images/Footer-Icon/Powered-by-SIX.png'
import facebookNormal from '../../images/Footer-Icon/without-text/Facebook-Normal.png'
import githubNormal from '../../images/Footer-Icon/without-text/Github-Normal.png'
import kakaoNormal from '../../images/Footer-Icon/without-text/Kakao-Normal.png'
import redditNormal from '../../images/Footer-Icon/without-text/Reddit-Normal.png'
import telegramNormal from '../../images/Footer-Icon/without-text/Telegram-Normal.png'
import twitterNormal from '../../images/Footer-Icon/without-text/Twitter-Normal.png'

const FooterStyled = styled.footer`
  flex-shrink: 0;
  background: ${({ theme }) => theme.colors.white};
  z-index: 10;

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
  }

  .g2 {
    text-align: center;
    margin-right: 1rem;
  }

  .logo {
    height: 14px;
    margin-bottom: 4px;
  }

  p {
    font-size: 6px;
  }

  .six-logo {
    display: block;
    width: 100px;
    img {
      display: block;
    }
  }

  .social {
    display: flex;
    margin-top: 1rem;

    a {
      cursor: pointer;
      margin: 0 4px;
    }

    img {
      width: 28px;
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
  return (
    <FooterStyled>
      <div className="container">
        <div className="g1">
          <div className="g2">
            <img src={definixBlackLogo} alt="" className="logo" />
            <p>Advance your crypto assets</p>
          </div>

          <a
            href="https://coinmarketcap.com/currencies/six/markets/"
            target="_blank"
            rel="noreferrer"
            className="six-logo"
          >
            <img src={poweredbySIX} alt="" />
          </a>
        </div>

        <div className="social">
          <a href="https://www.facebook.com/thesixnetwork" target="_blank" rel="noreferrer">
            <img src={facebookNormal} alt="" />
          </a>
          <a href="https://twitter.com/DefinixOfficial" target="_blank" rel="noreferrer">
            <img src={twitterNormal} alt="" />
          </a>
          <a href="https://t.me/SIXNetwork" target="_blank" rel="noreferrer">
            <img src={telegramNormal} alt="" />
          </a>
          <a href="https://open.kakao.com/o/gQNRT5K" target="_blank" rel="noreferrer">
            <img src={kakaoNormal} alt="" />
          </a>
          <a href="https://github.com/thesixnetwork" target="_blank" rel="noreferrer">
            <img src={githubNormal} alt="" />
          </a>
          <a href="https://www.reddit.com/r/sixnetwork/" target="_blank" rel="noreferrer">
            <img src={redditNormal} alt="" />
          </a>
        </div>
      </div>
    </FooterStyled>
  )
}

Footer.propTypes = {}

export default Footer
