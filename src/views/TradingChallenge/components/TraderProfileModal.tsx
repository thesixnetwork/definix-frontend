import React, { useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import styled from 'styled-components'
import { Button, ChevronLeftIcon, ChevronRightIcon, Input, Modal, Text } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/fund-manager/twitter-profile/01.png'
import avatar02 from 'uikit-dev/images/fund-manager/twitter-profile/02.png'
import avatar03 from 'uikit-dev/images/fund-manager/twitter-profile/03.png'

const Img = styled.img`
  width: 120px !important;
`

const TraderProfileModal = ({ onDismiss = () => null }) => {
  const [currentSlide, setCurrentSlide] = useState(1)

  const settings = {
    infinite: true,
    lazyLoad: true,
    centerMode: true,
    initialSlide: 1,
    variableWidth: true,
    prevArrow: <ChevronLeftIcon />,
    nextArrow: <ChevronRightIcon />,
  }

  return (
    <Modal title="Fill information and choose profile picture" onDismiss={onDismiss} isRainbow>
      <div style={{ width: '480px', maxWidth: '100%' }}>
        <Slider
          {...settings}
          afterChange={(idx) => {
            setCurrentSlide(idx)
          }}
        >
          <Img src={avatar01} alt="" />
          <Img src={avatar02} alt="" />
          <Img src={avatar03} alt="" />
        </Slider>

        <div className="my-4">
          <Input placeholder="Your name" className="mb-3" />
          <Input placeholder="Your Twitter account (optional)" />
        </div>

        <Text className="mb-4">กรุณากรอกชื่อบัญชี Twitter สำหรับท่านที่ Trade ติดอันดับเราจะมีสิทธิพิเศษให้</Text>

        <Button fullWidth variant="primary">
          Done!
        </Button>
      </div>
    </Modal>
  )
}

export default TraderProfileModal
