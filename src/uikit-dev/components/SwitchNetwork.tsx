import useTheme from 'hooks/useTheme'
import React, { memo, useState } from 'react'
import styled from 'styled-components'
import klaytnWhite from '../images/for-ui-v2/toggle-icon/Definix-guide2-03.png'
import klaytn from '../images/for-ui-v2/toggle-icon/Definix-guide2-04.png'
import bscWhite from '../images/for-ui-v2/toggle-icon/Definix-guide2-05.png'
import bsc from '../images/for-ui-v2/toggle-icon/Definix-guide2-06.png'
import { IconButton } from './Button'
import Text from './Text/Text'

const SwitchStyle = styled.div<{ isBsc: boolean }>`
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.backgroundBox};
  border-radius: ${({ theme }) => theme.radii.small};
  padding: 4px;
  position: relative;
  width: 84px;
  height: 40px;

  &:before {
    content: '';
    width: 36px;
    height: 32px;
    position: absolute;
    top: 4px;
    left: 4px;
    transition: 0.2s;
    background: ${({ isBsc }) => (isBsc ? '#f0b80b' : '#4f473c')};
    border-radius: ${({ theme }) => theme.radii.small};
    transform: translateX(${({ isBsc }) => (isBsc ? '0' : 'calc(100% + 4px)')});
  }

  button {
    padding: 0;
    width: 36px !important;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
    background: transparent !important;
    margin-right: 4px;
    position: relative;

    &:last-child {
      margin: 0;
    }

    &:hover {
      > div {
        opacity: 1;
        visibility: visible;
      }
    }
  }
`

const Tooltip = styled(Text)`
  transition: 0.2s;
  width: max-content;
  max-width: 180px;
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translate(-50%, 0);
  z-index: 1;
  font-size: 12px;
  padding: 12px;
  line-height: 1.5;
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.tertiary};
  border-radius: ${({ theme }) => theme.radii.default};
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  opacity: 0;
  visibility: hidden;
  color: ${({ theme }) => theme.colors.textSubtle};

  &:before {
    content: '';
    width: 0;
    height: 0;
    border: 8px solid transparent;
    position: absolute;
    border-bottom-color: ${({ theme }) => theme.colors.white};
    top: -16px;
    left: calc(50% - 8px);
  }
`

const SwitchNetwork = () => {
  const [isBsc] = useState(false)
  const { isDark } = useTheme()

  return (
    <SwitchStyle isBsc={isBsc}>
      <IconButton
        variant="text"
        onClick={() => {
          window.location.href = 'https://bsc.definix.com'
          // setIsBsc(true)
        }}
      >
        <img src={isBsc ? bscWhite : bsc} alt="" width="20px" />
        <Tooltip>Binance Smart Chain</Tooltip>
      </IconButton>
      <IconButton
        variant="text"
        onClick={() => {
          // setIsBsc(false)
        }}
      >
        <img src={!isBsc || isDark ? klaytnWhite : klaytn} alt="" width="20px" />
        <Tooltip>Klaytn Chain</Tooltip>
      </IconButton>
    </SwitchStyle>
  )
}
export default memo(SwitchNetwork)
