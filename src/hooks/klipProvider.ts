/* eslint eqeqeq: 0 */
/* eslint camelcase: 0 */

import QRcode from 'qrcode'
import axios from 'axios'

let requestKey = ''
let responseData: any | null = null
let intervalCheckResult: NodeJS.Timeout
let account: string
const initData = () => {
  requestKey = ''
  responseData = null
}

export const genQRcode = () => {
  initData()
  const mockData = {
    bapp: {
      name: 'definix',
    },
    type: 'auth',
  }
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then((response) => {
    requestKey = response.data.request_key
    QRcode.toCanvas(
      document.getElementById('qrcode'),
      `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`,
      () => {
        intervalCheckResult = setInterval(getResult, 1000)
      },
    )
  })
}
const getResult = async () => {
  const url = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
  
  const res = await axios.get(url)
  
  if (res.data.status == 'completed') {
    account = res.data.result.klaytn_address
    responseData = res.data.result.klaytn_address
    clearInterval(intervalCheckResult)
  }
}

export const getAccount = () => account
export const getRequestKey = () => requestKey

export const checkResponse = async (): Promise<string> => {
  return new Promise((resolve) => {
    const interCheck = setInterval(() => {
      
      if (responseData != undefined) {
        clearInterval(interCheck)
        resolve(responseData)
      }
    }, 1000)
  })
}

const getResultContract = async () => {
  const url = `https://a2a-api.klipwallet.com/v2/a2a/result?request_key=${requestKey}`
  const res = await axios.get(url)
  
  if (res.data.status == 'completed') {
    
    responseData = res.data.result.tx_hash
    clearInterval(intervalCheckResult)
  }
}
export const genQRcodeContactInteract = (contractAddress: string, abi: string, input: string) => {
  initData()
  const mockData = {
    bapp: {
      name: 'definix',
    },
    type: 'execute_contract',
    transaction: {
      to: contractAddress,
      value: '0',
      abi,
      params: input,
    },
  }
  axios.post('https://a2a-api.klipwallet.com/v2/a2a/prepare', mockData).then((response) => {
    requestKey = response.data.request_key
    console.log('response.data.request_key', response.data.request_key)
    QRcode.toCanvas(
      document.getElementById('qrcode'),
      `https://klipwallet.com/?target=/a2a?request_key=${response.data.request_key}`,
      () => {
        intervalCheckResult = setInterval(getResultContract, 1000)
      },
    )
  })
}

// interface Props {

// }

// export const ExampleComponent = ({ }: Props) => {
//   return <div >Example Component</div>
// }

// const rootElement = document.getElementById("root");

// ReactDOM.render((<ExampleComponent />), rootElement);
