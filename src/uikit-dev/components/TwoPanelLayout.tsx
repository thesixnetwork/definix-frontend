import React from 'react'
import { useTranslation } from 'contexts/Localization'
import styled from 'styled-components'
import { Button } from './Button'
import { ChevronLeftIcon, ChevronRightIcon } from './Svg'

export const MaxWidth = styled.div`
  max-width: 1280px;
  margin-left: auto;
  margin-right: auto;
`

export const TwoPanelLayout = styled.div`
  display: flex;
  align-items: stretch;
  position: relative;
  height: 100%;
`

export const MaxWidthLeft = styled(MaxWidth)`
  max-width: 800px;
`

export const MaxWidthRight = styled(MaxWidth)`
  max-width: 400px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: stretch;
`

export const LeftPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: 100%;
  min-height: 100%;
  padding: 40px 24px;
  background: url(${({ theme }) => theme.colors.backgroundPolygon});
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.1s;

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 40px;
  }

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '40px 520px 40px 40px' : '40px')};
  }
`

export const RightPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: 480px;
  max-width: 100%;
  height: 100%;
  padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '48px 24px 24px 24px' : '48px 0 24px 0')};
  position: absolute;
  top: 0;
  right: 0;
  z-index: 7;
  transition: 0.1s;
  transform: ${({ isShowRightPanel }) => (isShowRightPanel ? 'translateX(0)' : 'translateX(100%)')};
  background: ${({ theme }) => theme.colors.backgroundRadial};
  box-shadow: ${({ theme }) => theme.shadows.inset3};

  > .show-hide {
    position: absolute;
    top: 16px;
    right: 100%;
    background: ${({ theme }) => theme.colors.card};
    border-radius: 0;
    border-top-left-radius: ${({ theme }) => theme.radii.medium};
    border-bottom-left-radius: ${({ theme }) => theme.radii.medium};
    flex-direction: column;
    align-items: center;
    padding: 6px 6px 10px 8px;
    font-size: 12px;
    height: auto;
    color: ${({ theme }) => theme.colors.textSubtle};
    box-shadow: ${({ theme }) => theme.shadows.elevation1};

    svg {
      margin: 0 0 2px 0;
      fill: ${({ theme }) => theme.colors.textSubtle};
    }
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    > .show-hide {
      right: ${({ isShowRightPanel }) => (isShowRightPanel ? '0' : '100%')};
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '48px 40px 40px 40px' : '48px 0 40px 0')};

    > .show-hide {
      right: 100%;
    }
  }
`

export const ShowHideButton = ({ isShow, action }) => {
  const { t } = useTranslation()
  return (
    <Button
      className="show-hide"
      startIcon={isShow ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      variant="tertiary"
      onClick={action}
      size="sm"
    >
      {isShow ? t('Hide') : t('Show')}
    </Button>
  )
}
