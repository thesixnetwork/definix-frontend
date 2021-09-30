import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { ArrowBackIcon, IconButton, Card, Heading } from 'uikit-dev'
import astro from 'uikit-dev/images/Airdrop/2nd-airdrop-small.jpg'
import definixLogo from 'uikit-dev/images/Definix-advance-crypto-assets.png'
import klaytnLogo from 'uikit-dev/images/Logo-Klaytn.png'
// import stake from '../../../assets/images/stake.jpg'

const MaxWidth = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
`

const StyledBanner = styled(Card)`
  padding: 24px 24px 350px 24px;
  width: 100%;
  background: url(${astro});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center 40%;
  background-color: ${({ theme }) => theme.colors.white};

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }
  img {
    width: 120px;
  }

  a {
    margin-top: 1rem;
  }

  > div > div {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;

    &:nth-of-type(01) {
      flex-grow: 1;
    }
    &:nth-of-type(02) {
      flex-shrink: 0;
      margin-bottom: 0.5rem;
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    h2 {
      font-size: 40px !important;
    }
    h3 {
      font-size: 20px !important;
    }
    a {
      min-width: 200px;
    }

    img {
      width: 180px;
    }
  }

  ${({ theme }) => theme.mediaQueries.md} {
    > div {
      flex-direction: row;
      align-items: center;

      > div {
        &:nth-of-type(01) {
          padding: 24px 24px 24px 0;
          align-items: flex-start;
          text-align: left;
        }
        &:nth-of-type(02) {
          margin: 0;
        }
      }
    }
  }
`

const BannerAirdrop = ({ className = '' }) => {
  const { t } = useTranslation()
  return (
    <StyledBanner className={className}>
      <IconButton variant="text" as="a" href="/" area-label="go back" className="ma-2">
        <ArrowBackIcon style={{ opacity: '0.6' }} />{' '}
        <span style={{ verticalAlign: 'super', opacity: '0.6', color: 'black' }}>{t('Back')}</span>
      </IconButton>
      <MaxWidth>
        <div>
          <Heading as="h3" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <img src={definixLogo} alt="" /> <span style={{ fontSize: '15px', color: 'black' }}>{t('is now on')}</span>{' '}
            <span style={{ fontSize: '25px', color: '#83603E' }}>{t('Klaytn Blockchain')}</span>
          </Heading>
          <br />
          <div style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            <b>
              <span style={{ fontSize: '20px', color: 'black' }}>Get free </span>{' '}
              <span style={{ fontSize: '30px', color: 'black' }}>
                30{' '}
                <img
                  style={{ width: '20px', marginLeft: '5px', marginRight: '5px' }}
                  src={klaytnLogo}
                  alt=""
                  className="logo"
                />{' '}
                KLAY
              </span>
            </b>
          </div>
        </div>
        <div>{/* <img src={dashboardBanner} alt="" className="logo" /> */}</div>
      </MaxWidth>
    </StyledBanner>
  )
}

export default BannerAirdrop
