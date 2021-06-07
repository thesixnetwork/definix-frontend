import React from 'react'
import styled from 'styled-components'
import bg from 'uikit-dev/images/for-ui-v2/bg.png'
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
  max-width: 1000px;
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
  padding: 24px;
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.1s;

  ${({ theme }) => theme.mediaQueries.lg} {
    padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '32px 512px 32px 32px' : '32px')};
`

export const RightPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: 480px;
  max-width: 100%;
  height: 100%;
  padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '40px 24px 24px 24px' : '40px 0 24px 0')};
  position: absolute;
  top: 0;
  right: 0;
  z-index: 7;
  transition: 0.1s;
  transform: ${({ isShowRightPanel }) => (isShowRightPanel ? 'translateX(0)' : 'translateX(100%)')};
  background: ${({ theme }) => theme.colors.backgroundRadial};

  > .show-hide {
    position: absolute;
    top: 16px;
    right: 100%;
    background: ${({ theme }) => theme.colors.white};
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
    }
  }

  ${({ theme }) => theme.mediaQueries.xs} {
    > .show-hide {
      right: ${({ isShowRightPanel }) => (isShowRightPanel ? '0' : '100%')};
    }
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '40px 32px 32px 32px' : '40px 0 32px 0')};

    > .show-hide {
      right: 100%;
    }
  }
`

export const ShowHideButton = ({ isShow, action }) => {
  return (
    <Button
      className="show-hide"
      startIcon={isShow ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      variant="tertiary"
      onClick={action}
      size="sm"
    >
      {isShow ? 'Hide' : 'Show'}
    </Button>
  )
}
