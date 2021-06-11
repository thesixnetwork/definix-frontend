import React, { memo } from 'react'
import styled from 'styled-components'
import { Button } from 'uikit-dev'
import bsc from '../images/Logo-BinanceSmartChain.png'
import klaytn from '../images/Logo-Klaytn.png'
import MenuButton from '../widgets/Menu/MenuButton'
import Dropdown from './Dropdown/Dropdown'
import ChevronDownIcon from './Svg/Icons/ChevronDown'
import Text from './Text/Text'

const CustomButton = styled(Button)`
  box-shadow: ${({ theme }) => theme.shadows.elevation1};
  background: ${({ theme }) => theme.colors.networkBtnInner} !important;
  border: 1px solid ${({ theme }) => theme.colors.networkBtnBorder} !important;
  max-width: 100%;
  overflow: hidden;
  min-width: max-content;
`

const DropdownNetwork = () => {
  return (
    <Dropdown
      position="bottom"
      target={
        <CustomButton
          variant="text"
          size="sm"
          startIcon={<img src={bsc} alt="" width="20px" className="mr-2" />}
          endIcon={<ChevronDownIcon className="ml-1" />}
          color="text"
          className="network px-2"
        >
          <Text fontSize="12px" fontWeight="500">
            Binance Smart Chain
          </Text>
        </CustomButton>
      }
    >
      <MenuButton
        variant="text"
        startIcon={<img src={bsc} alt="" width="20px" className="mr-2" />}
        className="color-primary text-bold mb-2"
      >
        Binance Smart Chain
      </MenuButton>
      <MenuButton
        variant="text"
        startIcon={<img src={klaytn} alt="" width="20px" className="mr-2" />}
        style={{ background: 'transparent' }}
      >
        Klaytn
      </MenuButton>
    </Dropdown>
  )
}
export default memo(DropdownNetwork)
