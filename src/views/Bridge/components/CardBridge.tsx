import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Card, Flex, Text, Button, Coin } from '@fingerlabs/definixswap-uikit-v2'
import LogoSixBridge from '../../../assets/images/logo-footer-six-bridge.png'
import LogoSixBridge2x from '../../../assets/images/logo-footer-six-bridge@2x.png'
import LogoSixBridge3x from '../../../assets/images/logo-footer-six-bridge@3x.png'

const IconToken = styled.div<{ isMobile: string }>`
  width: 48px;
  height: 48px;
  margin-right: ${(props) => props.isMobile};
`

interface CardType {
  isMobile: boolean
}

const CardBridge: React.FC<CardType> = ({ isMobile }) => {
  const { t } = useTranslation()

  const onClickBridgeBtn = () => {
    window.open('https://bridge.six.network/')
  }

  return (
    <>
      <Card className={`${isMobile && 'mt-s28'}`} p={isMobile ? 'S_20' : 'S_40'}>
        <Flex flexDirection="column" alignItems="center">
          <img
            style={{ marginTop: '10px' }}
            width={180}
            height={68}
            src={LogoSixBridge}
            srcSet={`${LogoSixBridge2x} 2x, ${LogoSixBridge3x} 3x`}
            alt="logo-footer-six-bridge"
          />

          <Flex className={`${isMobile ? 'mt-s30 mb-s24' : 'mt-s40 mb-s40'}`} flexDirection="column" width="100%">
            <Text className="mb-s16" color="black" textStyle="R_18B">
              {t('Token & Chain')}
            </Text>

            <Flex flexDirection={isMobile ? 'column' : 'row'}>
              <Flex width={isMobile ? '100%' : '50%'}>
                <IconToken isMobile={`${isMobile ? '14px' : '12px'}`}>
                  <Coin symbol="SIX" size="48px" />
                </IconToken>
                <Flex flexDirection="column" width={!isMobile && 184}>
                  <Text className="mb-s2" color="black" textStyle="R_14B">
                    {t('SIX')}
                  </Text>
                  <Text color="deepgrey" textStyle="R_14R">
                    {t('Bridge SIX')}
                  </Text>
                </Flex>
              </Flex>

              <Flex className={isMobile && 'mt-s16'} width={isMobile ? '100%' : '50%'}>
                <IconToken isMobile={`${isMobile ? '14px' : '12px'}`}>
                  <Coin symbol="FINIX" size="48px" />
                </IconToken>
                <Flex flexDirection="column" width={!isMobile && 184}>
                  <Text className="mb-s2" color="black" textStyle="R_14B">
                    {t('FINIX')}
                  </Text>
                  <Text color="deepgrey" textStyle="R_14R">
                    {t('Bridge FINIX')}
                  </Text>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          <Button width="100%" height="48px" onClick={onClickBridgeBtn}>
            {t('Go to the bridge')}
          </Button>
        </Flex>
      </Card>
    </>
  )
}

export default CardBridge
