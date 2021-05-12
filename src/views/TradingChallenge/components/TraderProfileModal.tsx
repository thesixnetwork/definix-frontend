import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import styled from 'styled-components'
import { Button, ChevronLeftIcon, ChevronRightIcon, Input, Modal, Text, useModal } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/for-trading-challenge/IMG_1558.png'
import avatar02 from 'uikit-dev/images/for-trading-challenge/IMG_1560.png'
import avatar03 from 'uikit-dev/images/for-trading-challenge/IMG_1594.png'
import FailureModal from './FailureModal'
import SuccessModal from './SuccessModal'

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
  const [onPresentFailureModal] = useModal(
    <FailureModal
      title="Registration Reject"
      detail="Your account cannot be processed and is rejected. You can register again. Click OK! to continue."
    />,
  )

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

        <Text className="mb-4" fontSize="12px">
          Please fill in your personal Telegram @username. (The selected members will be in the Elite Community via
          invitation only)
        </Text>

        <Button fullWidth variant="primary" onClick={submit}>
          Done
        </Button>
      </div>
    </Modal>
  )
}

export default TraderProfileModal
