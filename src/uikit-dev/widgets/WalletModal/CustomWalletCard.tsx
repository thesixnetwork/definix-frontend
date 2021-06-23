import { Button, Text, Modal } from 'uikit-dev'
import React, { useEffect, useState } from 'react'
import QRcode from 'qrcode'
import axios from 'axios'

interface ResponseGetAuth {
  data: {
    result: any
  }
}
const CustomWalletCard = () => {
  const [requestKey, setRequestKey] = useState<string>()
  const getResult = () => {
    axios
      .get(`https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`)
      .then((res) => {
        alert(`json result : ${res.data.result.klaytn_address}`)
      })
      .catch(function (error) {
        // handle error
        console.log('err ', error)
      })
  }

  // useEffect(() => {

  //     // const interval= setInterval(getResult,5000)
  //     // return ()=>clearInterval(interval)
  // }, [])
  return (
    <>
      <Button
        fullWidth
        variant="tertiary"
        onClick={() => {
          const mockData = {
            bapp: {
              name: 'definix',
            },
            type: 'auth',
          }
          axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then((response) => {
            setRequestKey(response.data.request_key)
            QRcode.toCanvas(
              document.getElementById('qrcode'),
              `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`,
              function (error, data) {
                if (error) console.error('error', error)
                console.log('success!', data)
              },
            )
          })
        }}
        style={{ justifyContent: 'space-between' }}
        mb="8px"
      >
        <Text bold color="primary" mr="16px">
          Klip
        </Text>
      </Button>
      <br />
      <div style={{ width: '100%' }}>
        <canvas id="qrcode" style={{ float: 'left', width: '200px' }} />
        <Button onClick={getResult}>getResult</Button>
      </div>
    </>
  )
}
export default CustomWalletCard
