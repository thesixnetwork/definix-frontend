import { useWallet } from '@binance-chain/bsc-use-wallet'
import axios from 'axios'
import { useTradingCompetRegisContract } from 'hooks/useContract'
import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import styled, { keyframes } from 'styled-components'
import { Button, ChevronLeftIcon, ChevronRightIcon, Input, Modal, Text, useModal } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/for-trading-challenge/IMG_1.png'
import avatar02 from 'uikit-dev/images/for-trading-challenge/IMG_2.png'
import avatar03 from 'uikit-dev/images/for-trading-challenge/IMG_3.png'
import loadingIcon from 'uikit-dev/images/loading-icon.png'
import FailureModal from './FailureModal'
import SuccessModal from './SuccessModal'

// const tradeCompetRegisContract = getTradeCompetRegisContract()
const Avatar = styled.img`
  width: 120px !important;
  border-radius: ${({ theme }) => theme.radii.circle};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TraderProfileModal = ({ onDismiss = () => null, onSuccessRefresh }) => {
  const { account } = useWallet()
  const tradingCompetRegisContract = useTradingCompetRegisContract()

  const [currentSlide, setCurrentSlide] = useState(1)
  const [name, setName] = useState('')
  const [telegramID, setTelegramID] = useState('')
  const [loadingAPI, setLoadingAPI] = React.useState(true)
  const [loadingContract, setLoadingContract] = React.useState(true)

  const handleChangeName = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputName } = evt.target
    setName(inputName)
  }

  const handleChangeTelegram = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { value: inputTelegram } = evt.target
    setTelegramID(inputTelegram)
  }

  const [onPresentSuccessModal] = useModal(
    <SuccessModal
      title="Registration Success"
      detail="Congratulations, your address has been successfully registered."
      onSuccessRefresh={onSuccessRefresh}
    />,
  )
  const [onPresentFailureModal] = useModal(
    <FailureModal
      title="Registration Reject"
      detail="Your account cannot be processed and is rejected. You can register again. Click OK! to continue."
    />,
  )
  const [onPresentFailureAPIModal] = useModal(
    <FailureModal title="Register Fail" detail="Your account does not pass trading rules requirement." />,
  )

  const fetchRegister = async () => {
    setLoadingAPI(false)
    const body = {
      walletAddr: account,
    }
    const tradingCompetRegisAPI = process.env.REACT_APP_API_TRADE_COMPET_VALIDATE
    const response = await axios.post(`${tradingCompetRegisAPI}`, body)

    if (response.data.success === true) {
      setLoadingAPI(true)
      await tradingCompetRegisContract.methods
        .register(`${currentSlide}`, `${name}`, `${telegramID}`)
        .estimateGas({ from: account })
        .then((gasFee) => {
          setLoadingContract(false)
          tradingCompetRegisContract.methods
            .register(`${currentSlide}`, `${name}`, `${telegramID}`)
            .send({ from: account, gas: gasFee })
            .on('receipt', () => {
              onPresentSuccessModal()
            })
            .on('error', () => {
              onPresentFailureModal()
            })
        })
    } else {
      setLoadingAPI(true)
      onPresentFailureAPIModal()
    }
  }

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

  return (
    <Modal title="Fill information and choose profile picture" onDismiss={onDismiss} isRainbow>
      <div style={{ width: '480px', maxWidth: '100%' }}>
        <div className="slider-profile">
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
        </div>

        <div className="my-4">
          <Input placeholder="Your name" className="mb-3" value={name} onChange={handleChangeName} />
          <Input placeholder="Your telegram account (optional)" value={telegramID} onChange={handleChangeTelegram} />
        </div>

        <Text className="mb-4" fontSize="12px">
          Please fill in your personal Telegram @username. (The selected members will be in the Elite Community via
          invitation only)
        </Text>

        {loadingAPI && loadingContract ? (
          <Button fullWidth variant="primary" onClick={fetchRegister}>
            Done
          </Button>
        ) : (
          <></>
        )}
        {!loadingAPI ? (
          <Button fullWidth variant="primary">
            <FloatingLogo src={loadingIcon} alt="" width="25" height="25" className="mr-2" />
            Loading...
          </Button>
        ) : (
          <></>
        )}
        {!loadingContract ? (
          <Button fullWidth variant="primary">
            <FloatingLogo src={loadingIcon} alt="" width="25" height="25" className="mr-2" />
            Waiting confirmation
          </Button>
        ) : (
          <></>
        )}
      </div>
    </Modal>
  )
}
const float = keyframes`
	0% {
		transform: scale(1);
	}
	50% {
		transform: scale(1.1);
	}
	100% {
		transform: scale(1);
	}
`

const FloatingLogo = styled.img`
  animation: ${float} 1s ease-in-out infinite;
`
export default TraderProfileModal
