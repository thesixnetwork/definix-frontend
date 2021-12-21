/* eslint eqeqeq: 0 */
/* eslint camelcase: 0 */

import QRcode from 'qrcode'
import axios from 'axios'
import { isMobile } from 'react-device-detect'

const RESPONSE_STATE = {
  PREPARED: 'prepared',
  REQUESTED: 'requested',
  COMPLETED: 'completed',
  CANCELED: 'canceled',
}
const MAX_INTERVAL_TIME = 300 // 300 // 5분

let requestKey = ''
let responseData: any | null = null
let responseState = '' // prepared, requested, completed, canceled
let contractResultInterval: NodeJS.Timeout
let checkResponseInterval: NodeJS.Timeout
let account: string

const initData = () => {
  requestKey = ''
  responseData = null
  responseState = ''
}

// export const genQRcode = () => {
//   initData()
//   const mockData = {
//     bapp: {
//       name: 'definix',
//     },
//     type: 'auth',
//   }
//   axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then((response) => {
//     requestKey = response.data.request_key
//     if (isMobile === true) {
//       const url = `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`
//       // await axios.get(url)
//       contractResultInterval = setInterval(getResultContract, 1000)
//       openDeeplink(url)
//     } else {
//       QRcode.toCanvas(
//         document.getElementById('qrcode'),
//         `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`,
//         () => {
//           contractResultInterval = setInterval(getResult, 1000)
//         },
//       )
//     }
//   })
// }
// const getResult = async () => {
//   const url = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`

//   const res = await axios.get(url)

//   if (res.data.status == 'completed') {
//     account = res.data.result.klaytn_address
//     responseData = res.data.result.klaytn_address
//     clearInterval(contractResultInterval)
//   }
// }

export const getAccount = () => account
export const getRequestKey = () => requestKey


export const checkResponse = async (): Promise<string> => {
  return new Promise((resolve, reject) => {
    let time = 0
    checkResponseInterval = setInterval(() => {
      if (time >= MAX_INTERVAL_TIME) {
        clearInterval(checkResponseInterval)
        reject(responseState)
      } else {
        time++
        if (responseData != undefined && responseState === RESPONSE_STATE.COMPLETED) {
          clearInterval(checkResponseInterval)
          resolve(responseData)
        }
        if (responseState === RESPONSE_STATE.CANCELED) {
          clearInterval(checkResponseInterval)
          reject(responseState)
        }
      }
    }, 1000)
  })
}

const startContractResultInterval = () => {
  let time = 0
  contractResultInterval = setInterval(() => {
    if (time >= MAX_INTERVAL_TIME) {
      clearContractResultInterval()
    } else {
      time++
      getResultContract()
    }
  }, 1000)
}
const clearContractResultInterval = () => {
  clearInterval(contractResultInterval)
}

const getResultContract = async () => {
  const url = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
  const res = await axios.get(url)
  responseState = res.data.status.toLowerCase()
  if (responseState == RESPONSE_STATE.COMPLETED) {
    responseData = res.data.result.tx_hash
    clearInterval(contractResultInterval)
  }
  if (responseState === RESPONSE_STATE.CANCELED) {
    clearInterval(contractResultInterval)
  }
}
export const genQRcodeContactInteract = (
  contractAddress: string,
  abi: string,
  input: string,
  setShowModal: (bool: boolean) => void,
  value?: string,
) => {
  initData()
  clearInterval(checkResponseInterval)
  clearContractResultInterval()

  const mockData = {
    bapp: {
      name: 'definix',
    },
    type: 'execute_contract',
    transaction: {
      to: contractAddress,
      value: value || '0',
      abi,
      params: input,
    },
  }
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then((response) => {
    requestKey = response.data.request_key
    const url = `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`
    if (isMobile === true) {
      startContractResultInterval()
      setTimeout(() => {
        openDeeplink(url)
      }, 1000)
    } else {
      setShowModal(true)
      QRcode.toCanvas(document.getElementById('qrcode'), url, () => {
        startContractResultInterval()
      })
    }
  })
}

// interface Props {

// }

// export const ExampleComponent = ({ }: Props) => {
//   return <div >Example Component</div>
// }

// const rootElement = document.getElementById("root");

// ReactDOM.render((<ExampleComponent />), rootElement);
const openDeeplink = async (url: string) => {
  const checkRedirect = window.open(url, '_blank')
  if (checkRedirect === null) {
    window.location.href = `kakaotalk://klipwallet/open?url=${url}`
    setTimeout(() => {
      if (document.hasFocus()) {
        window.location.replace(
          'https://apps.apple.com/kr/app/%EC%B9%B4%EC%B9%B4%EC%98%A4%ED%86%A1-kakaotalk/id362057947',
        )
      }
    }, 4500)
  }
}

export const MAX_UINT_256_KLIP = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
