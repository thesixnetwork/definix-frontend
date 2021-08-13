/**
 *
 * Footer
 *
 */

import useTheme from 'hooks/useTheme'
import React from 'react'
import styled from 'styled-components'
import useMatchBreakpoints from '../../hooks/useMatchBreakpoints'
import certikWhite from '../../images/Audit/certik-white.png'
import certik from '../../images/Audit/certik.png'
import sixWhite from '../../images/Footer-Icon/definix-logo-25.png'
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
import Text from '../Text/Text'

const FooterStyle = styled.footer`
  flex-shrink: 0;
  z-index: 10;
  background: ${({ theme }) => theme.colors.backgroundFooter};

  ${({ theme }) => theme.mediaQueries.md} {
    height: 60px;
  }

  > div {
    height: 100%;
  }
`

const Logo = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    height: 28px;
    display: block;
  }
`

const SocialStyle = styled.div`
  display: flex;
  justify-content: center;

  a {
    cursor: pointer;
    width: 24px;
    height: 24px;
    margin: 0 4px;
    display: flex;

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
    margin: auto;
  }
`

const PoweredSix = ({ className = '' }) => {
  const { isDark } = useTheme()
  return (
    <Logo
      href="https://coinmarketcap.com/currencies/six/markets/"
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      <img src={isDark ? sixWhite : six} alt="" />
    </Logo>
  )
}

const AuditedBy = () => {
  const { isDark } = useTheme()
  return (
    <Logo href="https://www.certik.org/projects/sixnetwork" target="_blank" rel="noreferrer">
      <Text color="textSubtle" fontSize="9px" className="mr-2">
        Audited by
      </Text>
      <img src={isDark ? certikWhite : certik} alt="" />
    </Logo>
  )
}

const PteLtd = () => (
  <Text color="textSubtle" fontSize="9px" bold>
    SIX Network PTE.LTD
  </Text>
)

const CoCeo = () => (
  <Text color="textSubtle" fontSize="9px">
    Co-CEO Vachara Aemavat, Co-CEO Natavudh Pungcharoenpong
  </Text>
)

const BusinessNo = () => (
  <Text color="textSubtle" fontSize="9px">
    <strong className="mr-1">Business Registration No.</strong>210811042Z
  </Text>
)

const Address = () => (
  <Text color="textSubtle" fontSize="9px">
    <strong className="mr-1">Address</strong>380 Jalan Besar #08-02 arc 380 Singapore (209000)
  </Text>
)

const PersonalInfo = () => (
  <Text
    color="textSubtle"
    fontSize="9px"
    as="a"
    href="mailto:contact@definix.com"
    target="_blank"
    rel="noreferrer"
    style={{ display: 'block' }}
  >
    <strong className="mr-1">Personal Information Management Officer (Email)</strong>contact@definix.com
  </Text>
)

const Social = () => {
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
      url: 'https://app.gitbook.com/@sixnetwork/s/definix-on-klaytn-en/',
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
    <SocialStyle>
      {socials.map((s) => (
        <a href={s.url} target="_blank" rel="noreferrer" key={s.url}>
          <img src={isDark ? s.imgDarkMode : s.img} alt="" />
        </a>
      ))}
    </SocialStyle>
  )
}

function Footer() {
  const { isXl, isLg } = useMatchBreakpoints()
  const isMobile = !isXl && !isLg

  return (
    <FooterStyle>
      {isMobile ? (
        <div className="pa-4">
          <div className="flex mb-2">
            <div className="col-6">
              <PoweredSix />
            </div>
            <div className="col-6">
              <AuditedBy />
            </div>
          </div>
          {/* <div className="flex mb-3">
            <div className="col-6 pr-2">
              <PteLtd />
              <CoCeo />
              <BusinessNo />
            </div>
            <div className="col-6 pl-2">
              <Address />
              <PersonalInfo />
            </div>
          </div> */}
          <Social />
        </div>
      ) : (
        <div className="pa-2 flex justify-space-between align-center">
          <div className="flex">
            <div className="flex align-center pa-2">
              <PoweredSix className="mr-3" />
              <AuditedBy />
            </div>
            {/* <div className="col-3 pa-2">
              <PteLtd />
              <CoCeo />
            </div>
            <div className="col-3 pa-2">
              <BusinessNo />
              <Address />
            </div>
            <div className="col-3 pa-2">
              <PersonalInfo />
            </div> */}
          </div>

          <div className="pa-2">
            <Social />
          </div>
        </div>
      )}
    </FooterStyle>
  )
}

Footer.propTypes = {}

export default Footer
