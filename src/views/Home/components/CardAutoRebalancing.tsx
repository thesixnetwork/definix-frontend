import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Button, Card, Heading, Text } from 'uikit-dev'
import lady from 'uikit-dev/images/for-ui-v2/AUTO-RE-BALANCING-MUTUAL-FUNDS.png'

const StyledBanner = styled(Card)`
  width: 100%;
  background: ${({ theme }) => theme.colors.card};
  padding: 48px 24px;
  position: relative;
  overflow: visible;

  &:before {
    content: '';
    width: 70%;
    height: 100%;
    background: url(${lady});
    background-size: contain;
    background-position: right bottom;
    background-repeat: no-repeat;
    position: absolute;
    top: 0;
    right: 0;
    opacity: 0.2;
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }

  h2 {
    font-size: 24px;
  }
  h3 {
    font-size: 12px !important;
    margin-bottom: 4px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 48px 40% 48px 24px;

    &:before {
      width: 40%;
      opacity: 1;
    }

    h2 {
      font-size: 32px !important;
    }
    h3 {
      font-size: 16px !important;
    }
  }
`

const CardAutoRebalancing = ({ className = '' }) => {
  const { t } = useTranslation()

  return (
    <StyledBanner className={className}>
      <div className="pos-relative" style={{ zIndex: 1 }}>
        <Heading className="mb-2" color="primary">
          {t('AUTO RE-BALANCING MUTUAL FUNDS')}
        </Heading>
        <Text color="textSubtle" fontSize="12px">
          {t(
            'Rebalancing involves periodically buying or selling assets in a portfolio to maintain an original or desired level of asset allocation or risk.',
          )}
        </Text>
        <Text bold fontSize="12px">
          {t(
            'Sound complicated? Don’t worry we will take care your investment automatically with our in-house experts!!',
          )}
        </Text>

        <Button size="sm" variant="primary" className="btn-secondary-disable mt-3">
          {t('Coming Soon!')}
        </Button>
      </div>
    </StyledBanner>
  )
}

export default CardAutoRebalancing
