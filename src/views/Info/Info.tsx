import Page from 'components/layout/Page'
import React from 'react'
import styled from 'styled-components'
import { ArrowBackIcon, Button, Card, Heading, IconButton, Text } from 'uikit-dev'
import colorStroke from '../../uikit-dev/images/Color-stroke.png'
import info from '../../uikit-dev/images/for-Info-page/info.png'
import m1 from '../../uikit-dev/images/for-Info-page/m1.png'
import m2 from '../../uikit-dev/images/for-Info-page/m2.png'
import m3 from '../../uikit-dev/images/for-Info-page/m3.png'
import u1 from '../../uikit-dev/images/for-Info-page/u1.png'
import u2 from '../../uikit-dev/images/for-Info-page/u2.png'
import u3 from '../../uikit-dev/images/for-Info-page/u3.png'
import InfoBanner from './components/InfoBanner'

const MaxWidth = styled.div`
  max-width: 800px;
  margin: 0 auto;
  width: 100%;
  padding: 0 24px;

  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0;
  }

  section {
    padding: 48px 0;
  }

  .info {
    margin-bottom: 2rem;
  }

  .color-stroke {
    heigth: 4px;
  }
`

const Flex = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 3rem;

  img {
    display: block;
    margin: 0 auto 2rem auto;
    width: 70%;
  }

  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;

    img {
      width: auto;
      height: 200px;
    }
  }

  .col-6 {
    width: 100% !important;
    margin-bottom: 3rem;

    > div {
      margin-bottom: 4rem;

      &:last-of-type {
        margin-bottom: 0;
      }
    }

    ${({ theme }) => theme.mediaQueries.md} {
      width: 50% !important;
      margin-bottom: 0;

      &:nth-child(01) {
        padding-right: 2rem;
        border-right: 1px solid ${({ theme }) => theme.colors.border};
      }
      &:nth-child(02) {
        padding-left: 2rem;
      }
    }
  }
`

const StyledButton = styled(Button)`
  display: block;
  margin: 0 auto;
  color: ${({ theme }) => theme.colors.primary} !important;
  border-color: ${({ theme }) => theme.colors.primary} !important;
  background: transparent !important;
`

const Info: React.FC = () => {
  const s2 = [
    [
      {
        title: 'Chance to Optimize your profit',
        detail:
          'Maximize your investment with FINIX token that you earn from Definix.com. FINIX token can be utilized as a discount for financial products and other privillege on upcoming features. Moreover, we also have an expert to make sure that you will select the best for your investment',
        img: u1,
      },
      {
        title: 'Transparency Investment',
        detail:
          'All your assets will be traded and controlled by smart contract. All of your investment logs will be recorded on public blockchain. With the property of blockchain, you can freely trace your transactions at every moments.',
        img: u2,
      },
      {
        title: 'Investment Assessment',
        detail:
          'We have algorithmic investment assessment that aggregate the data across blockchain. We utilize this data to create the best investment choice for you to choose base on your requirement.',
        img: u3,
      },
    ],
    [
      {
        title: 'User Generated Fund',
        detail:
          'You can create and managed your own fund on our platform by submit your fund on smart contract with the property of blockchain. Every investment log will be shown on the platform. This allows the person who invest in your fund to trace their asset. As a fund manager you can generate income from your fund.',
        img: m1,
      },
      {
        title: 'Multi-Strategy Investment',
        detail:
          'With the multi-chain environment (BSC, Klaytn). The fund manger is allow to match variety of assets across different blockchain and help maximize the profit for fund manager.',
        img: m2,
      },
      {
        title: 'Trade Reputation',
        detail:
          'Let people know how good are you on trading. All trade logs are recorded on blockchain. The trade data will be sort and ranked in the platform. Fund manager can use this record as a reputation for them gain more investor to maximize the volume of their fund.',
        img: m3,
      },
    ],
  ]

  return (
    <Page style={{ maxWidth: '1280px' }}>
      <Card isRainbow className="flex flex-column align-stretch mx-auto" style={{ maxWidth: '1000px' }}>
        <IconButton variant="text" as="a" href="/dashboard" area-label="go back" className="ma-3">
          <ArrowBackIcon />
        </IconButton>

        <InfoBanner />

        <MaxWidth>
          <section>
            <img src={info} alt="" className="info" />
            <Text fontSize="16px">
              <strong>Definix</strong> is the decentralized multi-chain fund management platform that allows everybody
              to trade with the high level of transparency. With the technology of blockchain, Definix makes crypto
              investment become on of the most simple things for everyone.
            </Text>
          </section>

          <img src={colorStroke} alt="" className="color-stroke" />

          <section>
            <Heading as="h2" fontSize="32px !important" className="mb-6" textAlign="center">
              Benefits
            </Heading>
            <Flex>
              <div className="col-6">
                <Text color="primary" fontSize="20px" textAlign="center" fontWeight="bold" className="mb-4">
                  for Crypto investors
                </Text>

                {s2[0].map((user) => (
                  <div>
                    <img src={user.img} alt="" />
                    <Text fontSize="18px" fontWeight="bold" className="mb-1">
                      {user.title}
                    </Text>
                    <Text>{user.detail}</Text>
                  </div>
                ))}
              </div>
              <div className="col-6">
                <Text color="primary" fontSize="20px" textAlign="center" fontWeight="bold" className="mb-4">
                  for Professional Traders
                </Text>

                {s2[1].map((manager) => (
                  <div>
                    <img src={manager.img} alt="" />
                    <Text fontSize="18px" fontWeight="bold" className="mb-1">
                      {manager.title}
                    </Text>
                    <Text>{manager.detail}</Text>
                  </div>
                ))}
              </div>
            </Flex>

            <StyledButton variant="secondary" disabled>
              Coming soon
            </StyledButton>
          </section>
        </MaxWidth>
      </Card>
    </Page>
  )
}

export default Info
