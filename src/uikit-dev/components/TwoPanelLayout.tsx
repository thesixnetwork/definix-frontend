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
  flex-grow: 1;
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
  padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '32px 512px 32px 32px' : '32px')};
  background: url(${bg});
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.1s;
`

export const RightPanel = styled.div<{ isShowRightPanel: boolean }>`
  width: 480px;
  height: 100%;
  padding: ${({ isShowRightPanel }) => (isShowRightPanel ? '40px 32px 32px 32px' : '40px 0 32px 0')};
  position: absolute;
  top: 0;
  right: 0;
  transition: 0.1s;
  transform: ${({ isShowRightPanel }) => (isShowRightPanel ? 'translateX(0)' : 'translateX(100%)')};
  background: ${({ theme }) => theme.colors.backgroundRadial};

  > .show-hide {
    position: absolute;
    top: 24px;
    right: 100%;
    background: ${({ theme }) => theme.colors.white};
    border-radius: 0;
    border-top-left-radius: ${({ theme }) => theme.radii.medium};
    border-bottom-left-radius: ${({ theme }) => theme.radii.medium};
    flex-direction: column;
    align-items: center;
    padding: 12px;
    height: auto;
    color: ${({ theme }) => theme.colors.textSubtle};
    box-shadow: ${({ theme }) => theme.shadows.elevation1};

    svg {
      margin: 0 0 8px 0;
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
    >
      {isShow ? 'Hide' : 'Show'}
    </Button>
  )
}
