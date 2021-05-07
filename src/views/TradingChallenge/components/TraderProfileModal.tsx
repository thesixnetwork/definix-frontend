import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import styled from 'styled-components'
import { Button, ChevronLeftIcon, ChevronRightIcon, Input, Modal, Text, useModal } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/for-trading-challenge/IMG_1558.png'
import avatar02 from 'uikit-dev/images/for-trading-challenge/IMG_1560.png'
import avatar03 from 'uikit-dev/images/for-trading-challenge/IMG_1594.png'
import SuccessModal from './SuccessModal'
// import FailureModal from './FailureModal'

const Avatar = styled.img`
  width: 120px !important;
  border-radius: ${({ theme }) => theme.radii.circle};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TraderProfileModal = ({ onDismiss = () => null }) => {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [onPresentSuccessModal] = useModal(
    <SuccessModal
      title="Registration Success"
      detail="Congratulations, your address has been successfully registered."
    />,
  )
  // const [onPresentFailureModal] = useModal(<FailureModal title="" detail="" />)

  const settings = {
    infinite: true,
    lazyLoad: true,
    centerMode: true,
    initialSlide: 1,
    variableWidth: true,
    prevArrow: <ChevronLeftIcon />,
    nextArrow: <ChevronRightIcon />,
  }

  useEffect(() => {
    return () => {
      setCurrentSlide(1)
    }
  }, [])

  const submit = () => {
    onPresentSuccessModal()
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
          <Avatar src={avatar01} alt="" />
          <Avatar src={avatar02} alt="" />
          <Avatar src={avatar03} alt="" />
        </Slider>

        <div className="my-4">
          <Input placeholder="Your name" className="mb-3" />
          <Input placeholder="Your Twitter account (optional)" />
        </div>

        <Text className="mb-4">กรุณากรอกชื่อบัญชี Twitter สำหรับท่านที่ Trade ติดอันดับเราจะมีสิทธิพิเศษให้</Text>

        <Button fullWidth variant="primary" onClick={submit}>
          Done!
        </Button>
      </div>
    </Modal>
  )
}

export default TraderProfileModal
