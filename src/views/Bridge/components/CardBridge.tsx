import React from 'react'
import { useTranslation } from 'react-i18next'
import { Card, Flex, Text, Button, ImgTokenSixIcon, ImgTokenFinixIcon } from 'definixswap-uikit'
import LogoSixBridge from '../../../assets/images/logo-footer-six-bridge.png'
import LogoSixBridge2x from '../../../assets/images/logo-footer-six-bridge@2x.png'
import LogoSixBridge3x from '../../../assets/images/logo-footer-six-bridge@3x.png'

interface CardType {
  isMobile: boolean
}

const CardBridge: React.FC<CardType> = ({ isMobile }) => {
  const { t } = useTranslation()

  return (
    <>
      <Card className={`${isMobile && 'mt-s28'}`}>
        <Flex flexDirection="column" alignItems="center">
          <img
            className={`my-s${isMobile ? 30 : 40}`}
            width={180}
            height={68}
            src={LogoSixBridge}
            srcSet={`${LogoSixBridge2x} 2x, ${LogoSixBridge3x} 3x`}
            alt="logo-footer-six-bridge"
          />

          <Flex className="px-s40" flexDirection="column" width="100%">
            <Text className="mb-s16" color="#222222" textStyle="R_18B">
              {t('Token & Chain')}
            </Text>

            <Flex flexDirection={isMobile ? 'column' : 'row'}>
              <Flex width={isMobile ? '100%' : '50%'}>
                <ImgTokenSixIcon className={`mr-s${isMobile ? 14 : 12}`} width="48px" height="48px" />
                <Flex flexDirection="column" width={isMobile ? 416 : 208}>
                  <Text className="mb-s2" textStyle="R_14B">
                    {t('SIX')}
                  </Text>
                  <Text textStyle="R_14R">{t('Binance Smart Chain, Klaytn Chain, Stella Lumen')}</Text>
                </Flex>
              </Flex>

              <Flex width={isMobile ? '100%' : '50%'}>
                <ImgTokenFinixIcon className={`mr-s${isMobile ? 14 : 12}`} width="48px" height="48px" />
                <Flex flexDirection="column" width={isMobile ? 416 : 208}>
                  <Text className="mb-s2" textStyle="R_14B">
                    {t('Finix')}
                  </Text>
                  <Text textStyle="R_14R">{t('Binance Smart Chain, Klaytn Chain')}</Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Button className={`my-s${isMobile ? 20 : 40}`} width={549}>
            {t('Go to the bridge')}
          </Button>
        </Flex>
      </Card>
    </>
  )
}

export default CardBridge
