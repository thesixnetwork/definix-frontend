import React, { memo } from 'react'
import Button from './Button/Button'
import bsc from '../images/Logo-BinanceSmartChain.png'
import klaytn from '../images/Logo-Klaytn.png'
import MenuButton from '../widgets/Menu/MenuButton'
import Dropdown from './Dropdown/Dropdown'
import ChevronDownIcon from './Svg/Icons/ChevronDown'
import Text from './Text/Text'

const DropdownNetwork = () => {
  return (
    <Dropdown
      position="bottom"
      target={
        <Button
          variant="text"
          size="sm"
          startIcon={<img src={klaytn} alt="" width="20px" className="mr-2" />}
          endIcon={<ChevronDownIcon className="ml-1" />}
          color="text"
          className="network px-2"
        >
          <Text fontSize="12px" fontWeight="500">
            Klaytn Chain
          </Text>
        </Button>
      }
    >
      <MenuButton
        href="https://klaytn.definix.com"
        variant="text"
        startIcon={<img src={klaytn} alt="" width="24" className="mr-2" />}
        className="color-primary text-bold mb-2"
      >
        Klaytn Chain
      </MenuButton>
      <MenuButton
        href="https://bsc.definix.com"
        variant="text"
        startIcon={<img src={bsc} alt="" width="24" className="mr-2" />}
        className="color-primary mb-2"
      >
        Binance Smart Chain
      </MenuButton>
    </Dropdown>
  )
}
export default memo(DropdownNetwork)
