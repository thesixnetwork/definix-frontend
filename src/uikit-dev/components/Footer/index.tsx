/**
 *
 * Footer
 *
 */

import React from 'react'
import styled from 'styled-components'
import { FOOTER_HEIGHT } from 'uikit-dev/widgets/Menu/config'
import colorStrokeLong from '../../images/Color-stroke-long.png'
import definixBlackLogo from '../../images/Definix-advance-crypto-assets.png'
import facebookNormal from '../../images/Footer-Icon/Facebook-Normal.png'
import githubNormal from '../../images/Footer-Icon/Github-Normal.png'
import kakaoNormal from '../../images/Footer-Icon/Kakao-Normal.png'
import poweredbySIX from '../../images/Footer-Icon/Powered-by-SIX.png'
import redditNormal from '../../images/Footer-Icon/Reddit-Normal.png'
import telegramNormal from '../../images/Footer-Icon/Telegram-Normal.png'
import twitterNormal from '../../images/Footer-Icon/Twitter-Normal.png'

function Footer() {
  const FooterStyled = styled.footer`
    position: relative;
    padding-top: 6px;
    flex-shrink: 0;

    .container {
      max-width: 1280px;
      margin: 0 auto;
      padding: 8px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
    }

    .color-stroke {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%);
      height: 6px;
      width: 100%;
    }

    .logo {
      height: 28px;
      margin: 8px;
    }

    .six-logo {
      width: 200px;
      margin: 8px;
      display: block;
    }

    .social {
      display: flex;
      margin-top: 1rem;
      margin: 8px;

      a {
        max-width: 4rem;
        cursor: pointer;
      }
    }

    ${({ theme }) => theme.mediaQueries.lg} {
      .container {
        justify-content: space-between;
      }
    }
  `

  return (
    <FooterStyled>
      <img src={colorStrokeLong} alt="" className="color-stroke" />
      <div className="container">
        <div className="flex align-center flex-wrap justify-center">
          <img src={definixBlackLogo} alt="" className="logo" />
          <p className="pa-2">Advance your crypto assets</p>
          <a href="https://coinmarketcap.com/currencies/six/markets/" target="_blank" rel="noreferrer">
            <img src={poweredbySIX} alt="" className="six-logo" />
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
