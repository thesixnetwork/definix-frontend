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

  ${({ theme }) => theme.mediaQueries.md} {
    height: 56px;
  }

  .container {
    height: 100%;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
  }

  p {
    font-size: 0.75rem;
  }

  .logo {
    height: 16px;
    margin: 0.5rem 0;
  }

  .six-logo {
    width: 120px;
    display: block;

    img {
      display: block;
    }
  }

  .social {
    display: flex;
    margin-top: 1rem;
    margin: 0.5rem 0;

    a {
      cursor: pointer;
      margin: 0 4px;
    }

    img {
      width: 28px;
      display: block;
    }
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    .container {
      justify-content: space-between;
    }
  }
`

function Footer() {
  return (
    <FooterStyled>
      <div className="container">
        <div className="flex align-center flex-wrap justify-center">
          <img src={definixBlackLogo} alt="" className="logo" />
          <p className="py-2 px-4">Advance your crypto assets</p>
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
