import useTheme from 'hooks/useTheme'
import React, { memo, useState } from 'react'
import styled from 'styled-components'
import klaytnWhite from '../images/for-ui-v2/toggle-icon/Definix-guide2-03.png'
import klaytn from '../images/for-ui-v2/toggle-icon/Definix-guide2-04.png'
import bscWhite from '../images/for-ui-v2/toggle-icon/Definix-guide2-05.png'
import bsc from '../images/for-ui-v2/toggle-icon/Definix-guide2-06.png'
import { IconButton } from './Button'

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
    background: ${({ isBsc, theme }) => (isBsc ? '#f0b80b' : '#4f473c')};
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
    overflow: hidden;
    z-index: 1;
    background: transparent !important;
    margin-right: 4px;

    &:last-child {
      margin: 0;
    }
  }
`

const SwitchNetwork = () => {
  const [isBsc, setIsBsc] = useState(true)
  const { isDark } = useTheme()

  return (
    <SwitchStyle isBsc={isBsc}>
      <IconButton
        variant="text"
        onClick={() => {
          setIsBsc(true)
        }}
      >
        <img src={isBsc ? bscWhite : bsc} alt="" width="20px" />
      </IconButton>
      <IconButton
        variant="text"
        onClick={() => {
          setIsBsc(false)
        }}
      >
        <img src={!isBsc || isDark ? klaytnWhite : klaytn} alt="" width="20px" />
      </IconButton>
    </SwitchStyle>
  )
}
export default memo(SwitchNetwork)
