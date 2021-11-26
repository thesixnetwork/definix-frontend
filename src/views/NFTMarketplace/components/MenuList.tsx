import React, { useCallback } from 'react'
import styled from 'styled-components'
import * as Scroll from 'react-scroll'
// import { Flex, Text } from 'components/Common';
import { Flex, Text } from '../../../uikit-dev'

interface MenuListProps {
  //   theme: themeType;
  activeIndex: number
  listData: any
  setActiveIndex: (index: number) => void
}

interface Props {
  label: string
  link: string
  isActive: boolean
  //   theme: themeType;
  onActive: () => void
}

const MenuListWrap = styled(Flex)`
  align-items: center;
  height: 100%;
`

const Item = styled.button<{ isActive: boolean }>`
  display: flex;
  align-items: center;

  color: #0973b9;
  border-bottom: 2px solid #0973b9;
  height: 100%;

  transition: border-bottom 0.2s;
  margin-right: 56px;
  &:last-child {
    margin-right: 0;
  }
`

export const getOffsetTop = (el: HTMLElement): number => {
  let offsetTop = el ? el.offsetTop : 0
  const target = el.offsetParent
  if (!target) return offsetTop

  if (target.tagName !== 'BODY') {
    offsetTop += (target as HTMLElement).offsetTop
  }

  return offsetTop
}
export const PcBrandBoxHeight = 60
const MenuItem: React.FC<Props> = ({ label, link, isActive = false, onActive }) => {
  const onMove = useCallback(() => {
    onActive()
    const el = document.getElementById(link)
    if (!el) return
    const y = getOffsetTop(el) - PcBrandBoxHeight
    Scroll.animateScroll.scrollTo(y)
    // window.scroll. .animateScroll.scrollTo(y);
  }, [onActive, link])
  return (
    <Item isActive={isActive} onClick={onMove}>
      <Text className="R16M">{label}</Text>
    </Item>
  )
}

const MenuList: React.FC<MenuListProps> = ({ listData, activeIndex, setActiveIndex }) => {
  return (
    <MenuListWrap>
      {listData.map((data, index) => (
        <MenuItem
          key={data.id}
          isActive={activeIndex === index}
          label={data.name}
          link={data.name}
          onActive={() => setActiveIndex(index)}
        />
      ))}
    </MenuListWrap>
  )
}

export default MenuList
