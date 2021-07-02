import React, { useState, useEffect } from 'react'
// import ReactDOM from "react-dom"
// import styled from 'styled-components'
// import { Button, Card, Heading, Text } from 'uikit-dev'
import klipTalk from 'uikit-dev/images/klip/Connect-to-KLIP-02.png'
import klipSearch from 'uikit-dev/images/klip/Connect-to-KLIP-03.png'
import klipQr from 'uikit-dev/images/klip/Connect-to-KLIP-04.png'
import klipIcon from 'uikit-dev/images/klip/Connect-to-KLIP-01.png'
// import { useWallet } from 'klaytn-use-wallet'

interface KlipModalContext {
  showModal: boolean
  setShowModal: (state: boolean) => void
}
export const KlipModalContext = React.createContext<KlipModalContext>(null)

export const KlipModalProvider = ({ children }) => {
  const [showModal, setShowModal] = useState(false)
  const value = { showModal, setShowModal }
  return (
    <KlipModalContext.Provider value={value}>
      {showModal ? <KlipModal /> : null}
      {children}
    </KlipModalContext.Provider>
  )
}
const KlipModal = () => {
  // const { account, connector } = useWallet()
  const [countdown, setCountdown] = useState({
    minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    const endTimer = Date.now() + 5 * 60000
    const CountDownInterval = () => {
      const timer = endTimer - Date.now()
      if (timer >= 0)
        setCountdown({
          minutes: Math.floor((timer % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((timer % (1000 * 60)) / 1000),
        })
    }

    const inter = setInterval(CountDownInterval, 1000)
    return () => {
      clearInterval(inter)
    }
  }, [])

  return (
    <div
      id="customKlipModal"
      style={{
        // display: "none", /* Hidden by default */
        position: 'fixed' /* Stay in place */,
        zIndex: 999 /* Sit on top */,
        left: 0,
        top: 0,
        width: '100%' /* Full width */,
        height: '100%' /* Full height */,
        overflow: 'auto' /* Enable scroll if needed */,
        // backgroundColor: "rgb(0,0,0)", /* Fallback color */
      }}
    >
      <div
        style={{
          backgroundColor: '#fefefe',
          margin: '15% auto' /* 15% from the top and centered */,
          border: '1px solid #888',
          width: '30%',
          borderRadius: '10px',
        }}
      >
        {/* <span class="close">&times;</span> */}
        <div style={{ padding: '20px' }} className="flex">
          <img src={klipIcon} alt="" width="50" style={{ marginRight: '10px' }} />
          <p style={{ verticalAlign: 'sub' }}>Connect to Kakao Klip via QR Code</p>
        </div>
        <div
          style={{
            width: '100%',
            background: 'linear-gradient(45deg,#349BE7,#0D418E)',
            paddingTop: '20px',
            paddingBottom: '20px',
          }}
        >
          <div style={{ color: 'white', lineHeight: '20px' }}>
            <p className="flex justify-center">Scan the QR code through a QR code</p>

            <p className="flex justify-center">reader or the KakaoTalk app.</p>
            <br />
          </div>
          <div className="flex justify-center">
            <canvas id="qrcode" />
          </div>
          <div className="flex justify-center" style={{ marginTop: '20px', marginBottom: '20px' }}>
            <span style={{ color: 'white', marginRight: '10px' }}>Time Remaining:</span>
            <span style={{ color: 'yellow' }}>
              {countdown.minutes} min {countdown.seconds} sec
            </span>
          </div>
        </div>

        {/* footer */}
        <div style={{ paddingBottom: '20px' }}>
          {/* icon */}
          <div className="flex justify-center" style={{ padding: '20px' }}>
            <img width="40" src={klipTalk} alt="" style={{ marginRight: '20px' }} />
            <img width="40" src={klipSearch} alt="" style={{ marginRight: '20px' }} />
            <img width="40" src={klipQr} alt="" />
          </div>
          <div className="flex justify-center" style={{ fontSize: '10px' }}>
            Open Kakaotalk -&gt; Click the search bar -&gt; Log in by scanning the code
          </div>
          <br />
          <div className="flex justify-center" style={{ fontSize: '10px' }}>
            * Klip &gt; Code Scan (from side menu) can be used
          </div>
          <br />
        </div>
      </div>
    </div>
  )
}
export default KlipModal
