import React from 'react'
import { useFarmUnlockDate } from 'state/hooks'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { Button, Card, Heading, useModal, useMatchBreakpoints, Text } from 'uikit-dev'
import Flip from 'uikit-dev/components/Flip'
import { usePrivateData } from 'hooks/useLongTermStake'
import useRefresh from 'hooks/useRefresh'
import useFarmEarning from 'hooks/useFarmEarning'
import usePoolEarning from 'hooks/usePoolEarning'
import SuperStakeModal from 'uikit-dev/widgets/WalletModal/SuperStakeModal'
import StartLongTermStakeModal from 'uikit-dev/widgets/WalletModal/StartLongTermStakeModal'
import bannerTopup from 'uikit-dev/images/for-ui-v2/topup-stake/banner-topup.png'
import bannerMobile from 'uikit-dev/images/for-ui-v2/topup-stake/banner-topup-mobile.png'
import logoFinixTopup from 'uikit-dev/images/for-ui-v2/topup-stake/logo-finix-topup.png'
import man02 from 'uikit-dev/images/FINIX-Love-You/1557.png'
import bgBlue from 'uikit-dev/images/FINIX-Love-You/bg.png'

const MaxWidth = styled.div`
  max-width: 960px;
  margin: 0 auto;
  width: 100%;
`

const CardSorry = styled(Card)`
  padding: 24px;
  width: 100%;
  background: url(${bgBlue});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  background-color: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.white};

  > div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    > div {
      text-align: center;
    }
  }

  img {
    width: 160px;
    margin-bottom: 1rem;
  }

  p {
    line-height: 1.5;
  }

  a {
    flex-shrink: 0;
    margin-top: 1rem;
  }

  strong {
    padding: 8px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: space-between;

    > div {
      flex-direction: row;

      > div {
        text-align: left;
      }
    }

    img {
      margin: 0;
    }

    a {
      margin: 0 0 0 1rem;
    }

    strong {
      padding: 0;
    }
  }
`

const BannerTopupStyle = styled(Card)`
  width: 100%;
  background: url(${bannerTopup});
  margin: 20px 0px 30px;
  background-size: cover;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.xs} {
    margin: 20px 0px 30px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 20px 0px 30px;
  }
`

const BannerTopupMobile = styled(Card)`
  width: 100%;
  background: url(${bannerMobile});
  margin: 20px 0px 30px;
  background-size: cover;
  background-repeat: no-repeat;

  ${({ theme }) => theme.mediaQueries.xs} {
    margin: 20px 0px 30px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    margin: 20px 0px 30px;
  }
`

const BoxValueMobile = styled(Card)`
  background: #fff;
  width: 100%;
  height: 50%;
  padding: 10px;
  margin: 0px 16px 0px 0px;
  box-shadow: ${({ theme }) => theme.shadows.elevation};
  border-radius: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 22%;
    margin: 0px 46px;
  }
`

const BoxValue = styled(Card)`
  background: #fff;
  width: 100%;
  height: 50%;
  padding: 24px;
  margin: 0px 16px;
  box-shadow: ${({ theme }) => theme.shadows.elevation};
  border-radius: 12px;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 24%;
    margin: 0px 44px;
  }
`
const HeaderBanner = styled(Text)`
  width: 100%;
  color: #222331;
  font-weight: bold;
  font-size: 24px !important;
  line-height: 1.2;

  ${({ theme }) => theme.mediaQueries.lg} {
    width: 40%;
    font-size: 28px !important;
  }
`

const SuperHarvestButton = styled(Button)`
  background: linear-gradient(#fad961, #f76b1c);
  color: #fff;
  padding: 0px 16px;

  ${({ theme }) => theme.mediaQueries.xs} {
    padding: 0px 30px;
  }
`
const BannerTopup = () => {
  const { isXl, isMd } = useMatchBreakpoints()
  const isMobile = !isXl && !isMd
  const isMobileOrTablet = !isXl
  // Super Stake
  const farmEarnings = useFarmEarning()
  const poolEarnings = usePoolEarning()
  const { balancevfinix } = usePrivateData()
  const earningsSum = farmEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const earningsPoolSum = poolEarnings.reduce((accum, earning) => {
    return accum + new BigNumber(earning).div(new BigNumber(10).pow(18)).toNumber()
  }, 0)
  const totalAllMyFarms = Math.round((earningsSum + earningsPoolSum) * 100) / 100
  const [onPresentConnectModal] = useModal(
    !!balancevfinix && balancevfinix > 0 ? <SuperStakeModal /> : <StartLongTermStakeModal />,
  )
  return (
    <>
      {isMobileOrTablet ? (
        <>
          {earningsSum <= 0 && (
            <BannerTopupMobile>
              <div className="pa-4 pos-relative" style={{ zIndex: 1 }}>
                <div className="flex align-center">
                  <HeaderBanner color="text">
                    Harvest all of reward and stake in Long-term Stake for earn more!
                  </HeaderBanner>
                  <img src={logoFinixTopup} alt="logoFinixTopup" width="100" />
                </div>
                <div className="flex align-center mt-3">
                  <BoxValueMobile>
                    <Text color="textSubtle" fontSize="12px">
                      FINIX ready to harvest
                    </Text>
                    <div className="flex align-center">
                      <img src={`/images/coins/${'FINIX'}.png`} alt="" width={24} />
                      <Text color="primary" fontSize="14px" fontWeight="bold" paddingLeft="4px">
                        {totalAllMyFarms} FINIX
                      </Text>
                    </div>
                  </BoxValueMobile>
                  <SuperHarvestButton
                    radii="small"
                    onClick={() => {
                      onPresentConnectModal()
                    }}
                  >
                    Super Stake
                  </SuperHarvestButton>
                </div>
              </div>
            </BannerTopupMobile>
          )}
        </>
      ) : (
        <>
          {earningsSum <= 0 && (
            <BannerTopupStyle>
              <div className="flex align-center px-6 pos-relative" style={{ zIndex: 1 }}>
                <HeaderBanner color="text">
                  Harvest all of reward and stake in Long-term Stake for earn more!
                </HeaderBanner>
                <img src={logoFinixTopup} alt="logoFinixTopup" width="130" className="ml-7 mr-5" />
                <BoxValue>
                  <Text color="textSubtle" fontSize="16px">
                    FINIX ready to harvest
                  </Text>
                  <div className="flex align-center">
                    <img src={`/images/coins/${'FINIX'}.png`} alt="" width={24} />
                    <Text color="primary" fontSize="18px" fontWeight="bold" paddingLeft="4px">
                      {totalAllMyFarms} FINIX
                    </Text>
                  </div>
                </BoxValue>
                <SuperHarvestButton
                  radii="small"
                  onClick={() => {
                    onPresentConnectModal()
                  }}
                >
                  Super Stake
                </SuperHarvestButton>
              </div>
            </BannerTopupStyle>
          )}
        </>
      )}
    </>
  )
}

export default BannerTopup
