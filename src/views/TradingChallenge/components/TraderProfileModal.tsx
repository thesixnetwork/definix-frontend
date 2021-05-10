import React, { useEffect, useState } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick-theme.css'
import 'slick-carousel/slick/slick.css'
import { useWallet } from '@binance-chain/bsc-use-wallet'

import { useTradingCompetRegisContract } from 'hooks/useContract'

import styled from 'styled-components'
import axios from 'axios'
import { Button, ChevronLeftIcon, ChevronRightIcon, Input, Modal, Text, useModal } from 'uikit-dev'
import avatar01 from 'uikit-dev/images/for-trading-challenge/IMG_1558.png'
import avatar02 from 'uikit-dev/images/for-trading-challenge/IMG_1560.png'
import avatar03 from 'uikit-dev/images/for-trading-challenge/IMG_1594.png'
import SuccessModal from './SuccessModal'
import FailureModal from './FailureModal'

// const tradeCompetRegisContract = getTradeCompetRegisContract()
const Avatar = styled.img`
  width: 120px !important;
  border-radius: ${({ theme }) => theme.radii.circle};
  border: 1px solid ${({ theme }) => theme.colors.border};
`

const TraderProfileModal = ({ onDismiss = () => null }) => {
  const { account } = useWallet()
  const tradingCompetRegisContract = useTradingCompetRegisContract()

  const [currentSlide, setCurrentSlide] = useState('1')
  console.log('currentSlide =', currentSlide)
  const [name, setName] = useState('')
  const [telegramID, setTelegramID] = useState('')

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
    />,
  )
  const [onPresentFailureModal] = useModal(
    <FailureModal title="Registration False" detail="Your account does not pass trading rules requirement." />,
  )

  const fetchRegister = async () => {
    const body = {
      walletAddr: account,
    }
    console.log('body =', body)
    const response = await axios.post('https://api.young.definix.com/v1.0/trading-compet-validate', body)
    console.log('response =', response)

    if (response.data.success === true) {
      // await fetchTradeCompetRegis()
      console.log('currentSlide = ', currentSlide)
      console.log('name = ', name)
      console.log('telegramID = ', telegramID)
      await tradingCompetRegisContract.methods
        .register(`${currentSlide}`, `${name}`, `${telegramID}`)
        .estimateGas({ from: account })
        .then(function (gas) {
          console.log('gas = ', gas)
          tradingCompetRegisContract.methods
            .register(`${currentSlide}`, `${name}`, `${telegramID}`)
            .send({ from: account, gas: gas })
            .on('receipt', function (receipt) {
              console.log('receipt = ', receipt)
              onPresentSuccessModal()
            })
            .on('error', function (error, receipt) {
              console.log('error = ', error)
              console.log('receipt on error = ', receipt)
              onPresentFailureModal()
            })
        })
    } else {
      console.log('response false')
    }
  }

  // const fetchTradeCompetRegis = async () => {
  //   console.log('account =', account)
  //   // if (account !== undefined || account !== null || account !== null) {
  //   await tradeCompetRegisContract.methods
  //     .register(currentSlide, name, telegramID)
  //     .send({ from: account, gas: 2000000 })
  //     .on('receipt', function (receipt) {
  //       console.log('receipt = ', receipt)
  //       onPresentSuccessModal()
  //     })
  //     .on('error', function (error, receipt) {
  //       console.log('error = ', error)
  //       console.log('receipt on error = ', receipt)
  //       onPresentFailureModal()
  //     })
  //   // }
  // }

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
      setCurrentSlide('1')
    }
  }, [])

  const submit = () => {
    fetchRegister()
    // onPresentSuccessModal()
  }

  return (
    <Modal title="Fill information and choose profile picture" onDismiss={onDismiss} isRainbow>
      <div style={{ width: '480px', maxWidth: '100%' }}>
        <Slider
          {...settings}
          afterChange={(idx) => {
            console.log('idx = ', idx)
            setCurrentSlide(idx)
          }}
        >
          <Avatar src={avatar01} alt="" />
          <Avatar src={avatar02} alt="" />
          <Avatar src={avatar03} alt="" />
        </Slider>

        <div className="my-4">
          <Input placeholder="Your name" className="mb-3" value={name} onChange={handleChangeName} />
          <Input placeholder="Your Telegram account (optional)" value={telegramID} onChange={handleChangeTelegram} />
        </div>

        <Text className="mb-4">
          กรุณากรอก Username ของ Telegram (สำหรับท่านที่ Trade ติดอันดับเราจะมีสิทธิพิเศษให้)
        </Text>

        <Button fullWidth variant="primary" onClick={submit}>
          Done!
        </Button>
      </div>
    </Modal>
  )
}

export default TraderProfileModal
